import React, { useEffect, useState } from "react";

export const useTicker = (tick: React.ReactText) => {
  const [ticker, setTicker] = useState(true);
  useEffect(() => {
    setTicker(false);
  }, [tick]);

  useEffect(() => {
    setTicker(true);
  }, [ticker]);
  return ticker;
};
