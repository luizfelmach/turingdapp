"use client";

import type React from "react";
import { useEffect, useState } from "react";

const AnimatedBackground: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading) return null;

  return (
    <div className="fixed inset-0 z-0">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A00E0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8E2DE2" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)">
          <animate
            attributeName="opacity"
            values="0.3;0.5;0.3"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>
        {[...Array(20)].map((_, i) => (
          <circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={`${Math.random() * 2 + 1}%`}
            fill="white"
            opacity="0.1"
            className="blur-xl"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur={`${Math.random() * 4 + 3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${Math.random() * 100}%;${Math.random() * 100}%`}
              dur={`${Math.random() * 10 + 10}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default AnimatedBackground;
