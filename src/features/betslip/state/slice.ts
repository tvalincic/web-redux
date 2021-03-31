import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { changeStake, syncSlipAfterDiff } from "./actions";
import { toggleOutcome } from "./actions";
import { betSlip } from "./betslip";
import { IBetSlipOutcome, IBetSlipState, IBetSlip } from "./model";
import { constructUpdate } from "../../../app/util";

export const betSlipAdapter = createEntityAdapter<IBetSlipOutcome>();

const initialState: IBetSlipState = betSlipAdapter.getInitialState({
  ...betSlip.getCurrentBetSlip(),
});

function syncStateWithCurrentSlip(
  state: IBetSlipState,
  currentBetSlip: IBetSlip
) {
  state.odd = currentBetSlip.odd;
  state.payout = currentBetSlip.payout;
  state.winning = currentBetSlip.winning;
  state.eventualPayout = currentBetSlip.eventualPayout;
  state.type = currentBetSlip.type;
  state.status = currentBetSlip.status;
  state.numberOfSelection = currentBetSlip.numberOfSelection;
  state.error = currentBetSlip.error;
  state.time = currentBetSlip.time;
  state.stakeWithoutMC = currentBetSlip.stakeWithoutMC;
  state.stake = currentBetSlip.stake;
  state.tax = currentBetSlip.tax;
  state.mc = currentBetSlip.mc;
}

const betSlipSlice = createSlice({
  name: "betSlip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(toggleOutcome.fulfilled, (state, action) => {
      const { newOutcome, ...slipData } = action.payload;
      if (newOutcome) {
        betSlipAdapter.upsertOne(state, newOutcome);
      }
      if (slipData.removed?.length) {
        betSlipAdapter.removeMany(state, slipData.removed);
      }
      syncStateWithCurrentSlip(state, slipData);
    });
    builder.addCase(toggleOutcome.rejected, (_, action) => {
      console.error(action);
    });
    builder.addCase(changeStake.fulfilled, (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    });
    builder.addCase(changeStake.rejected, (_, action) => {
      console.error(action);
    });
    builder.addCase(syncSlipAfterDiff.fulfilled, (state, action) => {
      const { currentBetSlip, stopped, reactivated } = action.payload;
      syncStateWithCurrentSlip(state, currentBetSlip);
      const updates = stopped.map((outcome) => {
        return constructUpdate(outcome, { stopped: true });
      });
      reactivated.forEach((outcome) => {
        updates.push(constructUpdate(outcome, { stopped: false }));
      });
      if (updates.length) betSlipAdapter.updateMany(state, updates);
    });
    builder.addCase(syncSlipAfterDiff.rejected, (state, action) => {
      console.error(action);
    });
  },
});

export const { reducer: betSlipReducer } = betSlipSlice;
