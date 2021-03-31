import { betSlipType } from "@minus5/listic.lib";
import { EntityState } from "@reduxjs/toolkit";

export interface IBetSlip {
  odd: number;
  payout: number;
  winning: number;
  eventualPayout: number;
  type: betSlipType;
  status: number;
  numberOfSelection: number;
  error: string;
  time: string;
  stakeWithoutMC: number;
  stake: number;
  tax: number;
  mc: number;
}

export interface IBetSlipOutcome {
  fixture: string;
  id: string;
  offer: string;
  market: string;
  line: string;
  stopped: boolean;
}

export type IBetSlipState = EntityState<IBetSlipOutcome> & IBetSlip;
