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
  ISbkConstruct,
  ISbkSport,
  ISbkCategory,
  ISbkFixture,
  ISbkRound,
  ISbkSeason,
  ISbkTournament,
  IStateElement,
  ISbkOffer,
  ISbkOutcome,
  ISbkLine,
  ISbkMarket,
  ISbkScore,
} from "../model";
import { stateEntity } from "../model";
import { createId } from "../util";
import { IOfferState } from "../slice";
import { filterOutFalsy, IMap } from "../../../../app/util";
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

interface IStructuredSports {
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

interface IStructuredOffers {
  offers: IOffer[];
  suspendedOffers: string[];
  markets: IMarket[];
  suspendedMarkets: string[];
  lines: ILine[];
  suspendedLines: string[];
  outcomes: IOutcome[];
  suspendedOutcomes: string[];
}

interface IStructuredScores {
  scores: IScore[];
  suspendedScores: string[];
}

const filterDuplicates = (a: string[], b: string[]) =>
  Array.from(new Set([...a, ...b]));

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
  const constructedScores = constructScores(scoresSbk, mergedFixtures);
  return {
    ...constructedSports,
    ...constructedOffers,
    fixtures: Object.values(constructedSports.fixtures),
    ...constructedScores,
  };
}

interface ICreate<T, V> {
  sbkEntity: ISbkConstruct;
  data: IMap<V> | V[];
  stateKey: stateEntity;
  createEntity: (
    partialEntity: T & ReturnType<typeof createPartialEntity>
  ) => V | null;
  suspendedArray: string[];
  idCreator?: (id: string) => string;
  parentId?: string;
  childCreator?: (entity: T, id: string) => string[];
  mergeChildren?: (entity: V, ids: string[]) => void;
}

function createPartialEntity<T>(entity: T, id: string, key: string) {
  return { ...entity, id, key };
}

function create<T, V extends IStateElement>({
  sbkEntity,
  data,
  stateKey,
  createEntity,
  childCreator,
  idCreator,
  parentId,
  suspendedArray,
  mergeChildren,
}: ICreate<T, V>) {
  return Object.entries(sbkEntity)
    .map(([key, entity]) => {
      const id = idCreator ? idCreator(key) : createId(stateKey, key, parentId);
      if (!entity) {
        suspendedArray.push(id);
        return id;
      }
      const partialEntity = createPartialEntity<T>(entity, id, key);
      const newEntity = createEntity(partialEntity);
      const childIds = childCreator?.(entity, id) || [];
      if (!newEntity) return null;
      mergeChildren?.(newEntity, childIds);
      if (Array.isArray(data)) {
        data.push(newEntity);
      } else if (typeof data === "object") {
        data[id] = newEntity;
      }
      return id;
    })
    .filter(filterOutFalsy);
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
    suspendedArray: data.suspendedSports,
    createEntity(sport) {
      return {
        ...sport,
        categories: sportCategories(state, sport.id),
      };
    },
    childCreator(sport, id) {
      return constructCategories(sport.categories, id, data, state);
    },
    mergeChildren(sport, ids) {
      sport.categories = filterDuplicates(sport.categories, ids);
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
    suspendedArray: data.suspendedCategories,
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
    mergeChildren(category, ids) {
      category.tournaments = filterDuplicates(category.tournaments, ids);
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
    suspendedArray: data.suspendedTournaments,
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
    mergeChildren(tournament, ids) {
      tournament.seasons = filterDuplicates(tournament.seasons, ids);
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
    suspendedArray: data.suspendedSeasons,
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
    mergeChildren(season, ids) {
      season.rounds = filterDuplicates(season.rounds, ids);
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
    suspendedArray: data.suspendedRounds,
    createEntity(round) {
      return {
        ...round,
        fixtures: roundFixtures(state, round.id),
        season: seasonId,
      };
    },
    childCreator(round, id) {
      return constructFixtures(round.fixtures, id, data);
    },
    mergeChildren(round, ids) {
      round.fixtures = filterDuplicates(round.fixtures, ids);
    },
  });
}

function constructFixtures(
  fixtures: ISbkFixtures,
  roundId: string,
  data: IStructuredSports
) {
  return create<ISbkFixture, IFixture>({
    sbkEntity: fixtures,
    data: data.fixtures,
    stateKey: stateEntity.fixture,
    suspendedArray: data.suspendedFixtures,
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
    suspendedArray: data.suspendedOffers,
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
    mergeChildren(offer, ids) {
      offer.markets = filterDuplicates(offer.markets, ids);
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
    suspendedArray: data.suspendedMarkets,
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
    mergeChildren(market, ids) {
      market.lines = filterDuplicates(market.lines, ids);
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
    suspendedArray: data.suspendedLines,
    createEntity(line) {
      return {
        ...line,
        outcomes: lineOutcomes(state, line.id),
        market: marketId,
      };
    },
    childCreator(line, id) {
      return constructOutcomes(line.outcomes, id, data);
    },
    mergeChildren(line, ids) {
      line.outcomes = filterDuplicates(line.outcomes, ids);
    },
  });
}

function constructOutcomes(
  outcomes: ISbkOutcomes = {},
  lineId: string,
  data: IStructuredOffers
) {
  return create<ISbkOutcome, IOutcome>({
    sbkEntity: outcomes,
    data: data.outcomes,
    stateKey: stateEntity.outcome,
    parentId: lineId,
    suspendedArray: data.suspendedOutcomes,
    createEntity(outcome) {
      return { ...outcome, line: lineId };
    },
  });
}

function constructScores(
  scores: ISbkScores | undefined,
  fixtures: IMap<IFixture | undefined>
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
    suspendedArray: data.suspendedScores,
    idCreator: (id) => id,
    createEntity(offer) {
      const fixture = fixtures[offer.id];
      if (!fixture) return null;
      return { ...offer, fixture: fixture?.id || "" };
    },
  });
  return data;
}
