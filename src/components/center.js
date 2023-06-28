import React from 'react';

export default function Center({ children }) {
  return (
    <div className="d-flex h-100 w-100 justify-content-center align-items-center">
      {children}
    </div>
  );
}
