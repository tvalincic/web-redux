import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectOfferById, selectFixtureById } from "../../../state/selectors";
import { RootState } from "../../../../../app/store";
import amp, { getStream, stream } from "../../../../../api/amp";
import { ISbkResponse } from "../../../state/model";
import { Market } from "./market";

interface IFixtureDetails {
  id: React.ReactText;
  handleDiff: (data: ISbkResponse) => void;
}

export const FixtureDetails = ({ id, handleDiff }: IFixtureDetails) => {
  const fixture = useSelector((state: RootState) =>
    selectFixtureById(state, id)
  );
  const offer = useSelector((state: RootState) => selectOfferById(state, id));

  useEffect(() => {
    const STREAM = getStream(stream.match, String(id));
    amp.subscribe(STREAM, handleDiff);
    return () => amp.unSubscribe(STREAM, handleDiff);
  }, [id, handleDiff]);

  if (!fixture || !offer) return null;

  return (
    <section className="fixture-details">
      <div className="fixture-title">
        {fixture.home.name} - {fixture.away.name}
      </div>
      <div className="markets">
        {offer.markets.map((market) => (
          <Market id={market} key={market} />
        ))}
      </div>
    </section>
  );
};
