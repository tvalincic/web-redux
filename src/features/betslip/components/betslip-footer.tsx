import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeStake } from "../state/actions";
import { RootState } from "../../../app/store";

export const BetSlipFooter = () => {
  const {
    odd,
    payout,
    numberOfSelection,
    stake,
    stakeWithoutMC,
    tax,
    mc,
    winning,
  } = useSelector(({ betSlip }: RootState) => betSlip);
  const dispatch = useDispatch();
  return (
    <div className="betslip-footer">
      <div className="footer-data">
        <div className="betslip-data selections">{numberOfSelection} par</div>
        <div className="betslip-data accumulated-odd">Tečaj: {odd}</div>
      </div>
      <input
        type="text"
        className="input-stake"
        name="stake"
        value={stake}
        onChange={(e) => dispatch(changeStake(Number(e.target.value)))}
      />
      <div className="mt">
        -{mc} kn (5% mt) = {stakeWithoutMC} kn
      </div>
      <div className="footer-data">
        <div className="betslip-data payout-text">Isplata</div>
        <div className="betslip-data payout">{payout} kn</div>
      </div>
      <div className="footer-data">
        <div className="betslip-data winning-text">Dobitak</div>
        <div className="betslip-data winning">{winning} kn</div>
      </div>
      <div className="footer-data">
        <div className="betslip-data tax-text">Porez</div>
        <div className="betslip-data tax">{tax} kn</div>
      </div>
    </div>
  );
};
