import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSportById } from "../../state/selectors";
import classnames from "classnames";
import { RootState } from "../../../../app/store";
import { changeActiveSport } from "../../state/slice";
import { Categories } from "./categories";

interface ISportProps {
  sportId: React.ReactText;
  active?: boolean;
}

export const Sport = ({ sportId, active = false }: ISportProps) => {
  const sport = useSelector((state: RootState) =>
    selectSportById(state, sportId)
  );
  const dispatch = useDispatch();
  if (!sport) return null;

  const clickHandler = () => {
    dispatch(changeActiveSport(String(sportId)));
  };

  return (
    <div className={classnames("sport", { active })}>
      <div
        className={classnames("sport-tab", { active })}
        onClick={clickHandler}
      >
        {sport.name}
      </div>
      {active && <Categories categoryIds={sport.categories} />}
    </div>
  );
};
