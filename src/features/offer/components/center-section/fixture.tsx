import React from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import {
  selectFixtureById,
  selectMainFixtureMarketId,
  selectOfferById,
  selectScoreById,
} from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { Market } from "./market";
import { changeActiveFixture } from "../../state/slice";
import { Score } from "./score";

interface IFixtureProps {
  id: React.ReactText;
}

export const Fixture = ({ id }: IFixtureProps) => {
  const fixture = useSelector((state: RootState) =>
    selectFixtureById(state, id)
  );
  const offer = useSelector((state: RootState) => selectOfferById(state, id));
  const score = useSelector((state: RootState) => selectScoreById(state, id));
  const mainMarket = useSelector((state: RootState) =>
    selectMainFixtureMarketId(state, id)
  );
  const dispatch = useDispatch();
  if (!fixture || !mainMarket) return null;

  const clickHandler = () => {
    dispatch(changeActiveFixture(String(id)));
  };

  return (
    <div
      className={classnames("fixture-grid fixture", {
        stopped: offer?.stopped,
      })}
      key={fixture.id}
    >
      <div className="fixture-title" onClick={clickHandler}>
        <span className="score-period">{score?.progress}</span>
        <span className="fixture-name">
          {fixture.home.name} - {fixture.away.name}
        </span>
      </div>
      <Score id={id} />
      {!!mainMarket && (
        <Market id={mainMarket} stoppedOffer={!!offer?.stopped} />
      )}
    </div>
  );
};
