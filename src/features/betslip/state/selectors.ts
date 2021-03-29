import { betSlipAdapter } from "./slice";
import { RootState } from "../../../app/store";
import { selectorGenerator } from "../../../app/util";
import { IBetSlipOutcome } from "./model";

const selectBetSlipState = ({ betSlip }: RootState) => betSlip;

export const {
  selectAll: selectOutcomes,
  selectById: selectOutcomeById,
  selectIds: selectOutcomeIds,
} = selectorGenerator<IBetSlipOutcome>(selectBetSlipState, betSlipAdapter);
