import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectOutcomeById } from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { toggleOutcome } from "../../../betslip";
import classnames from "classnames";
import { Ticker } from "./ticker";

interface IOutcomeProps {
  id: React.ReactText | null;
  stopped: boolean;
  showName?: boolean;
}

interface IEmptyOutcomeProps {
  stopped: boolean;
}

const EmptyOutcome = ({ stopped }: IEmptyOutcomeProps) => (
  <div className={classnames("fixture-outcome", { stopped })}>-</div>
);

export const Outcome = ({ id, showName, stopped }: IOutcomeProps) => {
  const outcome = useSelector((state: RootState) =>
    selectOutcomeById(state, id || "")
  );
  const dispatch = useDispatch();
  if (!outcome) return <EmptyOutcome stopped={stopped} />;
  const clickHandler = () => {
    if (stopped) return;
    dispatch(toggleOutcome(outcome.id));
  };
  return (
    <div
      className={classnames("fixture-outcome", {
        selectable: !stopped,
        selected: !!outcome.selected,
        "named-outcome": showName,
        stopped,
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
