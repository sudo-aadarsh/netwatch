import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AppNormal from './AppNormal';
import AppCod from './AppCod';

export default function App() {
  const [theme, setTheme] = useState('cod');
  const [searchContainer, setSearchContainer] = useState(null);

  useEffect(() => {
    // Let the child component render first
    const timer = setTimeout(() => {
      setSearchContainer(document.querySelector('.search-wrapper'));
    }, 100);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <>
      <style>{`
        /* Override search-wrapper to layout the input and button nicely */
        .search-wrapper {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          max-width: 420px !important; 
        }
        
        .search-wrapper input {
          flex: 1;
          padding: 8px 16px !important;
          font-size: 12px !important;
        }

        .theme-toggle-btn {
          height: 33px;
          padding: 0 16px;
          border: none;
          border-radius: 20px;
          font-weight: 700;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .theme-toggle-btn:hover {
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .desktop-theme-btn {
            display: none !important;
          }
          .mobile-theme-btn {
            display: flex !important;
            position: fixed !important;
            bottom: 16px !important;
            right: 16px !important;
            height: 40px !important;
            padding: 0 20px !important;
            border-radius: 20px !important;
            z-index: 999999 !important;
            font-size: 11px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
            background: #ff8c00;
            color: #050505;
            font-family: 'Share Tech Mono', monospace;
            border: none;
            font-weight: 700;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            letter-spacing: 1px;
          }
          .mobile-theme-btn.normal-mode {
            background: #00e5cc;
            color: #030b14;
            font-family: 'Inter', sans-serif;
            letter-spacing: normal;
          }
        }
        @media (min-width: 769px) {
          .mobile-theme-btn {
            display: none !important;
          }
        }
      `}</style>
      {theme === 'normal' ? <AppNormal /> : <AppCod />}
      
      {/* MOBILE BUTTON (Root level, avoids header transform) */}
      <button 
        className={`mobile-theme-btn ${theme === 'normal' ? 'normal-mode' : ''}`}
        onClick={() => setTheme(theme === 'normal' ? 'cod' : 'normal')}
      >
        {theme === 'normal' ? 'COD THEME' : 'NORMAL THEME'}
      </button>

      {/* DESKTOP BUTTON (Portaled into search-wrapper) */}
      {searchContainer && createPortal(
        <button 
          className="theme-toggle-btn desktop-theme-btn"
          onClick={() => setTheme(theme === 'normal' ? 'cod' : 'normal')}
          style={{
            background: theme === 'normal' ? '#00e5cc' : '#ff8c00',
            color: theme === 'normal' ? '#030b14' : '#050505',
            fontFamily: theme === 'normal' ? "'Inter', sans-serif" : "'Share Tech Mono', monospace",
            boxShadow: `0 0 15px ${theme === 'normal' ? 'rgba(0,229,204,0.5)' : 'rgba(255,140,0,0.5)'}`,
            letterSpacing: theme === 'normal' ? 'normal' : '1px'
          }}
        >
          {theme === 'normal' ? 'COD THEME' : 'NORMAL THEME'}
        </button>,
        searchContainer
      )}
    </>
  );
}
