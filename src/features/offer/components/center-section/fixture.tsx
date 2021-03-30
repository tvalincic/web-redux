import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFixtureById,
  selectMainFixtureMarketId,
} from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { Market } from "./market";
import { changeActiveFixture } from "../../state/slice";

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
  const dispatch = useDispatch();
  if (!fixture || !mainMarket) return null;

  const clickHandler = () => {
    dispatch(changeActiveFixture(String(id)));
  };

  return (
    <div className="fixture-grid fixture" key={fixture.id}>
      <div className="fixture-title" onClick={clickHandler}>
        {fixture.home.name} - {fixture.away.name}
      </div>
      {!!mainMarket && <Market id={mainMarket} />}
    </div>
  );
};
