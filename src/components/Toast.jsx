import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
  const textColor = 'white';

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: backgroundColor,
      color: textColor,
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span>{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: textColor,
          fontSize: '1rem',
          cursor: 'pointer',
          marginLeft: '0.5rem'
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
