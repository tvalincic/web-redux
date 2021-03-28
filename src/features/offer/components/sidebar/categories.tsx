import React, { Fragment } from "react";
import { Category } from "./category";

interface ICategoriesProps {
  categoryIds: React.ReactText[];
}

export const Categories = ({ categoryIds }: ICategoriesProps) => {
  return (
    <Fragment>
      {categoryIds.map((category) => (
        <Category
          id={category}
          key={category}
          showCategory={categoryIds.length > 1}
        />
      ))}
    </Fragment>
  );
};
