import GroupedTasks from "../model/groupedTasks";
import { ITask } from "../model/task";
import { IBoard, IBoardColumn } from '../model/board';
import DateUtils from "./dateUtils";
import { cloneDeep } from 'lodash';

export const UNASSIGNED_COLUMN_ID = "-1"
export const UNASSIGNED_COLUMN_NAME = "Unassigned"
export const getDifference = (
  initialArray: Omit<ITask, "position">[],
  newArray: Omit<ITask, "position">[]
): Omit<ITask, "position">[] =>
  newArray.filter((t, i) => {
    const initialVersion = initialArray.find((t2) => t2.id === t.id);
    return initialVersion?.above_task_id !== t.above_task_id;
  });

export function groupByColumn(array: ITask[], board: IBoard): GroupedTasks[] {
  let result: GroupedTasks[] = []
  console.log(` groupByColumn input: ${JSON.stringify(array)}`)
  // putting tasks without column first
  const unassignedColumn: IBoardColumn = {
    id: UNASSIGNED_COLUMN_ID,
    name: UNASSIGNED_COLUMN_NAME,
    created_at: DateUtils.getCurrentUTCDateStr()
  }
  result.push({
    [unassignedColumn.id]: {
      column: unassignedColumn,
      items: sortByPosition(array.filter(t => !!!t.column_id))
    },
  })
  // adding tasks with related column
  const withColumn = array.filter(t => !!t.column_id)
  result = [...result, ...board?.columns?.map(column => ({
    [column.id]: {
      column: column,
      items: sortByPosition(withColumn.filter(t => column.id === t.column_id))
    },
  })
  )]
  console.log(` groupByColumn result: ${JSON.stringify(array)}`)

  return result;
}

export const sortByPosition = (tasks: ITask[]) =>
  tasks?.sort((a, b) => a.position > b.position ? 1 : -1));


export const getColumnId = (tasks: ITask[]) => {
  const firstElemColumn = tasks?.length > 0 ? tasks[0].column_id : null;
  return firstElemColumn || null;
};

export const getUpdatedMapped = (reordered: ITask[]): Omit<ITask, "position">[] => {
  const mapped = sortByPosition(reordered)?.map((task, i) => {
    delete task.position;
    if (i === 0) {
      delete task.above_task_id;
      return task;
    } else {
      const parent = reordered[i - 1] || null;
      return { ...task, above_task_id: parent?.id || null };
    }
  }) || [];
  return mapped;
}

export const getOldMapped = (tasks: ITask[]): Omit<ITask, "position">[] => {
  const oldMapped = tasks.map((t) => {
    delete t.position;
    return t;
  });
  return oldMapped
}

export const swap = (array: ITask[], draggedItem: ITask, overItem: ITask): ITask[] => {
  const filterOutRelated = (task: ITask) =>
    task.id !== draggedItem.id && task.id !== overItem.id
  // getting over item index to know the index before to put the dragged one
  const overItemIndex = array.findIndex(t => t.id === overItem.id)
  if (overItemIndex >= 0 && array.length > 0) {
    // elements previously before the overed item
    const beforeOvered = array.slice(0, overItemIndex).filter(filterOutRelated) || []
    // elements previously after the overed item
    const afterOvered = array.slice(overItemIndex + 1, -1).filter(filterOutRelated) || []
    // rebuilding whole column with correct order
    const remapped = [
      ...beforeOvered,
      draggedItem,
      overItem,
      ...afterOvered
    ]
    // setting above element reference properly after reordering
    return remapped.map((t, i) => {
      if (i === 0) {
        let toUpdate = cloneDeep(t)
        delete toUpdate.above_task_id
        return toUpdate
      } else {
        return { ...t, above_task_id: remapped[i - 1]?.id }
      }
    })
  } else {
    console.warn(`Trying to swap on a non existing item in the input array: ${overItem.id}`)
    return array;
  }
}
