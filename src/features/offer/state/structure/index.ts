import {
  ISbkResponse,
  ISbkSports,
  ISbkCategories,
  ISbkTournaments,
  ISbkSeasons,
  ISbkRounds,
  ISbkFixtures,
  ISbkOffers,
  ISbkMarkets,
  ISbkLines,
  ISbkOutcomes,
  ISbkScores,
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
  ISbkSport,
  ISbkCategory,
  ISbkFixture,
  ISbkRound,
  ISbkSeason,
  ISbkTournament,
  ISbkOffer,
  ISbkOutcome,
  ISbkLine,
  ISbkMarket,
  ISbkScore,
} from "../model";
import { stateEntity } from "../model";
import { IOfferState } from "../slice";
import { IMap } from "../../../../app/util";
import {
  IStructuredSports,
  IStructuredOffers,
  IStructuredScores,
} from "./model";
import {
  sportCategories,
  categoryTournaments,
  tournamentSeasons,
  seasonRounds,
  roundFixtures,
  offerMarkets,
  marketLines,
  lineOutcomes,
} from "./selectors";
import { suspend } from "./suspend";
import { create } from "./create";

export function structure(data: ISbkResponse, state: IOfferState) {
  const { full, diff } = data;
  const sportsSbk = full?.meta?.sports || diff?.meta?.sports;
  const offersSbk = full?.offers || diff?.offers;
  const scoresSbk = full?.scores || diff?.scores;

  const constructedSports = constructSports(sportsSbk, state);
  const mergedFixtures = {
    ...state.fixtures.entities,
    ...constructedSports.fixtures,
  };
  const constructedOffers = constructOffers(offersSbk, mergedFixtures, state);
  const constructedScores = constructScores(scoresSbk, mergedFixtures, state);
  return {
    ...constructedSports,
    ...constructedOffers,
    fixtures: Object.values(constructedSports.fixtures),
    ...constructedScores,
  };
}

function constructSports(sports: ISbkSports | undefined, state: IOfferState) {
  const data: IStructuredSports = {
    sports: [],
    suspendedSports: [],
    categories: [],
    suspendedCategories: [],
    tournaments: [],
    suspendedTournaments: [],
    seasons: [],
    suspendedSeasons: [],
    rounds: [],
    suspendedRounds: [],
    fixtures: {},
    suspendedFixtures: [],
  };

  if (!sports) return data;
  create<ISbkSport, ISport>({
    sbkEntity: sports,
    data: data.sports,
    stateKey: stateEntity.sport,
    onSuspend: (id) => suspend(id, state, data).sport(),
    createEntity(sport) {
      return {
        ...sport,
        categories: sportCategories(state, sport.id),
      };
    },
    childCreator(sport, id) {
      return constructCategories(sport.categories, id, data, state);
    },
    mergeChildren(sport, cb) {
      sport.categories = cb(sport.categories);
    },
  });
  return data;
}

function constructCategories(
  categories: ISbkCategories,
  sportId: string,
  data: IStructuredSports,
  state: IOfferState
) {
  return create<ISbkCategory, ICategory>({
    sbkEntity: categories,
    data: data.categories,
    stateKey: stateEntity.category,
    parentId: sportId,
    onSuspend: (id) => suspend(id, state, data).sport(),
    createEntity(category) {
      return {
        ...category,
        tournaments: categoryTournaments(state, category.id),
        sport: sportId,
      };
    },
    childCreator(category, id) {
      return constructTournaments(category.tournaments, id, data, state);
    },
    mergeChildren(category, cb) {
      category.tournaments = cb(category.tournaments);
    },
  });
}

function constructTournaments(
  tournaments: ISbkTournaments,
  categoryId: string,
  data: IStructuredSports,
  state: IOfferState
) {
  return create<ISbkTournament, ITournament>({
    sbkEntity: tournaments,
    data: data.tournaments,
    stateKey: stateEntity.tournament,
    parentId: categoryId,
    onSuspend: (id) => suspend(id, state, data).tournament(),
    createEntity(tournament) {
      return {
        ...tournament,
        seasons: tournamentSeasons(state, tournament.id),
        category: categoryId,
      };
    },
    childCreator(tournament, id) {
      return constructSeasons(tournament.seasons, id, data, state);
    },
    mergeChildren(tournament, cb) {
      tournament.seasons = cb(tournament.seasons);
    },
  });
}

function constructSeasons(
  seasons: ISbkSeasons,
  tournamentId: string,
  data: IStructuredSports,
  state: IOfferState
) {
  return create<ISbkSeason, ISeason>({
    sbkEntity: seasons,
    data: data.seasons,
    stateKey: stateEntity.season,
    parentId: tournamentId,
    onSuspend: (id) => suspend(id, state, data).season(),
    createEntity(season) {
      return {
        ...season,
        rounds: seasonRounds(state, season.id),
        tournament: tournamentId,
      };
    },
    childCreator(season, id) {
      return constructRounds(season.rounds, id, data, state);
    },
    mergeChildren(season, cb) {
      season.rounds = cb(season.rounds);
    },
  });
}

function constructRounds(
  rounds: ISbkRounds,
  seasonId: string,
  data: IStructuredSports,
  state: IOfferState
) {
  return create<ISbkRound, IRound>({
    sbkEntity: rounds,
    data: data.rounds,
    stateKey: stateEntity.round,
    parentId: seasonId,
    onSuspend: (id) => suspend(id, state, data).round(),
    createEntity(round) {
      return {
        ...round,
        fixtures: roundFixtures(state, round.id),
        season: seasonId,
      };
    },
    childCreator(round, id) {
      return constructFixtures(round.fixtures, id, data, state);
    },
    mergeChildren(round, cb) {
      round.fixtures = cb(round.fixtures);
    },
  });
}

function constructFixtures(
  fixtures: ISbkFixtures,
  roundId: string,
  data: IStructuredSports,
  state: IOfferState
) {
  return create<ISbkFixture, IFixture>({
    sbkEntity: fixtures,
    data: data.fixtures,
    stateKey: stateEntity.fixture,
    onSuspend: (id) => suspend(id, state, data).fixture(),
    idCreator: (id) => `m_${id}`,
    createEntity(fixture) {
      return { ...fixture, round: roundId };
    },
  });
}

function constructOffers(
  offers: ISbkOffers | undefined,
  fixtures: IMap<IFixture | undefined>,
  state: IOfferState
) {
  const data: IStructuredOffers = {
    offers: [],
    suspendedOffers: [],
    markets: [],
    suspendedMarkets: [],
    lines: [],
    suspendedLines: [],
    outcomes: [],
    suspendedOutcomes: [],
  };
  if (!offers) return data;
  create<ISbkOffer, IOffer>({
    sbkEntity: offers,
    data: data.offers,
    stateKey: stateEntity.offer,
    onSuspend: (id) => suspend(id, state, data).offer(),
    idCreator: (id) => id,
    createEntity(offer) {
      const fixture = fixtures[offer.id];
      if (!fixture) return null;
      return {
        ...offer,
        markets: offerMarkets(state, offer.id),
        fixture: fixture.id,
      };
    },
    childCreator(offer, id) {
      return constructMarkets(offer.markets, id, data, state);
    },
    mergeChildren(offer, cb) {
      offer.markets = cb(offer.markets);
    },
  });
  return data;
}

function constructMarkets(
  markets: ISbkMarkets = {},
  offerId: string,
  data: IStructuredOffers,
  state: IOfferState
) {
  return create<ISbkMarket, IMarket>({
    sbkEntity: markets,
    data: data.markets,
    stateKey: stateEntity.market,
    parentId: offerId,
    onSuspend: (id) => suspend(id, state, data).market(),
    createEntity(market) {
      return {
        ...market,
        lines: marketLines(state, market.id),
        offer: offerId,
      };
    },
    childCreator(market, id) {
      return constructLines(market.lines, id, data, state);
    },
    mergeChildren(market, cb) {
      market.lines = cb(market.lines);
    },
  });
}

function constructLines(
  lines: ISbkLines = {},
  marketId: string,
  data: IStructuredOffers,
  state: IOfferState
) {
  return create<ISbkLine, ILine>({
    sbkEntity: lines,
    data: data.lines,
    stateKey: stateEntity.line,
    parentId: marketId,
    onSuspend: (id) => suspend(id, state, data).line(),
    createEntity(line) {
      return {
        ...line,
        outcomes: lineOutcomes(state, line.id),
        market: marketId,
      };
    },
    childCreator(line, id) {
      return constructOutcomes(line.outcomes, id, data, state);
    },
    mergeChildren(line, cb) {
      line.outcomes = cb(line.outcomes);
    },
  });
}

function constructOutcomes(
  outcomes: ISbkOutcomes = {},
  lineId: string,
  data: IStructuredOffers,
  state: IOfferState
) {
  return create<ISbkOutcome, IOutcome>({
    sbkEntity: outcomes,
    data: data.outcomes,
    stateKey: stateEntity.outcome,
    parentId: lineId,
    onSuspend: (id) => suspend(id, state, data).outcome(),
    createEntity(outcome) {
      const stateOutcome = state.outcomes.entities[outcome.id];
      const trend = stateOutcome ? outcome.odds - stateOutcome.odds : 0;
      return { ...outcome, line: lineId, trend };
    },
  });
}

function constructScores(
  scores: ISbkScores | undefined,
  fixtures: IMap<IFixture | undefined>,
  state: IOfferState
) {
  const data: IStructuredScores = {
    scores: [],
    suspendedScores: [],
  };
  if (!scores) return data;
  create<ISbkScore, IScore>({
    sbkEntity: scores,
    data: data.scores,
    stateKey: stateEntity.score,
    onSuspend: (id) => suspend(id, state, data).score(),
    idCreator: (id) => id,
    createEntity(score) {
      const fixture = fixtures[score.id];
      if (!fixture) return null;
      return {
        ...JSON.parse(JSON.stringify(score)),
        fixture: fixture?.id || "",
      };
    },
  });
  return data;
}
