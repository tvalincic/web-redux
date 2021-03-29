import { IOfferState } from "../slice";

export const sportCategories = ({ sports }: IOfferState, id: string) => {
  return sports.entities[id]?.categories || [];
};

export const categoryTournaments = (
  { categories }: IOfferState,
  id: string
) => {
  return categories.entities[id]?.tournaments || [];
};

export const tournamentSeasons = ({ tournaments }: IOfferState, id: string) => {
  return tournaments.entities[id]?.seasons || [];
};

export const seasonRounds = ({ seasons }: IOfferState, id: string) => {
  return seasons.entities[id]?.rounds || [];
};

export const roundFixtures = ({ rounds }: IOfferState, id: string) => {
  return rounds.entities[id]?.fixtures || [];
};

export const offerMarkets = ({ offers }: IOfferState, id: string) => {
  return offers.entities[id]?.markets || [];
};

export const marketLines = ({ markets }: IOfferState, id: string) => {
  return markets.entities[id]?.lines || [];
};

export const lineOutcomes = ({ lines }: IOfferState, id: string) => {
  return lines.entities[id]?.outcomes || [];
};
