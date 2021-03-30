import createAmp from "@minus5/amp-sdk";
import { translate } from "./translate";
import { joinStrings } from "../app/util";

const amp = createAmp({
  paths: {
    api: "/api/sbk",
  },
  v1: true,
  transformBody: translate,
});

const LANG = "hr";

export enum stream {
  index = "i",
  match = "u",
}

export function getStream(s: stream, id?: string) {
  const d = "_";
  switch (s) {
    case stream.index:
      return joinStrings(d, s, LANG);
    case stream.match:
      return joinStrings(d, s, id || "", LANG);
    default:
      return "";
  }
}

export default amp;
