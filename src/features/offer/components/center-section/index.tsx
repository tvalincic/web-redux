import React from "react";
import { useSelector } from "react-redux";
import { selectActiveCategories } from "../../state/selectors";
import { Category } from "./category";

export const CenterSection = () => {
  const categories = useSelector(selectActiveCategories);
  return (
    <section className="center-section">
      {categories.map((category) => (
        <Category id={category} key={category} />
      ))}
    </section>
  );
};
