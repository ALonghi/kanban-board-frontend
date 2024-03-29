import { IBoard, IBoardColumn } from "../model/board";
import GroupedTasks from "../model/groupedTasks";
import { ITask } from "../model/task";
import DateUtils from "./dateUtils";

export const UNASSIGNED_COLUMN_ID = "-1";
export const UNASSIGNED_COLUMN_NAME = "Unassigned";

export const removePositionField = (
  array: GroupedTasks[]
): Omit<ITask, "position">[] => {
  const toPositionOmitted = (task: ITask): Omit<ITask, "position"> => {
    const result: Omit<ITask, "position"> = {
      id: task.id,
      title: task.title,
      description: task.description || null,
      column_id: task.column_id || null,
      above_task_id: task.above_task_id || null,
      board_id: task.board_id,
      created_at: task.created_at,
      updated_at: task.updated_at || null,
    };
    return result;
  };

  return array.flatMap((e) => e.items).map(toPositionOmitted);
};

export const mapAfterSwap = (array: ITask[]): ITask[] => {
  return array.map((e, i) => {
    if (i === 0) {
      return { ...e, position: i, above_task_id: null };
    } else {
      return { ...e, position: i, above_task_id: array[i - 1]?.id };
    }
  });
};

export const getDifference = (
  initialArray: Omit<ITask, "position">[],
  newArray: Omit<ITask, "position">[]
): Omit<ITask, "position">[] =>
  newArray.filter((t, i) => {
    const initialVersion = initialArray.find((t2) => t2.id === t.id);
    return initialVersion?.above_task_id !== t.above_task_id;
  });

export function groupByColumn(array: ITask[], board: IBoard): GroupedTasks[] {
  let result: GroupedTasks[] = [];
  // putting tasks without column first
  const unassignedColumn: IBoardColumn = {
    id: UNASSIGNED_COLUMN_ID,
    name: UNASSIGNED_COLUMN_NAME,
    created_at: DateUtils.getCurrentUTCDateStr(),
  };
  result.push({
    columnId: unassignedColumn.id,
    column: unassignedColumn,
    items: sortByPosition(array.filter((t) => !!!t.column_id)),
  });
  // adding tasks with related column
  const withColumn = array.filter((t) => !!t.column_id);
  result = [
    ...result,
    ...board?.columns?.map((column) => ({
      columnId: column.id,
      column: column,
      items: sortByPosition(
        withColumn.filter((t) => column.id === t.column_id)
      ),
    })),
  ];
  return result;
}

export const sortByPosition = (tasks: ITask[]) =>
  tasks?.sort((a, b) => (a.position > b.position ? 1 : -1));
