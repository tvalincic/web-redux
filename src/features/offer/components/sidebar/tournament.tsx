import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTournamentById } from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { changeActiveTournament } from "../../state/slice";

interface ITournamentProps {
  id: React.ReactText;
}

export const Tournament = ({ id }: ITournamentProps) => {
  const tournament = useSelector((state: RootState) =>
    selectTournamentById(state, id)
  );
  const dispatch = useDispatch();

  if (!tournament) return null;

  const clickHandler = () => {
    dispatch(changeActiveTournament(String(id)));
  };

  return (
    <div className="tournament" onClick={clickHandler}>
      {tournament.name}
    </div>
  );
};
