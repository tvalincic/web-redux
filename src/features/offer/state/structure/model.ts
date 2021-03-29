import {
  ISport,
  ICategory,
  ITournament,
  ISeason,
  IRound,
  IFixture,
  IOffer,
  IMarket,
  ILine,
  IOutcome,
  IScore,
} from "../model";
import { IMap } from "../../../../app/util";

export interface IStructuredSports {
  sports: ISport[];
  suspendedSports: string[];
  categories: ICategory[];
  suspendedCategories: string[];
  tournaments: ITournament[];
  suspendedTournaments: string[];
  seasons: ISeason[];
  suspendedSeasons: string[];
  rounds: IRound[];
  suspendedRounds: string[];
  fixtures: IMap<IFixture>;
  suspendedFixtures: string[];
}

export interface IStructuredOffers {
  offers: IOffer[];
  suspendedOffers: string[];
  markets: IMarket[];
  suspendedMarkets: string[];
  lines: ILine[];
  suspendedLines: string[];
  outcomes: IOutcome[];
  suspendedOutcomes: string[];
}

export interface IStructuredScores {
  scores: IScore[];
  suspendedScores: string[];
}
