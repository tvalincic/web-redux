import React from "react";
import { useSelector } from "react-redux";
import {
  selectActiveCategories,
  selectActiveFixtureId,
} from "../../state/selectors";
import { Category } from "./category";
import { FixtureDetails } from "./fixture-details";
import { ISbkResponse } from "../../state/model";

interface ICenterSectionProps {
  handleDiff: (data: ISbkResponse) => void;
}

export const CenterSection = ({ handleDiff }: ICenterSectionProps) => {
  const categories = useSelector(selectActiveCategories);
  const activeFixture = useSelector(selectActiveFixtureId);

  return (
    <section className="center-section">
      {!!activeFixture ? (
        <FixtureDetails id={activeFixture} handleDiff={handleDiff} />
      ) : (
        categories.map((category) => <Category id={category} key={category} />)
      )}
    </section>
  );
};
