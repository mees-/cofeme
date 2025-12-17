"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";

type TimerProps = {
  expiresAt: Date;
};

export function Timer({ expiresAt }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = DateTime.now();
      const expiry = DateTime.fromJSDate(expiresAt);
      const diff = expiry.diff(now, ["minutes", "seconds"]);

      if (diff.toMillis() <= 0) {
        setTimeRemaining("Expired");
        return;
      }

      const minutes = Math.floor(diff.minutes);
      const seconds = Math.floor(diff.seconds % 60);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg p-6 text-center text-white">
      <h2 className="text-sm font-medium mb-2 opacity-90">Time Remaining</h2>
      <div className="text-5xl font-bold">{timeRemaining}</div>
    </div>
  );
}
