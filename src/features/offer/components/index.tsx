import React, { useEffect } from "react";
import { client } from "../../../api";
import { useDispatch } from "react-redux";
import { handleDiff } from "../state/slice";
import { Sidebar } from "./sidebar";
import { CenterSection } from "./center-section";

export const Offer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    client.subscribe((diff) => dispatch(handleDiff(diff)));
  }, [dispatch]);

  return (
    <section className="offer">
      <Sidebar />
      <CenterSection />
    </section>
  );
};
