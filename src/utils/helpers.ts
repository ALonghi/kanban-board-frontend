import { ITask } from "../model/task";

export const getDifference = (
  initialArray: Omit<ITask, "position">[],
  newArray: Omit<ITask, "position">[]
): Omit<ITask, "position">[] =>
  newArray.filter((t, i) => {
    const initialVersion = initialArray.find((t2) => t2.id === t.id);
    return initialVersion?.above_task_id !== t.above_task_id;
  });
