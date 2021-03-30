declare module "@minus5/legenda.lib/src/translate_factory";
declare module "@minus5/foundation.lib" {
  interface IString {
    ToMoneyNumber: (num: string) => number;
  }
  interface INumber {
    toTecaj: (num: number) => number;
    toCurrency: (num: number, decimalPlaces?: number) => number;
    toTecajLong: (num: number) => number;
  }
  interface IDate {
    Format: (date: Date | string, format: string) => string;
  }
  interface IURLLib {
    parseQS: (query: string) => { [index: string]: string };
    urlencode: (obj: { [index: string]: string | number | boolean }) => string;
  }
  export const String: IString;
  export const Number: INumber;
  export const Date: IDate;
  export const urllib: IURLLib;
}
declare module "@minus5/listic.lib" {
  export enum betSlipType {
    "regular",
    "system",
  }
  export interface IBetSlip {
    tecaj: number;
    dobitak: number;
    eventualniDobitak: number;
    tip: betSlipType;
    status: number;
    parova: number;
    error: string;
    vrijeme: string;
    ulogBez: () => number;
    ulogSa: () => number;
    ulogMt: () => number;
    kombinacija: () => IBetSlipCombination;
  }
  interface IBetSlipCombination {
    tecajevi: ISlipOdd[];
    tecaj: () => number;
  }
  export enum sourceId {
    "prematch",
    "live",
    "loto",
    "konji",
    "virtualniNogomet",
    "vsport",
    "games",
    "betbuilder",
    "virtuals",
  }

  export interface ISlipOdd {
    tecajId: number;
    ponudaId?: number;
    ponudaIdb?: number;
    dogadjajId?: number;
    dogadjajIdb?: number;
    izvlacenjeId?: string;
    krug?: number;
    odabir?: boolean;
    index?: number;
    naziv: string;
    broj?: string;
    vrijeme?: string;
    datum?: string;
    tip?: string;
    tecaj: number;
    dependencyAttr?: string;
    zavisnePonude?: string;
    minUtakmica?: number;
    maxUtakmica?: number;
    dogadjajGrupa?: number;
    grupa?: number;
    maxUlog?: number;
    poredakLiga?: number;
    live?: boolean;
    izvorId: sourceId;
    baseid?: number;
    isFix?: boolean;
    selected?: boolean;
    sourceId?: number;
    fixtureId?: number;
    urn?: string;
    seasonId?: number;
    marketId?: number;
    lineId?: number;
    outcomeId?: number;
    subscribeKey?: string;
    rowId?: number;
    id: number;
  }
  export interface IBetSlipTax {
    izracun: (
      ulogBez: number,
      dobitak: number,
      tipObracuna?: number
    ) => IBetSlipTaxReturn;
  }
  export interface IBetSlipTaxReturn {
    dobitakBez: number;
    dobitakBezOpis: string;
    porez: number;
    porezOpis: string;
    raspis: ISlipTaxBreakdown[];
  }
  export interface ISlipTaxBreakdown {
    porezniRazred: [number, number];
    porezniRazredOpis: string;
    iznosPoreza: number;
    iznosPorezaOpis: string;
    poreznaStopa: number;
    poreznaStopaOpis: string;
  }
  export interface IOddDefinition {
    izvorId: sourceId;
    tecajId: string;
  }
  interface IAddOddReturn {
    ok: boolean;
    msgType: string;
    tecajAddInfo: boolean;
    zamjena?: boolean;
    added?: IOddDefinition;
    removed?: IOddDefinition[];
    messages?: string[];
    message?: string;
  }
  interface IRemoveOddReturn {
    ok: boolean;
    removed: IOddDefinition[];
  }
  interface IOdd {
    datum?: string;
    dogadjajId: string;
    id?: string;
    izvorId: sourceId;
    naziv: string;
    ponudaId?: string;
    tecaj: number;
    tecajId: string;
    tip: string;
    vrijeme?: string;
  }
  export interface IChange {
    tipPromjene: string;
    izvorId: sourceId;
    tecajId: string;
    noviTecajId?: string;
    noviTecaj?: number;
    naziv?: string;
  }
  export interface IBetSlipApi {
    listic: () => IBetSlip;
    add: (odd: IOdd) => IAddOddReturn;
    remove: (sourceId: sourceId, id: string) => IRemoveOddReturn;
    ulog: (stake: number) => boolean;
    promjene: (data: IChange[]) => boolean;
    porez: IBetSlipTax;
  }
  declare function createBetSlip(): IBetSlipApi;
  export = createBetSlip;
}
declare module "@minus5/amp-sdk" {
  interface IAmp {
    request: (uri: any, payload: any, ok: any, fail: any) => void;
    setMeta: (meta: any) => void;
    subscribe: <T>(key: string, handler: (data: T) => void) => void;
    unSubscribe: <T>(key: string, handler: (data: T) => void) => void;
    close: () => void;
  }
  declare function createAmp(config: any): IAmp;
  export = createAmp;
}
