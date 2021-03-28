import React from "react";
import { useSelector } from "react-redux";
import { selectMarketById } from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { Line } from "./line";

interface IMarketProps {
  id: React.ReactText;
}

export const Market = ({ id }: IMarketProps) => {
  const market = useSelector((state: RootState) => selectMarketById(state, id));
  if (!market) return null;
  return (
    <div className="market">
      {market.lines.map((line) => (
        <Line id={line} key={line} />
      ))}
    </div>
  );
};
