import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { changeStake, syncSlipAfterDiff } from "./actions";
import { toggleOutcome } from "./actions";
import { betSlip } from "./betslip";
import { IBetSlipOutcome, IBetSlipState } from "./model";

export const betSlipAdapter = createEntityAdapter<IBetSlipOutcome>();

const initialState: IBetSlipState = betSlipAdapter.getInitialState({
  ...betSlip.getCurrentBetSlip(),
});

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
      state.odd = slipData.odd;
      state.payout = slipData.payout;
      state.winning = slipData.winning;
      state.eventualPayout = slipData.eventualPayout;
      state.type = slipData.type;
      state.status = slipData.status;
      state.numberOfSelection = slipData.numberOfSelection;
      state.error = slipData.error;
      state.time = slipData.time;
      state.stakeWithoutMC = slipData.stakeWithoutMC;
      state.stake = slipData.stake;
      state.tax = slipData.tax;
      state.mc = slipData.mc;
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
      state = { ...state, ...action.payload };
      return state;
    });
    builder.addCase(syncSlipAfterDiff.rejected, (state, action) => {
      console.error(action);
    });
  },
});

export const { reducer: betSlipReducer } = betSlipSlice;
