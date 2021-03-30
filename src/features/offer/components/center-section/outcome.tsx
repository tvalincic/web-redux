import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectOutcomeById } from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { toggleOutcome } from "../../../betslip";
import classnames from "classnames";
import { Ticker } from "./ticker";

interface IOutcomeProps {
  id: React.ReactText | null;
  showName?: boolean;
}

const EmptyOutcome = () => <div className="fixture-outcome">-</div>;

export const Outcome = ({ id, showName }: IOutcomeProps) => {
  const outcome = useSelector((state: RootState) =>
    selectOutcomeById(state, id || "")
  );
  const dispatch = useDispatch();
  if (!outcome) return <EmptyOutcome />;
  const clickHandler = () => {
    dispatch(toggleOutcome(outcome.id));
  };
  return (
    <div
      className={classnames("fixture-outcome selectable", {
        selected: !!outcome.selected,
        "named-outcome": showName,
      })}
      onClick={clickHandler}
    >
      {showName && <span className="name">{outcome.name}</span>}
      <span className="odds">{outcome.odds}</span>
      {!!outcome.trend ? (
        <Ticker trend={outcome.trend} price={outcome.odds} />
      ) : null}
    </div>
  );
};
