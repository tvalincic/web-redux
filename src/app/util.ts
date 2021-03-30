import { createSelector, EntityState, EntityAdapter } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface IMap<T> {
  [key: string]: T;
}

export function filterOutFalsy<T>(v: T | null | undefined): v is T {
  return !!v;
}

export function joinStrings(delimiter: string, ...ids: string[]) {
  return ids.join(delimiter);
}

export function selectorGenerator<T>(
  selectState: (state: RootState) => EntityState<T>,
  adapter: EntityAdapter<T>
) {
  function selectEntities(state: RootState) {
    const stateEntity = selectState(state);
    return stateEntity?.entities || {};
  }

  const selectByGroupOfIds = createSelector(
    [selectEntities, (_: RootState, ids: React.ReactText[]) => ids],
    (entities, ids) => ids.map((id) => entities[id]).filter(filterOutFalsy)
  );

  const selectEntitiesByGroupOfIds = createSelector(
    [selectEntities, (_: RootState, ids: React.ReactText[]) => ids],
    (entities, ids) => {
      return ids.reduce((data: IMap<T>, id) => {
        const entity = entities[id];
        if (!entity) return data;
        data[id] = entity;
        return data;
      }, {});
    }
  );

  const { selectAll, selectById, selectIds } = adapter.getSelectors(
    selectState
  );

  return {
    selectAll,
    selectById,
    selectIds,
    selectByGroupOfIds,
    selectEntities,
    selectEntitiesByGroupOfIds,
  };
}
