import React from "react";
import { useSelector } from "react-redux";
import { selectMarketById } from "../../../state/selectors";
import { RootState } from "../../../../../app/store";
import { Line } from "./line";

interface IMarket {
  id: React.ReactText;
}

export const Market = ({ id }: IMarket) => {
  const market = useSelector((state: RootState) => selectMarketById(state, id));
  if (!market) return null;
  return (
    <section className="market">
      <div className="lines">
        {market.lines.map((line) => (
          <Line id={line} key={line} />
        ))}
      </div>
    </section>
  );
};
