import {
  IStructuredSports,
  IStructuredOffers,
  IStructuredScores,
} from "./model";
import { IOfferState } from "../slice";
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

function suspendEntity<T>(
  id: string,
  state: T,
  data: any,
  key: string,
  selectFromState?: (state: T, id: string) => string[],
  childrenCallback?: (id: string, state: any, data: any) => void
) {
  if (data[`suspended${key}`]) data[`suspended${key}`].push(id);
  const ids = selectFromState?.(state, id) || [];
  ids.forEach((i) => childrenCallback?.(i, state, data));
}

export function suspend<
  T extends IStructuredSports | IStructuredOffers | IStructuredScores
>(id: string, state: IOfferState, data: T) {
  return {
    sport() {
      suspendEntity(
        id,
        state,
        data,
        "Sports",
        sportCategories,
        this.category.bind(this)
      );
    },
    category() {
      suspendEntity(
        id,
        state,
        data,
        "Categories",
        categoryTournaments,
        this.tournament.bind(this)
      );
    },
    tournament() {
      suspendEntity(
        id,
        state,
        data,
        "Tournaments",
        tournamentSeasons,
        this.season.bind(this)
      );
    },
    season() {
      suspendEntity(
        id,
        state,
        data,
        "Seasons",
        seasonRounds,
        this.round.bind(this)
      );
    },
    round() {
      suspendEntity(
        id,
        state,
        data,
        "Rounds",
        roundFixtures,
        this.fixture.bind(this)
      );
    },
    fixture() {
      suspendEntity(id, state, data, "Fixtures");
    },
    offer() {
      suspendEntity(
        id,
        state,
        data,
        "Offers",
        offerMarkets,
        this.market.bind(this)
      );
    },
    market() {
      suspendEntity(
        id,
        state,
        data,
        "Markets",
        marketLines,
        this.line.bind(this)
      );
    },
    line() {
      suspendEntity(
        id,
        state,
        data,
        "Lines",
        lineOutcomes,
        this.outcome.bind(this)
      );
    },
    outcome() {
      suspendEntity(id, state, data, "Outcomes");
    },
    score() {
      suspendEntity(id, state, data, "Scores");
    },
  };
}
