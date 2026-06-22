import { useMemo } from 'react';
import React from 'react';
import { transform } from '@babel/standalone';
import { motion } from 'framer-motion';

/**
 * Aggressively clean LLM output to extract just the JS expression.
 */
function cleanLLMCode(raw) {
  let code = raw.trim();

  // Remove markdown code fences
  code = code.replace(/^```[a-z]*\s*\n?/i, '');
  code = code.replace(/\n?\s*```\s*$/g, '');
  code = code.replace(/^```[a-z]*\s*\n?/i, '');
  code = code.replace(/\n?\s*```\s*$/g, '');

  code = code.trim();

  // Fix common LLM syntax mistakes:
  // 1. Double parenthesis in cleanup arrow function: return () () => ...
  code = code.replace(/(\(\s*\)\s*){2,}=>/g, '() =>');

  // Ensure code starts with the factory expression
  const factoryMatch = code.match(/\(\s*motion\s*,\s*React\s*\)/);
  if (factoryMatch) {
    code = code.substring(factoryMatch.index);
  }

  // Trim trailing text after the balanced closing brace
  const isFactory = /^\(\s*motion\s*,\s*React\s*\)/.test(code);
  if (isFactory && !code.endsWith('null')) {
    const lastBrace = findBalancedEnd(code);
    if (lastBrace !== -1 && lastBrace < code.length - 1) {
      code = code.substring(0, lastBrace + 1);
    }
  }

  return code.trim();
}

/**
 * Find the index of the closing brace that balances the first opening brace.
 */
function findBalancedEnd(code) {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let inTemplate = false;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const prev = i > 0 ? code[i - 1] : '';

    if (!inString && !inTemplate && (ch === '"' || ch === "'")) {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (inString && ch === stringChar && prev !== '\\') {
      inString = false;
      continue;
    }
    if (!inString && !inTemplate && ch === '`') {
      inTemplate = true;
      continue;
    }
    if (inTemplate && ch === '`' && prev !== '\\') {
      inTemplate = false;
      continue;
    }
    if (inString || inTemplate) continue;

    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Transform JSX code to plain JS using Babel standalone.
 * This runs in the browser and converts <motion.div> → React.createElement(motion.div, ...)
 */
function transformJSX(code) {
  try {
    // Wrap in an export so Babel can parse it as a full module
    const wrapped = `const __component = ${code}`;
    const result = transform(wrapped, {
      presets: ['react'],
      // Don't add module wrapper
      sourceType: 'script',
    });
    // Extract back: remove "var __component = " and trailing semicolon
    let transformed = result.code;
    transformed = transformed.replace(/^(?:var|const|let) __component\s*=\s*/, '');
    transformed = transformed.replace(/;\s*$/, '');
    return transformed;
  } catch (err) {
    console.error('Babel JSX transform failed:', err.message);
    console.error('Code being transformed:', code.substring(0, 200));
    throw new Error(`JSX transform failed: ${err.message}`, { cause: err });
  }
}

/**
 * Dynamically evaluates LLM-generated animation code and renders it.
 *
 * Pipeline:
 * 1. Clean markdown fences and trailing text
 * 2. Transform JSX → React.createElement via Babel
 * 3. Evaluate with new Function() (motion + React in scope)
 * 4. Call the factory to get the component
 */
export default function AnimationRenderer({ code }) {
  const animationElement = useMemo(() => {
    if (!code) return null;

    try {
      const cleanCode = cleanLLMCode(code);

      console.log('--- Animation Code (cleaned, first 300 chars):', cleanCode.substring(0, 300));

      // Check for explicit null return
      if (
        cleanCode.includes('=> null') ||
        cleanCode === 'null' ||
        cleanCode === ''
      ) {
        console.log('--- Animation: null (skipped)');
        return null;
      }

      // Step 1: Transform JSX to React.createElement calls
      const jsCode = transformJSX(cleanCode);
      console.log('--- Babel output (first 300 chars):', jsCode.substring(0, 300));

      // Step 2: Evaluate with new Function — inject motion + React
      const factory = new Function(
        'motion',
        'React',
        `"use strict"; return (${jsCode})`
      );

      // Step 3: Get the arrow function
      const arrowFn = factory(motion, React);

      if (arrowFn === null) return null;

      if (typeof arrowFn !== 'function') {
        console.warn('AnimationRenderer: eval result is not a function, got:', typeof arrowFn);
        return null;
      }

      // Step 4: Call the arrow function to get the component
      const Component = arrowFn(motion, React);

      if (Component === null) return null;

      if (typeof Component === 'function') {
        console.log('--- Animation: component created successfully ✓');
        // eslint-disable-next-line react-hooks/error-boundaries, react-hooks/static-components
        return <Component />;
      }

      console.warn('AnimationRenderer: unexpected result type:', typeof Component);
      return null;
    } catch (err) {
      console.error('AnimationRenderer: error:', err.message);
      throw err; // Let ErrorBoundary catch it
    }
  }, [code]);

  if (!animationElement) return null;

  return (
    <div className="w-full max-w-full overflow-hidden flex justify-center">
      {animationElement}
    </div>
  );
}
