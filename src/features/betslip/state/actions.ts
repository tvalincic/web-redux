import { createAsyncThunk } from "@reduxjs/toolkit";
import { betSlip } from "./betslip";
import { RootState, AppDispatch } from "../../../app/store";
import {
  IFixture,
  IMarket,
  ILine,
  IOutcome,
  IOffer,
  IOfferState,
} from "../../offer";
import { IBetSlip, IBetSlipOutcome, IBetSlipState } from "./model";

export const changeStake = createAsyncThunk<
  ReturnType<typeof betSlip.getCurrentBetSlip>,
  number
>("slip/changeStake", (stake: number) => {
  const ret = betSlip.changeStake(stake);
  if (!ret) throw new Error("Failed stake change.");
  return betSlip.getCurrentBetSlip();
});

function isSelected(outcomeId: string, state: IBetSlipState) {
  return !!state.entities[outcomeId];
}

function extractEntities(outcomeId: string, state: RootState) {
  const { fixtures, offers, markets, lines, outcomes } = state.offer;
  const outcome = outcomes.entities[outcomeId];
  if (!outcome) return false;
  const line = lines.entities[outcome.line];
  if (!line) return false;
  const market = markets.entities[line.market];
  if (!market) return false;
  const offer = offers.entities[market.offer];
  if (!offer) return false;
  const fixture = fixtures.entities[offer.fixture];
  if (!fixture) return false;
  return {
    fixture,
    offer,
    market,
    line,
    outcome,
  };
}

function addOutcome(
  fixture: IFixture,
  offer: IOffer,
  market: IMarket,
  line: ILine,
  outcome: IOutcome
): IToggleOutcome {
  const ret = betSlip.add(fixture, market, line, outcome);
  if (!ret.ok) return { ok: false };
  return {
    newOutcome: {
      fixture: fixture.id,
      offer: offer.id,
      market: market.id,
      line: line.id,
      id: outcome.id,
      stopped: offer.stopped || line.stopped,
    },
    zamjena: !!ret.zamjena,
    removed: ret.removed ? ret.removed.map((outcome) => outcome.tecajId) : [],
    ok: true,
  };
}

function removeOutcome(outcome: IOutcome): IToggleOutcome {
  const ret = betSlip.remove(outcome);
  if (!ret.ok) return { ok: false };
  return {
    removed: ret.removed.map((outcome) => outcome.tecajId),
    ok: true,
  };
}

interface IToggleOutcome {
  newOutcome?: IBetSlipOutcome;
  zamjena?: boolean;
  removed?: string[];
  ok: boolean;
}

export type IToggleOutcomeReturn = IBetSlip & IToggleOutcome;

export const toggleOutcome = createAsyncThunk<
  IToggleOutcomeReturn,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("betSlip/toggleOutcome", async (outcomeId: string, { getState }) => {
  const entities = extractEntities(outcomeId, getState());
  if (!entities) throw new Error("Failed adding odd to slip: no entities");
  const { fixture, offer, market, line, outcome } = entities;
  var ret;
  if (isSelected(outcomeId, getState().betSlip)) {
    ret = removeOutcome(outcome);
  } else {
    ret = addOutcome(fixture, offer, market, line, outcome);
  }
  if (!ret.ok) throw new Error("Failed adding odd to slip: !ok");
  return {
    ...ret,
    ...betSlip.getCurrentBetSlip(),
  };
});

interface IChangedOutcomesPayload {
  changed: IOutcome[];
  deleted: string[];
}

function isStopped(outcome: IOutcome | undefined, state: IOfferState) {
  if (!outcome) return true;
  const line = state.lines.entities[outcome.id];
  const market = state.markets.entities[line?.market || ""];
  const offer = state.offers.entities[market?.offer || ""];
  if (!line || !market || !offer) return true;
  return line.stopped || offer.stopped;
}

function getOutcomesToSync(
  state: RootState,
  changed: IOutcome[],
  deleted: string[]
) {
  const { betSlip: betSlipState, offer } = state;
  const stopped: string[] = [];
  const reactivated: string[] = [];
  if (!betSlipState.ids.length) return { stopped, reactivated };
  changed.forEach((outcome) => {
    const outcomeFromSlip = betSlipState.entities[outcome.id];
    if (!outcomeFromSlip) return;
    const outcomeStopped = isStopped(outcome, offer);
    if (outcomeStopped !== outcomeFromSlip.stopped) {
      const arr = outcomeStopped ? stopped : reactivated;
      arr.push(outcome.id);
    }
  });
  deleted.forEach((outcome) => {
    if (betSlipState.entities[outcome]) stopped.push(outcome);
  });
  return { stopped, reactivated };
}

interface ISyncSlipAfterDiffReturn {
  currentBetSlip: IBetSlip;
  stopped: string[];
  reactivated: string[];
}

export const syncSlipAfterDiff = createAsyncThunk<
  ISyncSlipAfterDiffReturn,
  IChangedOutcomesPayload,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("slip/syncSlipApi", ({ changed, deleted }, { getState }) => {
  const { stopped, reactivated } = getOutcomesToSync(
    getState(),
    changed,
    deleted
  );
  betSlip.change(changed, stopped, getState());
  return { currentBetSlip: betSlip.getCurrentBetSlip(), stopped, reactivated };
});
