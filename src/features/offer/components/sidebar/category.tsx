import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { selectCategoryById } from "../../state/selectors";
import { RootState } from "../../../../app/store";
import { IMap } from "../../../../app/util";
import { Tournament } from "./tournament";

interface IWrapperProps {
  block: boolean;
  classNames: IMap<boolean> | string;
  children: React.ReactNode;
}

const Wrapper = ({ block, classNames, children }: IWrapperProps) => {
  return block ? (
    <div className={classnames(classNames)}>{children}</div>
  ) : (
    <Fragment>{children}</Fragment>
  );
};

interface ICategoryProps {
  id: React.ReactText;
  showCategory: boolean;
}

export const Category = ({ id, showCategory }: ICategoryProps) => {
  const category = useSelector((state: RootState) =>
    selectCategoryById(state, id)
  );
  if (!category) return null;
  return (
    <Wrapper block={showCategory} classNames="category">
      {showCategory ? (
        <div className="category-name">{category.name}</div>
      ) : null}
      {category.tournaments.map((tournament) => (
        <Tournament id={tournament} key={tournament} />
      ))}
    </Wrapper>
  );
};
