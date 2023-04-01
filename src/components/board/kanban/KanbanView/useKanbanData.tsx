import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { IBoard, IBoardColumn } from "../../../../model/board";
import { ITask } from "../../../../model/task";
import { createToast, IToast } from "../../../../model/toast";
import BoardService from "../../../../service/boardService";
import { addNotification } from "../../../../stores/notificationStore";
import { sortByPosition, groupByColumn } from '../../../../utils/helpers';
import Logger from "../../../../utils/logging";
import GroupedTasks from '../../../../model/groupedTasks';

export const useKanbanData = (board: IBoard, tasks: ITask[]) => {
  const [currentBoard, setCurrentBoard] = useState<IBoard>(board);
  const [currentTasks, setCurrentTasks] = useState<ITask[]>(tasks || []);
  const [newTaskData, setNewTaskData] = useState<Omit<ITask, "id" | "created_at" | "position"> | null>(null)

  const mapGroupedTasks = () => 
  groupByColumn(currentTasks, board).map(elem => ({
    columnId: elem.columnId,
    elems: elem.elems,
    column: currentBoard?.columns?.find(c => c.id === elem.columnId)
  }))

  const [groupedTasks, setGroupedTasks] = useState<
    GroupedTasks[]
  >(currentTasks?.length > 0 ? mapGroupedTasks() : []);

  useEffect(() => {
    setGroupedTasks(() => mapGroupedTasks())
  }, [currentTasks])


  const updateTasksForColumn = (tasksToUpdate: ITask[], colId: IBoardColumn["id"]) => {
    const tasksIdToUpdate = tasksToUpdate.map(t => t.id)
    console.log(
      `updateTasksForColumn received tasks ${JSON.stringify(tasksToUpdate, null, 2)}`
    );
    console.log(`colId ${colId}`);
    let toUpdate = currentTasks
      .filter(t => t.column_id === colId)
      .map(t => tasksIdToUpdate.includes(t.id)
        ? tasksToUpdate.find(task => task.id === t.id)
        : t
      )
    // updating local tasks state
    const otherCategory = currentTasks.filter((t) => colId !== t.column_id) || [];
    setCurrentTasks([...otherCategory, ...toUpdate]);
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
    groupedTasks,
    setCurrentTasks,
    updateTasksForColumn,
    updateBoardColumn,
    newTaskData,
    setNewTaskData,
  };
};
