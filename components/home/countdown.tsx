"use client";

import { useEffect, useState } from "react";

function untilMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
}

/** Countdown to the end of the day, used for the daily deals banner. */
export function Countdown() {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start the clock only on the client to avoid hydration mismatch
    setSeconds(untilMidnight());
    const timer = setInterval(() => setSeconds(untilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = [
    ["Hours", seconds === null ? null : Math.floor(seconds / 3600)],
    ["Mins", seconds === null ? null : Math.floor((seconds % 3600) / 60)],
    ["Secs", seconds === null ? null : seconds % 60],
  ] as const;

  return (
    <div className="flex gap-3" aria-label="Time left for today's deals">
      {parts.map(([label, value]) => (
        <div key={label} className="glass min-w-18 rounded-xl border border-neon/30 px-3 py-2 text-center">
          <p className="font-display text-2xl font-bold tabular-nums text-gradient">
            {value === null ? "--" : String(value).padStart(2, "0")}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}
