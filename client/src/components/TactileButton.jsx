import React from 'react';

const TactileButton = ({ children, onClick, className = "" }) => {
  return (
    <button className={`premium-tactile-button ${className}`} onClick={onClick}>
      <div className="button-outer">
        <div className="button-inner">
          <span>{children}</span>
        </div>
      </div>
    </button>
  );
};

export default TactileButton;
