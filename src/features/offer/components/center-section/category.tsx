import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import {
  selectCategoryById,
  selectActiveTournamentsForCategory,
} from "../../state/selectors";
import { Tournament } from "./tournament";

interface ICategoryProps {
  id: React.ReactText;
}

export const Category = ({ id }: ICategoryProps) => {
  const category = useSelector((state: RootState) =>
    selectCategoryById(state, id)
  );
  const tournaments = useSelector((state: RootState) =>
    selectActiveTournamentsForCategory(state, id)
  );
  if (!category) return null;
  return (
    <section className="category-content">
      {!!category.name && (
        <div className="category-heading">{category.name}</div>
      )}
      {tournaments.map((tournament) => (
        <Tournament id={tournament} key={tournament} />
      ))}
    </section>
  );
};
