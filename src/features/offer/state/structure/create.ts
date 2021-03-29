import { ISbkConstruct, IStateElement } from "../model";
import { stateEntity } from "../model";
import { createId } from "../util";
import { IMap } from "../../../../app/util";

interface ICreate<T, V> {
  sbkEntity: ISbkConstruct;
  data: IMap<V> | V[];
  stateKey: stateEntity;
  createEntity: (
    partialEntity: T & ReturnType<typeof createPartialEntity>
  ) => V | null;
  onSuspend: (id: string) => void;
  idCreator?: (id: string) => string;
  parentId?: string;
  childCreator?: (entity: T, id: string) => ReturnType<typeof create>;
  mergeChildren?: (entity: V, cb: (children: string[]) => string[]) => void;
}

interface ICompiledIds {
  new: string[];
  deleted: string[];
}

function filterDuplicates(...arrays: string[][]) {
  return Array.from(new Set(arrays.flat()));
}

function createPartialEntity<T>(entity: T, id: string, key: string) {
  return { ...entity, id, key };
}

function initialIds(): ICompiledIds {
  return {
    new: [],
    deleted: [],
  };
}

export function create<T, V extends IStateElement>({
  sbkEntity,
  data,
  stateKey,
  createEntity,
  childCreator,
  idCreator,
  parentId,
  onSuspend,
  mergeChildren,
}: ICreate<T, V>) {
  return Object.entries(sbkEntity).reduce(
    (ids: ICompiledIds, [key, entity]) => {
      const id = idCreator ? idCreator(key) : createId(stateKey, key, parentId);

      if (!entity) {
        onSuspend(id);
        ids.deleted.push(id);
        return ids;
      }

      const partialEntity = createPartialEntity<T>(entity, id, key);
      const newEntity = createEntity(partialEntity);
      if (!newEntity) return ids;

      const childIds = childCreator?.(entity, id) || initialIds();
      mergeChildren?.(newEntity, (children) => {
        return filterDuplicates(children, childIds.new).filter(
          (id) => !childIds.deleted.includes(id)
        );
      });

      if (Array.isArray(data)) {
        data.push(newEntity);
      } else if (typeof data === "object") {
        data[id] = newEntity;
      }

      ids.new.push(id);
      return ids;
    },
    initialIds()
  );
}
