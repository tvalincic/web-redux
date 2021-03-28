import createBetSlip, { IOddDefinition } from "@minus5/listic.lib";
import { joinStrings } from "../../shared";
import { IOutcome, IFixture, IMarket, ILine } from "../../offer";
import { IBetSlip } from "./model";
const betSlipApi = createBetSlip();

const TEMP_SOURCE_ID = 0;

function constructOutcome(
  fixture: IFixture,
  market: IMarket,
  line: ILine,
  outcome: IOutcome
) {
  const { home, away } = fixture;
  const naziv = joinStrings(" - ", home.name, away.name, line.name);
  return {
    izvorId: TEMP_SOURCE_ID,
    tecajId: outcome.id,
    id: outcome.id,
    tecaj: outcome.odds,
    dogadjajId: fixture.id,
    marketId: market.id,
    lineId: line.id,
    outcomeId: outcome.id,
    naziv: naziv,
    tip: outcome.name,
  };
}

function add(
  fixture: IFixture,
  market: IMarket,
  line: ILine,
  outcome: IOutcome
) {
  const betslipOutcome = constructOutcome(fixture, market, line, outcome);
  return betSlipApi.add(betslipOutcome);
}

function remove(outcome: IOutcome) {
  return betSlipApi.remove(TEMP_SOURCE_ID, outcome.id);
}

function getCurrentBetSlip(): IBetSlip {
  const slip = betSlipApi.listic();
  const taxCalculation = betSlipApi.porez.izracun(slip.ulogBez(), slip.dobitak);
  return {
    odd: slip.tecaj,
    payout: taxCalculation.dobitakBez,
    winning: slip.dobitak,
    eventualPayout: slip.eventualniDobitak,
    type: slip.tip,
    status: slip.status,
    numberOfSelection: slip.parova,
    error: slip.error,
    time: slip.vrijeme,
    stakeWithoutMC: slip.ulogBez(),
    stake: slip.ulogSa(),
    tax: taxCalculation.porez,
    mc: slip.ulogMt(),
  };
}

function changeStake(stake: number) {
  return betSlipApi.ulog(stake);
}

export const betSlip = {
  add,
  remove,
  getCurrentBetSlip,
  changeStake,
};
