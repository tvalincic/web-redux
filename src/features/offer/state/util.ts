import { stateEntity, stateEntityKey, IUnpackedId } from "./model";

export function createId(
  entity: stateEntity,
  id: string | number,
  parentId: string = ""
) {
  return `${parentId}_${entity}${id}`;
}

export function unpackOutcomeId(id: string) {
  return [
    stateEntity.fixture,
    stateEntity.market,
    stateEntity.line,
    stateEntity.outcome,
  ].reduce((data: IUnpackedId, delimiter) => {
    const unpackedId = id.split(`${delimiter}_`);
    data[stateEntityKey[delimiter]] = unpackedId[1] || "";
    return data;
  }, {});
}
