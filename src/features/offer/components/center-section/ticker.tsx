import React from "react";
import classnames from "classnames";
import { useTicker } from "./useTicker";

interface ITickerProps {
  trend: number;
  price: number;
}

export const Ticker = ({ trend, price }: ITickerProps) => {
  const ticker = useTicker(price);
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
