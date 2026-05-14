import React from 'react';

const TruckLoader = () => {
  return (
    <div className="truck-loader">
      <div className="truckWrapper">
        <div className="truckBody">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 198 93"
            className="w-full h-full"
          >
            {/* Main Body (Cargo area) */}
            <rect
              strokeWidth="2"
              stroke="white"
              fill="white"
              rx="4"
              height="80"
              width="120"
              y="5"
              x="5"
            />
            
            {/* RED PLUS SYMBOL */}
            <rect x="55" y="25" width="20" height="40" rx="2" fill="#ef4444" />
            <rect x="45" y="35" width="40" height="20" rx="2" fill="#ef4444" />

            {/* Cab */}
            <path
              strokeWidth="2"
              stroke="white"
              fill="#ef4444" 
              d="M130 25H170C175 25 178 28 179 33L190 55V85H130V25Z"
            />
            
            {/* Window */}
            <path
              fill="#1e293b"
              d="M140 35H165C168 35 170 37 171 40L178 55H140V35Z"
            />
          </svg>
        </div>
        <div className="truckTires">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 30 30"
            className="tiresvg"
          >
            <circle stroke="white" strokeWidth="3" fill="#0f172a" r="13" cy="15" cx="15" />
            <circle fill="white" r="5" cy="15" cx="15" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 30 30"
            className="tiresvg"
          >
            <circle stroke="white" strokeWidth="3" fill="#0f172a" r="13" cy="15" cx="15" />
            <circle fill="white" r="5" cy="15" cx="15" />
          </svg>
        </div>
        <div className="road"></div>
      </div>
    </div>
  );
};

export default TruckLoader;
