import React from "react";
import { useSelector } from "react-redux";
import {
  selectFixtureById,
  selectMainFixtureMarketId,
} from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { Market } from "./market";

interface IFixtureProps {
  id: React.ReactText;
}

export const Fixture = ({ id }: IFixtureProps) => {
  const fixture = useSelector((state: RootState) =>
    selectFixtureById(state, id)
  );
  const mainMarket = useSelector((state: RootState) =>
    selectMainFixtureMarketId(state, id)
  );
  if (!fixture || !mainMarket) return null;
  return (
    <div className="fixture-grid fixture" key={fixture.id}>
      <div className="fixture-title">
        {fixture.home.name} - {fixture.away.name}
      </div>
      {!!mainMarket && <Market id={mainMarket} />}
    </div>
  );
};
