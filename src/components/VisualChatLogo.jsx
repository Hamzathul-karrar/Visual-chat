import React from 'react';
import logoUrl from '../assets/logo.png';

export default function VisualChatLogo({ size = 24, style, ...props }) {
  return (
    <img
      src={logoUrl}
      width={size}
      height={size}
      alt="Visual Chat Logo"
      style={{ display: 'block', objectFit: 'contain', ...style }}
      {...props}
    />
  );
}
