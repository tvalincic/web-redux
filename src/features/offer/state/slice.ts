import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";

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
} from "./model";
import { toggleOutcome } from "../../betslip";

export const sportsAdapter = createEntityAdapter<ISport>();
export const categoriesAdapter = createEntityAdapter<ICategory>();
export const tournamentsAdapter = createEntityAdapter<ITournament>();
export const seasonsAdapter = createEntityAdapter<ISeason>();
export const roundsAdapter = createEntityAdapter<IRound>();
export const fixturesAdapter = createEntityAdapter<IFixture>();
export const offersAdapter = createEntityAdapter<IOffer>();
export const marketsAdapter = createEntityAdapter<IMarket>();
export const linesAdapter = createEntityAdapter<ILine>();
export const outcomesAdapter = createEntityAdapter<IOutcome>();
export const scoresAdapter = createEntityAdapter<IScore>();

export interface IOfferState {
  sports: ReturnType<typeof sportsAdapter.getInitialState>;
  categories: ReturnType<typeof categoriesAdapter.getInitialState>;
  tournaments: ReturnType<typeof tournamentsAdapter.getInitialState>;
  seasons: ReturnType<typeof seasonsAdapter.getInitialState>;
  rounds: ReturnType<typeof roundsAdapter.getInitialState>;
  fixtures: ReturnType<typeof fixturesAdapter.getInitialState>;
  offers: ReturnType<typeof offersAdapter.getInitialState>;
  markets: ReturnType<typeof marketsAdapter.getInitialState>;
  lines: ReturnType<typeof linesAdapter.getInitialState>;
  outcomes: ReturnType<typeof outcomesAdapter.getInitialState>;
  scores: ReturnType<typeof scoresAdapter.getInitialState>;
  activeSport: ISport["id"] | null;
  activeCategory: ICategory["id"] | null;
  activeTournament: ITournament["id"] | null;
  activeSeason: ISeason["id"] | null;
  activeRound: IRound["id"] | null;
  activeFixture: IFixture["id"] | null;
}

const initialState: IOfferState = {
  sports: sportsAdapter.getInitialState(),
  categories: categoriesAdapter.getInitialState(),
  tournaments: tournamentsAdapter.getInitialState(),
  seasons: seasonsAdapter.getInitialState(),
  rounds: roundsAdapter.getInitialState(),
  fixtures: fixturesAdapter.getInitialState(),
  offers: offersAdapter.getInitialState(),
  markets: marketsAdapter.getInitialState(),
  lines: linesAdapter.getInitialState(),
  outcomes: outcomesAdapter.getInitialState(),
  scores: scoresAdapter.getInitialState(),
  activeSport: null,
  activeCategory: null,
  activeTournament: null,
  activeSeason: null,
  activeRound: null,
  activeFixture: null,
};

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    changeActiveSport(state, action: PayloadAction<string>) {
      if (state.activeSport !== action.payload) {
        state.activeSport = action.payload;
        state.activeCategory = null;
        state.activeTournament = null;
        state.activeSeason = null;
        state.activeRound = null;
        state.activeFixture = null;
      }
    },
    changeActiveTournament(state, action: PayloadAction<string>) {
      const tournament = state.tournaments.entities[action.payload];
      if (state.activeTournament !== action.payload && tournament) {
        state.activeCategory = tournament.category;
        state.activeTournament = action.payload;
        state.activeSeason = null;
        state.activeRound = null;
        state.activeFixture = null;
      }
    },
    handleDiff(state, action: PayloadAction<any>) {
      const { payload } = action;
      sportsAdapter.upsertMany(state.sports, payload.sports);
      sportsAdapter.removeMany(state.sports, payload.suspendedSports);
      categoriesAdapter.upsertMany(state.categories, payload.categories);
      categoriesAdapter.removeMany(state.categories, payload.suspendedCategories);
      tournamentsAdapter.upsertMany(state.tournaments, payload.tournaments);
      tournamentsAdapter.removeMany(state.tournaments, payload.suspendedTournaments);
      seasonsAdapter.upsertMany(state.seasons, payload.seasons);
      seasonsAdapter.removeMany(state.seasons, payload.suspendedSeasons);
      roundsAdapter.upsertMany(state.rounds, payload.rounds);
      roundsAdapter.removeMany(state.rounds, payload.suspendedRounds);
      fixturesAdapter.upsertMany(state.fixtures, payload.fixtures);
      fixturesAdapter.removeMany(state.fixtures, payload.suspendedFixtures);
      offersAdapter.upsertMany(state.offers, payload.offers);
      offersAdapter.removeMany(state.offers, payload.suspendedOffers);
      marketsAdapter.upsertMany(state.markets, payload.markets);
      marketsAdapter.removeMany(state.markets, payload.suspendedMarkets);
      linesAdapter.upsertMany(state.lines, payload.lines);
      linesAdapter.removeMany(state.lines, payload.suspendedLines);
      outcomesAdapter.upsertMany(state.outcomes, payload.outcomes);
      outcomesAdapter.removeMany(state.outcomes, payload.suspendedOutcomes);
      scoresAdapter.upsertMany(state.scores, payload.scores);
      scoresAdapter.removeMany(state.scores, payload.suspendedScores);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleOutcome.fulfilled, (state, action) => {
      const { newOutcome, removed = [] } = action.payload;
      if (newOutcome) {
        const outcome = state.outcomes.entities[newOutcome.id];
        if (outcome) outcome.selected = true;
      }
      removed.forEach((id) => {
        const outcome = state.outcomes.entities[id];
        if (outcome) outcome.selected = false;
      });
    });
  },
});

export const {
  handleDiff,
  changeActiveSport,
  changeActiveTournament,
} = offerSlice.actions;
export const { reducer: offerReducer } = offerSlice;
