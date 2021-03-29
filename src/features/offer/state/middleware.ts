import { Middleware } from "redux";
import { handleDiff } from "./slice";
import { structure } from "./structure";
import { syncSlipAfterDiff } from "../../betslip/state/actions";

export const handleDiffMiddleware: Middleware = (storeApi) => (next) => (
  action
) => {
  var queue: any[] = [];
  if (action.type === handleDiff.type) {
    const { offer } = storeApi.getState();
    const structured = structure(action.payload, offer);
    action.payload = structured;
    if (structured.outcomes.length || structured.suspendedOutcomes.length) {
      queue.push(
        syncSlipAfterDiff({
          changed: structured.outcomes,
          deleted: structured.suspendedOutcomes,
        })
      );
    }
  }
  next(action);
  queue.forEach((action) => storeApi.dispatch(action));
  queue = [];
};
