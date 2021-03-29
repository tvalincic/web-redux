import React, { useEffect, useState } from "react";
import classnames from "classnames";

interface ITickerProps {
  trend: number;
  price: number;
}

export const Ticker = ({ trend, price }: ITickerProps) => {
  const [ticker, setTicker] = useState(true);

  useEffect(() => {
    setTicker(false);
  }, [price]);

  useEffect(() => {
    setTicker(true);
  }, [ticker]);

  if (!ticker) return null;

  return (
    <div
      className={classnames("ticker", {
        up: trend > 0,
        down: trend < 0,
      })}
    ></div>
  );
};
