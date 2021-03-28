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

interface IStructuredSports {
  sports: ISport[];
  categories: ICategory[];
  tournaments: ITournament[];
  seasons: ISeason[];
  rounds: IRound[];
  fixtures: IMap<IFixture>;
}

interface IStructuredOffers {
  offers: IOffer[];
  markets: IMarket[];
  lines: ILine[];
  outcomes: IOutcome[];
}

export function structure(data: ISbkResponse, state: IOfferState) {
  const { full, diff } = data;
  const sportsSbk = full?.meta?.sports || diff?.meta?.sports;
  const offersSbk = full?.offers || diff?.offers;
  const scoresSbk = full?.scores || diff?.scores;
  const {
    sports,
    categories,
    tournaments,
    seasons,
    rounds,
    fixtures,
  } = constructSports(sportsSbk);
  const mergedFixtures = {
    ...state.fixtures.entities,
    ...fixtures,
  };
  const { offers, markets, lines, outcomes } = constructOffers(
    offersSbk,
    mergedFixtures
  );
  const scores = constructScores(scoresSbk, mergedFixtures);
  return {
    sports: [...sports],
    categories: [...categories],
    tournaments: [...tournaments],
    seasons: [...seasons],
    rounds: [...rounds],
    fixtures: Object.values(fixtures),
    offers: [...offers],
    markets: [...markets],
    lines: [...lines],
    outcomes: [...outcomes],
    scores: [...scores],
  };
}

interface ICreate<T, V> {
  sbkEntity: ISbkConstruct;
  data: IMap<V> | V[];
  stateKey: stateEntity;
  createEntity: (
    partialEntity: T & ReturnType<typeof createPartialEntity>
  ) => V | null;
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
  mergeChildren,
}: ICreate<T, V>) {
  return Object.entries(sbkEntity)
    .map(([key, entity]) => {
      const id = idCreator ? idCreator(key) : createId(stateKey, key, parentId);
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

function constructSports(sports: ISbkSports = {}) {
  const data = {
    sports: [],
    categories: [],
    tournaments: [],
    seasons: [],
    rounds: [],
    fixtures: {},
  };
  create<ISbkSport, ISport>({
    sbkEntity: sports,
    data: data.sports,
    stateKey: stateEntity.sport,
    createEntity(sport) {
      return { ...sport, categories: [] };
    },
    childCreator(sport, id) {
      return constructCategories(sport.categories, id, data);
    },
    mergeChildren(sport, ids) {
      sport.categories = [...ids];
    },
  });
  return data;
}

function constructCategories(
  categories: ISbkCategories,
  sportId: string,
  data: IStructuredSports
) {
  return create<ISbkCategory, ICategory>({
    sbkEntity: categories,
    data: data.categories,
    stateKey: stateEntity.category,
    parentId: sportId,
    createEntity(category) {
      return { ...category, tournaments: [], sport: sportId };
    },
    childCreator(category, id) {
      return constructTournaments(category.tournaments, id, data);
    },
    mergeChildren(category, ids) {
      category.tournaments = [...ids];
    },
  });
}

function constructTournaments(
  tournaments: ISbkTournaments,
  categoryId: string,
  data: IStructuredSports
) {
  return create<ISbkTournament, ITournament>({
    sbkEntity: tournaments,
    data: data.tournaments,
    stateKey: stateEntity.tournament,
    parentId: categoryId,
    createEntity(tournament) {
      return { ...tournament, seasons: [], category: categoryId };
    },
    childCreator(tournament, id) {
      return constructSeasons(tournament.seasons, id, data);
    },
    mergeChildren(tournament, ids) {
      tournament.seasons = [...ids];
    },
  });
}

function constructSeasons(
  seasons: ISbkSeasons,
  tournamentId: string,
  data: IStructuredSports
) {
  return create<ISbkSeason, ISeason>({
    sbkEntity: seasons,
    data: data.seasons,
    stateKey: stateEntity.season,
    parentId: tournamentId,
    createEntity(season) {
      return { ...season, rounds: [], tournament: tournamentId };
    },
    childCreator(season, id) {
      return constructRounds(season.rounds, id, data);
    },
    mergeChildren(season, ids) {
      season.rounds = [...ids];
    },
  });
}

function constructRounds(
  rounds: ISbkRounds,
  seasonId: string,
  data: IStructuredSports
) {
  return create<ISbkRound, IRound>({
    sbkEntity: rounds,
    data: data.rounds,
    stateKey: stateEntity.round,
    parentId: seasonId,
    createEntity(round) {
      return { ...round, fixtures: [], season: seasonId };
    },
    childCreator(round, id) {
      return constructFixtures(round.fixtures, id, data);
    },
    mergeChildren(round, ids) {
      round.fixtures = [...ids];
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
    idCreator: (id) => `m_${id}`,
    createEntity(fixture) {
      return { ...fixture, round: roundId };
    },
  });
}

function constructOffers(
  offers: ISbkOffers = {},
  fixtures: IMap<IFixture | undefined>
) {
  const data = {
    offers: [],
    markets: [],
    lines: [],
    outcomes: [],
  };
  create<ISbkOffer, IOffer>({
    sbkEntity: offers,
    data: data.offers,
    stateKey: stateEntity.offer,
    idCreator: (id) => id,
    createEntity(offer) {
      const fixture = fixtures[offer.id];
      if (!fixture) return null;
      return { ...offer, markets: [], fixture: fixture.id };
    },
    childCreator(offer, id) {
      return constructMarkets(offer.markets, id, data);
    },
    mergeChildren(offer, ids) {
      offer.markets = [...ids];
    },
  });
  return data;
}

function constructMarkets(
  markets: ISbkMarkets,
  offerId: string,
  data: IStructuredOffers
) {
  return create<ISbkMarket, IMarket>({
    sbkEntity: markets,
    data: data.markets,
    stateKey: stateEntity.market,
    parentId: offerId,
    createEntity(market) {
      return { ...market, lines: [], offer: offerId };
    },
    childCreator(market, id) {
      return constructLines(market.lines, id, data);
    },
    mergeChildren(market, ids) {
      market.lines = [...ids];
    },
  });
}

function constructLines(
  lines: ISbkLines,
  marketId: string,
  data: IStructuredOffers
) {
  return create<ISbkLine, ILine>({
    sbkEntity: lines,
    data: data.lines,
    stateKey: stateEntity.line,
    parentId: marketId,
    createEntity(line) {
      return { ...line, outcomes: [], market: marketId };
    },
    childCreator(line, id) {
      return constructOtcomes(line.outcomes, id, data);
    },
    mergeChildren(line, ids) {
      line.outcomes = [...ids];
    },
  });
}

function constructOtcomes(
  outcomes: ISbkOutcomes,
  lineId: string,
  data: IStructuredOffers
) {
  return create<ISbkOutcome, IOutcome>({
    sbkEntity: outcomes,
    data: data.outcomes,
    stateKey: stateEntity.outcome,
    parentId: lineId,
    createEntity(outcome) {
      return { ...outcome, line: lineId };
    },
  });
}

function constructScores(
  scores: ISbkScores = {},
  fixtures: IMap<IFixture | undefined>
) {
  const data: IScore[] = [];
  create<ISbkScore, IScore>({
    sbkEntity: scores,
    data,
    stateKey: stateEntity.score,
    idCreator: (id) => id,
    createEntity(offer) {
      const fixture = fixtures[offer.id];
      if (!fixture) return null;
      return { ...offer, fixture: fixture?.id || "" };
    },
  });
  return data;
}
