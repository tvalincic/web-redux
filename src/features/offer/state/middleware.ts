import { Middleware } from "redux";
import { handleDiff } from "./slice";
import { structure } from "./structure";

export const handleDiffMiddleware: Middleware = (storeApi) => (next) => (
  action
) => {
  if (action.type === handleDiff.type) {
    const { offer } = storeApi.getState();
    const structured = structure(action.payload, offer);
    action.payload = structured;
  }
  next(action);
};
