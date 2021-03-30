import { createSelector, EntityState } from "@reduxjs/toolkit";
import {
  sportsAdapter,
  categoriesAdapter,
  tournamentsAdapter,
  seasonsAdapter,
  roundsAdapter,
  fixturesAdapter,
  offersAdapter,
  marketsAdapter,
  linesAdapter,
  outcomesAdapter,
} from "./slice";
import { RootState } from "../../../app/store";
import { IMap, selectorGenerator } from "../../../app/util";
import {
  ITournament,
  ICategory,
  ISeason,
  ISport,
  IRound,
  IFixture,
  IOffer,
  IMarket,
  ILine,
  IOutcome,
} from "./model";

const selectSportState = ({ offer }: RootState) => offer.sports;
const selectCategoryState = ({ offer }: RootState) => offer.categories;
const selectTournamentState = ({ offer }: RootState) => offer.tournaments;
const selectFixtureState = ({ offer }: RootState) => offer.fixtures;

function generateActiveEntitySelectors<T>(
  selectState: (state: RootState) => EntityState<T>,
  selectActiveId: (state: RootState) => React.ReactText | null
) {
  function selectEntities(state: RootState) {
    const stateEntity = selectState(state);
    return stateEntity?.entities || {};
  }

  const selectActiveEntity = createSelector(
    [selectActiveId, selectEntities],
    (activeEntity, entities) => {
      if (!activeEntity) return null;
      return entities[activeEntity];
    }
  );

  return {
    selectActiveId,
    selectActiveEntity,
  };
}

export const {
  selectAll: selectSports,
  selectById: selectSportById,
  selectIds: selectSportIds,
} = selectorGenerator<ISport>(selectSportState, sportsAdapter);

export const {
  selectActiveId: selectActiveSportId,
  selectActiveEntity: selectActiveSport,
} = generateActiveEntitySelectors<ISport>(
  selectSportState,
  ({ offer }) => offer.activeSport
);

export const {
  selectAll: selectCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
  selectEntities: selectCategoryEntities,
  selectEntitiesByGroupOfIds: selectCategoriesByIds,
} = selectorGenerator<ICategory>(selectCategoryState, categoriesAdapter);

export const {
  selectActiveId: selectActiveCategoryId,
  selectActiveEntity: selectActiveCategory,
} = generateActiveEntitySelectors<ICategory>(
  selectCategoryState,
  ({ offer }) => offer.activeCategory
);

export const selectActiveCategories = createSelector(
  [
    selectActiveCategory,
    selectActiveSport,
    ({ offer }: RootState) => offer.categories.ids,
  ],
  (activeCategory, activeSport, categories) => {
    if (activeCategory) return [activeCategory.id];
    return activeSport?.categories || categories;
  }
);

export const {
  selectAll: selectTournaments,
  selectById: selectTournamentById,
  selectIds: selectTournamentIds,
  selectEntities: selectTournamentEntities,
  selectEntitiesByGroupOfIds: selectTournamentsByIds,
} = selectorGenerator<ITournament>(
  ({ offer }) => offer.tournaments,
  tournamentsAdapter
);

export const {
  selectActiveId: selectActiveTournamentId,
  selectActiveEntity: selectActiveTournament,
} = generateActiveEntitySelectors<ITournament>(
  selectTournamentState,
  ({ offer }) => offer.activeTournament
);

export const selectActiveTournamentsForCategory = createSelector(
  [selectActiveTournament, selectCategoryById],
  (activeTournament, category) => {
    if (activeTournament) return [activeTournament.id];
    if (category) return category.tournaments;
    return [];
  }
);

export const {
  selectAll: selectSeasons,
  selectById: selectSeasonById,
  selectIds: selectSeasonIds,
  selectEntities: selectSeasonEntities,
  selectEntitiesByGroupOfIds: selectSeasonsByIds,
} = selectorGenerator<ISeason>(({ offer }) => offer.seasons, seasonsAdapter);

export const {
  selectAll: selectRounds,
  selectById: selectRoundById,
  selectIds: selectRoundIds,
} = selectorGenerator<IRound>(({ offer }) => offer.rounds, roundsAdapter);

export const {
  selectAll: selectFixtures,
  selectById: selectFixtureById,
  selectIds: selectFixtureIds,
} = selectorGenerator<IFixture>(
  ({ offer }: RootState) => offer.fixtures,
  fixturesAdapter
);

export const {
  selectActiveId: selectActiveFixtureId,
  selectActiveEntity: selectActiveFixture,
} = generateActiveEntitySelectors<IFixture>(
  selectFixtureState,
  ({ offer }) => offer.activeFixture
);

export const selectTournamentSeasons = createSelector(
  [
    (state: RootState, tournamentId: React.ReactText) =>
      selectTournamentById(state, tournamentId),
    ({ offer }: RootState) => offer.seasons.entities,
  ],
  (tournament, seasons) => {
    if (!tournament) return [];
    return tournament.seasons.reduce((data: IMap<ISeason>, id) => {
      const season = seasons[id];
      if (!season) return data;
      data[id] = season;
      return data;
    }, {});
  }
);

export const selectTournamentFixtureIds = createSelector(
  [
    ({ offer }: RootState) => offer.seasons.entities,
    ({ offer }: RootState) => offer.rounds.entities,
    (state: RootState, tournamentId: React.ReactText) =>
      selectTournamentById(state, tournamentId),
  ],
  (seasons, rounds, tournament) => {
    if (!tournament) return [];
    return tournament.seasons.reduce((data: string[], seasonId) => {
      const season = seasons[seasonId];
      if (!season) return data;
      season.rounds.forEach((roundId) => {
        const round = rounds[roundId];
        if (!round) return data;
        data = [...data, ...round.fixtures];
      });
      return data;
    }, []);
  }
);

export const {
  selectAll: selectOffers,
  selectById: selectOfferById,
  selectIds: selectOfferIds,
} = selectorGenerator<IOffer>(({ offer }) => offer.offers, offersAdapter);

export const {
  selectAll: selectMarkets,
  selectById: selectMarketById,
  selectIds: selectMarketIds,
  selectByGroupOfIds: selectMarketsByIds,
} = selectorGenerator<IMarket>(({ offer }) => offer.markets, marketsAdapter);

export const {
  selectAll: selectLines,
  selectById: selectLineById,
  selectIds: selectLineIds,
} = selectorGenerator<ILine>(({ offer }) => offer.lines, linesAdapter);

export const {
  selectAll: selectOutcomes,
  selectById: selectOutcomeById,
  selectIds: selectOutcomeIds,
  selectByGroupOfIds: selectOutcomesByIds,
} = selectorGenerator<IOutcome>(({ offer }) => offer.outcomes, outcomesAdapter);

export const selectFixtureOffer = (
  { offer }: RootState,
  fixtureId: React.ReactText
) => offer.offers.entities[fixtureId];

export const selectFixtureMarkets = createSelector(
  [selectFixtureOffer, (state: RootState) => state],
  (offer, state) => {
    if (!offer) return [];
    return selectMarketsByIds(state, offer.markets);
  }
);

export const selectMainFixtureMarketId = createSelector(
  [selectFixtureMarkets],
  (markets) => {
    return markets.find((market) => market.main)?.id;
  }
);

export const selectLineOutcomeEntities = createSelector(
  [selectLineById, (state: RootState) => state],
  (line, state) => {
    if (!line) return [];
    return selectOutcomesByIds(state, line.outcomes);
  }
);

export const selectStructuredLineOutcomeIds = createSelector(
  [selectLineOutcomeEntities],
  (outcomes) => {
    return ["1", "X", "2"].map((outcomeName) => {
      return outcomes.find((o) => o.name === outcomeName)?.id || null;
    }, {});
  }
);
