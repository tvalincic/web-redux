import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import {
  selectTournamentById,
  selectTournamentFixtureIds,
} from "../../state/selectors";
import { Fixture } from "./fixture";

interface ITournamentProps {
  id: React.ReactText;
}

export const Tournament = ({ id }: ITournamentProps) => {
  const tournament = useSelector((state: RootState) =>
    selectTournamentById(state, id)
  );
  const fixtures = useSelector((state: RootState) =>
    selectTournamentFixtureIds(state, id)
  );
  if (!tournament) return null;
  return (
    <section className="tournament-content">
      <div className="tournament-heading">{tournament.name}</div>
      <div className="tournament-header">
        <div className="outcome-type"></div>
        <div className="outcome-type">1</div>
        <div className="outcome-type">X</div>
        <div className="outcome-type">2</div>
      </div>
      <div className="fixtures">
        {fixtures.map((fixture) => (
          <Fixture id={fixture} key={fixture} />
        ))}
      </div>
    </section>
  );
};
