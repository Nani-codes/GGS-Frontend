"use client";

import { useEffect } from 'react';

export function WhatsAppPopup() {
  const whatsappGroupLink = "https://chat.whatsapp.com/EzoQyhdO1ns6abtg58q7t8";
  
  useEffect(() => {
    // Add styles to document head if not already added
    const styleId = 'whatsapp-popup-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .whatsapp-icon {
          position: fixed;
          display: inline-block;
          right: 30px;
          bottom: 45px;
          z-index: 99;
        }
        
        .whatsapp-icon button {
          position: relative;
          display: inline-block;
          width: 45px;
          height: 45px;
          line-height: 47px;
          text-align: center;
          font-size: 20px;
          color: #fff;
          border-radius: 5px;
          background: #25D366;
          z-index: 1;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        
        .whatsapp-icon button:before {
          content: "";
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background-color: rgba(37, 211, 102, 0.20);
          border-radius: 5px;
          z-index: -1;
        }
        
        .whatsapp-icon button:hover {
          background: #20BA5A;
          transform: scale(1.1);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  const handleClick = () => {
    window.open(whatsappGroupLink, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="whatsapp-icon">
      <button 
        type="button" 
        className="whatsapp-toggler"
        onClick={handleClick}
        aria-label="Join WhatsApp Group"
      >
        <i className="fab fa-whatsapp" />
      </button>
    </div>
  );
}

