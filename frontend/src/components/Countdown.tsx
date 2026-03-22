'use client';

import { useState, useEffect } from 'react';

export const Countdown = ({ seconds, onComplete }: { seconds: number; onComplete?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (s: number) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <span className="font-mono font-bold text-orange-500">
      {timeLeft > 0 ? formatTime(timeLeft) : "Ready to request!"}
    </span>
  );
};
