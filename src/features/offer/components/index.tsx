import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { handleDiff } from "../state/slice";
import { Sidebar } from "./sidebar";
import { CenterSection } from "./center-section";
import amp, { getStream, stream } from "../../../api/amp";
import { ISbkResponse } from "../state/model";

export const Offer = () => {
  const dispatch = useDispatch();

  const onDiff = useCallback(
    (data: ISbkResponse) => {
      dispatch(handleDiff(data));
    },
    [dispatch]
  );

  useEffect(() => {
    const STREAM = getStream(stream.index);
    amp.subscribe<ISbkResponse>(STREAM, onDiff);
    return () => amp.unSubscribe<ISbkResponse>(STREAM, onDiff);
  }, [onDiff]);

  return (
    <section className="offer">
      <Sidebar />
      <CenterSection handleDiff={onDiff} />
    </section>
  );
};
