import { cloneDeep } from "lodash";
import { useState } from "react";
import { CreateTaskRequest } from "../../../../model/dto";
import GroupedTasks from "../../../../model/groupedTasks";
import { ITask } from "../../../../model/task";
import { createToast, IToast } from "../../../../model/toast";
import TaskService from "../../../../service/taskService";
import { addNotification } from "../../../../stores/notificationStore";
import { sortByPosition, UNASSIGNED_COLUMN_ID } from '../../../../utils/helpers';
import { IBoardColumn } from '../../../../model/board';

export const useColumnHooks = (
  boardId: string,
  groupedTasks: GroupedTasks[],
  updateGroupedTasks: React.Dispatch<React.SetStateAction<GroupedTasks[]>>,
  setNewTaskData: React.Dispatch<React.SetStateAction<Omit<ITask, "id" | "created_at" | "position"> | null>>
) => {


  const saveTaskData = async (task: ITask | Partial<ITask>): Promise<void> => {
    const ordered = sortByPosition(groupedTasks
      ?.filter(e => e.columnId === task.column_id)
      ?.flatMap(e => e.elems) || []);
    const orderedTask: ITask | Partial<ITask> = {
      ...task,
      above_task_id: ordered ? ordered[ordered.length - 1]?.id : null,
    };

    if (task.id) {
      return await TaskService.updateTask(orderedTask as ITask, boardId).then(
        (result) => {
          const exists = groupedTasks.find((t) =>
            t.columnId === result.column_id &&
            !!t.elems.find(t => t.id === result.id)
          );
          exists
            ? updateGroupedTasks((prev) =>
              prev.map((e) => e.columnId === task.column_id
                ? ({ ...e, elems: e.elems.map(t => task.id === t.id ? result : t) })
                : e
              ))
            : updateGroupedTasks(prev =>
              prev.map(e => ({
                ...e,
                elems: e.elems?.length > 0
                  ? [...e.elems, result]
                  : [result]
              }))
            );
          setNewTaskData(null);
          const toast: IToast = createToast(
            "Task updated successfully.",
            "success"
          );
          addNotification(toast);
        }
      );
    } else {
      const task_request: CreateTaskRequest = {
        title: orderedTask.title,
        description: orderedTask.description || null,
        column_id: task?.column_id === UNASSIGNED_COLUMN_ID ? null : task?.column_id || null,
        above_task_id: orderedTask.above_task_id || null,
        board_id: boardId,
      };
      return TaskService.createTask(task_request).then((created) => {
        const lastPosition = ordered[groupedTasks.length - 1]?.position || 0;
        const updatedList = groupedTasks.map(e =>
          e.columnId === created.column_id
            ? ({
              ...e,
              elems: [...e.elems, { ...created, position: lastPosition + 1 }]
            })
            : e
        )
        updateGroupedTasks(updatedList);
        setNewTaskData(null);
        const toast: IToast = createToast(
          "Task created successfully.",
          "success"
        );
        addNotification(toast);
      });
    }
  };

  const deleteTask = async (taskId: ITask["id"], colId?: IBoardColumn["id"]) => {
    await TaskService.deleteTask(taskId, boardId)
      .then(() => {
        return Promise.all(groupedTasks.map(async (grouped) => {
          if (grouped.columnId === colId) {
            const elemIndex = grouped.elems.findIndex((t) => t.id === taskId);
            // checking if element exists and its not the last in the list
            const nextElem = grouped?.elems.length > 1 ? grouped.elems[elemIndex + 1] : null;
            const nextElemUpdated: ITask = {
              ...nextElem,
              above_task_id: elemIndex === 0 ? null : grouped.elems[elemIndex - 1]?.id,
              position: nextElem?.position
                ? nextElem?.position - 1
                : groupedTasks.length - 1,
            };
            if (nextElem) {
              const nextElemUpdatedNoPosition: ITask = cloneDeep(nextElemUpdated);
              delete nextElemUpdatedNoPosition.position;
              await TaskService.updateTask(nextElemUpdatedNoPosition, boardId);

            }
            const updatedTasks = grouped.elems
              ?.map((t) => (t.id === nextElem?.id ? nextElemUpdated : t))
              ?.filter((t) => t.id !== taskId);
            updateGroupedTasks((prev) =>
              prev?.map(elem =>
                elem.columnId === colId
                  ? { ...elem, elems: updatedTasks }
                  : elem
              )
            )
            const toast: IToast = createToast(
              "The requested task was deleted.",
              "success"
            );
            addNotification(toast);
          } return Promise.resolve()
        }))
      })
      .catch((err) => {
        const toast: IToast = createToast(
          `Task delete error: ${err.message}`,
          "error"
        );
        addNotification(toast);
        console.error(`error in task delete ${err?.message} ${err}`);
      });
  };

  return {
    deleteTask,
    saveTaskData,
  };
};
