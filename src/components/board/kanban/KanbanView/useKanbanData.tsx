import { cloneDeep } from "lodash";
import { useState } from "react";
import { IBoard, IBoardColumn } from "../../../../model/board";
import { ITask } from "../../../../model/task";
import { createToast, IToast } from "../../../../model/toast";
import BoardService from "../../../../service/boardService";
import { addNotification } from "../../../../stores/notificationStore";
import { groupBy, sortByPosition } from "../../../../utils/helpers";
import Logger from "../../../../utils/logging";

export const useKanbanData = (board: IBoard, tasks: ITask[]) => {
  const [currentBoard, setCurrentBoard] = useState<IBoard>(board);
  const [currentTasks, setCurrentTasks] = useState<ITask[]>(tasks || []);

  const [updatedTasksGrouped, setUpdatedTasksGrouped] = useState<
    Map<IBoardColumn["id"], ITask[]>
  >(groupBy(tasks, (t) => t.column_id));

  const updateTasksForColumn = (tasks: ITask[], colId: IBoardColumn["id"]) => {
    console.log(
      `updateTasksForColumn received tasks ${JSON.stringify(tasks, null, 2)}`
    );
    console.log(`colId ${colId}`);
    const toUpdate = cloneDeep(updatedTasksGrouped);
    toUpdate.set(colId, sortByPosition(tasks));
    setUpdatedTasksGrouped((prev) => {
      const copy = cloneDeep(prev);
      copy.set(colId, toUpdate.get(colId));
      return copy;
    });
    // updating local tasks state
    const otherCategory = tasks.filter((t) => colId !== t.column_id) || [];
    setCurrentTasks([...otherCategory, ...tasks]);
  };

  const updateBoardColumn = async (col: IBoardColumn) => {
    const previousColumns =
      currentBoard?.columns?.filter((c) => c.id !== col.id) || [];
    const updatedBoard = {
      ...currentBoard,
      columns: [...previousColumns, col],
    };
    await BoardService.updateBoard(updatedBoard)
      .then((response) => {
        setCurrentBoard(response);
        const toast: IToast = createToast(
          "Board updated successfully.",
          "success"
        );
        addNotification(toast);
      })
      .catch((err) => {
        const toast: IToast = createToast(
          `Error in updating board: ${err.message} `,
          "error"
        );
        addNotification(toast);
        Logger.error(
          `Error while updating board ${currentBoard.id}: ${err.message || err}`
        );
      });
  };

  return {
    currentBoard,
    currentTasks,
    updatedTasksGrouped,
    updateTasksForColumn,
    updateBoardColumn,
  };
};
