import React from "react";
import { useSelector } from "react-redux";
import { selectOutcomeIds } from "../state/selectors";
import { Outcome } from "./outcome";
import { BetSlipFooter } from "./betslip-footer";

export const BetSlip = () => {
  const outcomeIds = useSelector(selectOutcomeIds);
  return (
    <section className="betslip">
      <div className="betslip-header">Listić</div>
      <div className="betslip-outcomes">
        {outcomeIds.map((outcome) => (
          <Outcome id={outcome} key={outcome} />
        ))}
      </div>
      <BetSlipFooter />
    </section>
  );
};
