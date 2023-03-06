import { ITask } from "../model/task";

export const getDifference = (
  initialArray: Omit<ITask, "position">[],
  newArray: Omit<ITask, "position">[]
): Omit<ITask, "position">[] =>
  newArray.filter((t, i) => {
    const initialVersion = initialArray.find((t2) => t2.id === t.id);
    return initialVersion?.above_task_id !== t.above_task_id;
  });

export function groupBy<K, V>(array: V[], grouper: (item: V) => K) {
  return array.reduce((store, item) => {
    var key = grouper(item) || null;
    if (!store.has(key)) {
      store.set(key, [item]);
    } else {
      store.get(key).push(item);
    }
    return store;
  }, new Map<K, V[]>());
}

export const sortByPosition = (tasks: ITask[]) =>
  tasks?.sort((a, b) => (a.position > b.position ? 1 : -1));

export const getColumnId = (tasks: ITask[]) => {
  const firstElemColumn = tasks?.length > 0 ? tasks[0].column_id : null;
  return firstElemColumn || null;
};
