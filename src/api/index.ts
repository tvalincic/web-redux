import full from "./mock/full.json";
import diffs from "./mock/diffs.json";
import { structure } from "../features/offer/state/structure";
import { IOfferState } from "../features/offer";

type subFunction = <T>(data: T) => void;

var subscriptions: subFunction[] = [];
var counter = 0;
var interval: NodeJS.Timeout;
const defaultTimer = 1000;
var timer = defaultTimer;
var resetHandler: (() => void) | null = null;
var started = false;

function subscribe(fn: subFunction) {
  subscriptions.push(fn);
  fn(full);
}

function start(onReset?: () => void) {
  if (onReset) resetHandler = onReset;
  started = true;
  interval = setInterval(() => {
    if (!diffs[counter]) {
      reset();
      if (resetHandler) resetHandler();
      return;
    }
    subscriptions.forEach((sub) => sub(diffs[counter]));
    counter++;
  }, timer);
}

function stop() {
  started = false;
  clearInterval(interval);
}

function changeTime(value: number) {
  var shouldRestart = started;
  stop();
  timer = value || 1;
  if (shouldRestart) start();
}

function reset() {
  stop();
  timer = defaultTimer;
  counter = 0;
}

export const client = {
  subscribe,
  start,
  stop,
  reset,
  changeTime,
  log(state: IOfferState) {
    console.log(structure(full, state));
  },
  getDefaultTimer: () => 1000,
};
