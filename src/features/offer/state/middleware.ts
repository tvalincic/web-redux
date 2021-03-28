import { Middleware, Dispatch, MiddlewareAPI, AnyAction } from "redux";
import { handleDiff } from "./slice";
import { IDiff, ISbkResponse } from "./model";
import { RootState } from "../../../app/store";
import { structure } from "./structure";
import { PayloadAction, Action } from "@reduxjs/toolkit";

export const handleDiffMiddleware: Middleware = (storeApi) => (next) => (
  action
) => {
  if (action.type === handleDiff.type) {
    const { offer } = storeApi.getState();
    const structured = structure(action.payload, offer);
    action.payload = structured;
  }
  next(action);
  // var queue = [];
  // if (action.type === handleDiff.type) {
  //   const state = storeApi.getState();
  //   const structured = structureDiff(action.payload, state);
  //   action.payload = structured;
  //   const oldOdds = getChangedOdds(structured.odds, state.offer.odds.entities);
  //   if (Object.keys(oldOdds).length) {
  //     queue.push(syncSlipAfterDiff({ changed: structured.odds, old: oldOdds }));
  //   }
  // }
  // next(action);
  // queue.forEach((action) => storeApi.dispatch(action));
  // queue = [];
};
