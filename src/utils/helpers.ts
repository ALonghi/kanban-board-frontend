import GroupedTasks from "../model/groupedTasks";
import { ITask } from "../model/task";
import { IBoard, IBoardColumn } from '../model/board';
import DateUtils from "./dateUtils";

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
  // putting tasks without column first
  const unassignedColumn: IBoardColumn = {
    id: UNASSIGNED_COLUMN_ID,
    name: UNASSIGNED_COLUMN_NAME,
    created_at: DateUtils.getCurrentUTCDateStr()
  }
  result.push({
    columnId: unassignedColumn.id,
    column: unassignedColumn,
    elems: array.filter(t => !!!t.column_id)
  })
  // adding tasks with related column
  const withColumn = array.filter(t => !!t.column_id)
  result = [...result, ...board?.columns?.map(column => ({
    columnId: column.id,
    column: column,
    elems: withColumn.filter(t => column.id === t.column_id)
  })
  )]
  return result;
}

export const sortByPosition = (tasks: ITask[]) =>
  tasks?.sort((a, b) => (a.position > b.position ? 1 : -1));

export const getColumnId = (tasks: ITask[]) => {
  const firstElemColumn = tasks?.length > 0 ? tasks[0].column_id : null;
  return firstElemColumn || null;
};
