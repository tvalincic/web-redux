import { IMap } from "../../../app/util";

//#region SBK API structure
export interface ISbkResponse {
  diff: ISbkState | null;
  full: ISbkState | null;
  merged: ISbkState | null;
}

type ISbkEntity<T> = IMap<T | null>;

export interface ISbkState {
  meta?: ISbkMeta;
  offers?: ISbkOffers;
  scores?: ISbkScores;
}

export type ISbkOffers = ISbkEntity<ISbkOffer>;
export type ISbkScores = ISbkEntity<ISbkScore>;

export interface ISbkMeta {
  sports: ISbkSports;
}

export type ISbkSports = ISbkEntity<ISbkSport>;

export interface ISbkSport {
  name: string;
  categories: ISbkCategories;
}

export type ISbkCategories = ISbkEntity<ISbkCategory>;

export interface ISbkCategory {
  name: string;
  tournaments: ISbkTournaments;
}

export type ISbkTournaments = ISbkEntity<ISbkTournament>;

export interface ISbkTournament {
  name: string;
  seasons: ISbkSeasons;
}

export type ISbkSeasons = ISbkEntity<ISbkSeason>;

export interface ISbkSeason {
  name: string;
  rounds: ISbkRounds;
}

export type ISbkRounds = ISbkEntity<ISbkRound>;

export interface ISbkRound {
  name: string;
  fixtures: ISbkFixtures;
}

export type ISbkFixtures = ISbkEntity<ISbkFixture>;

export interface ISbkFixture {
  away: ICompetitor;
  home: ICompetitor;
  startsAt: string;
}

export interface ISbkOffer {
  markets: ISbkMarkets;
  stopped: boolean;
}

export type ISbkMarkets = ISbkEntity<ISbkMarket>;

export interface ISbkMarket {
  name: string;
  main: boolean;
  lines: ISbkLines;
}

export type ISbkLines = ISbkEntity<ISbkLine>;

export interface ISbkLine {
  name: string;
  status: lineStatus;
  stopped: boolean;
  outcomes: ISbkOutcomes;
}

export type ISbkOutcomes = ISbkEntity<ISbkOutcome>;

export interface ISbkOutcome {
  name: string;
  odds: number;
}

export interface ISbkScore {
  away: ICompetitorScore;
  home: ICompetitorScore;
  progress?: string;
  server?: number;
}

export type ISbkConstruct =
  | ISbkSports
  | ISbkCategories
  | ISbkTournaments
  | ISbkSeasons
  | ISbkRounds
  | ISbkFixtures
  | ISbkOffers
  | ISbkMarkets
  | ISbkLines
  | ISbkOutcomes
  | ISbkScores;

//#endregion

//#region State structure
interface IIdentity {
  name: string;
  id: string;
  key: string;
}

export interface ISport extends IIdentity {
  categories: string[];
}

export interface ICategory extends IIdentity {
  tournaments: string[];
  sport: ISport["id"];
}

export interface ITournament extends IIdentity {
  seasons: string[];
  category: ICategory["id"];
}

export interface ISeason extends IIdentity {
  rounds: string[];
  tournament: ITournament["id"];
}

export interface IRound extends IIdentity {
  fixtures: string[];
  season: ISeason["id"];
}

export interface IFixture {
  id: string;
  key: string;
  round: IRound["id"];
  away: ICompetitor;
  home: ICompetitor;
  startsAt: string;
}

export interface ICompetitor {
  id: number;
  name: string;
}

export interface IOffer {
  id: string;
  stopped: boolean;
  fixture: IFixture["id"];
  markets: string[];
}

export interface IMarket extends IIdentity {
  offer: IOffer["id"];
  lines: string[];
  main: boolean;
}

export enum lineStatus {
  "active",
  "stopped",
}

export interface ILine extends IIdentity {
  market: IMarket["id"];
  status: lineStatus;
  stopped: boolean;
  outcomes: string[];
}

export interface IOutcome extends IIdentity {
  line: ILine["id"];
  name: string;
  odds: number;
  selected?: boolean;
}

export interface IScore {
  id: string;
  fixture: IFixture["id"];
  away: ICompetitorScore;
  home: ICompetitorScore;
  progress?: string;
  server?: number;
}

export interface ICompetitorScore {
  points: string;
  total: number;
  periods: IMap<number>;
}

export type IStateElement =
  | ISport
  | ICategory
  | ITournament
  | ISeason
  | IRound
  | IFixture
  | IOffer
  | IMarket
  | ILine
  | IOutcome
  | IScore;

export interface IDiff {
  sports: ISport[];
  categories: ICategory[];
  tournaments: ITournament[];
  seasons: ISeason[];
  rounds: IRound[];
  fixtures: IFixture[];
  offers: IOffer[];
  markets: IMarket[];
  lines: ILine[];
  outcomes: IOutcome[];
  scores: IScore[];
}

export enum stateEntity {
  "sport" = "s",
  "category" = "c",
  "tournament" = "t",
  "season" = "se",
  "round" = "r",
  "fixture" = "m",
  "offer" = "o",
  "market" = "ma",
  "line" = "l",
  "outcome" = "ou",
  "score" = "sc",
}

export enum stateEntityKey {
  "s" = "sport",
  "c" = "category",
  "t" = "tournament",
  "se" = "season",
  "r" = "round",
  "m" = "fixture",
  "o" = "offer",
  "ma" = "market",
  "l" = "line",
  "ou" = "outcome",
  "sc" = "score",
}

export interface IUnpackedId {
  [index: string]: string;
}

//#endregion
