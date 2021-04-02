import React from "react";
import { useSelector } from "react-redux";
import { selectScoreById } from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { useTicker } from "./useTicker";

interface IScoreProps {
  id: React.ReactText;
}
interface IScoreEntityProps {
  score: React.ReactText;
}

const ScoreEntity = ({ score }: IScoreEntityProps) => {
  const ticker = useTicker(score);
  if (!ticker) return null;
  return <span className="score-entity">{score || 0}</span>;
};

export const Score = ({ id }: IScoreProps) => {
  const score = useSelector((state: RootState) => selectScoreById(state, id));
  if (!score) return <div className="score"></div>;

  return (
    <div className="score">
      {!!score && (
        <span className="score-content">
          <ScoreEntity score={score.home.total} />
          {" - "}
          <ScoreEntity score={score.away.total} />
        </span>
      )}
    </div>
  );
};
