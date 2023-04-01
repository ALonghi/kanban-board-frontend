import { cloneDeep } from "lodash";
import { useState } from "react";
import { CreateTaskRequest } from "../../../../model/dto";
import { ITask } from "../../../../model/task";
import { createToast, IToast } from "../../../../model/toast";
import TaskService from "../../../../service/taskService";
import { addNotification } from "../../../../stores/notificationStore";
import { sortByPosition } from "../../../../utils/helpers";

export const useColumnHooks = (
  boardId: string,
  tasks: ITask[],
  updateTasks: React.Dispatch<React.SetStateAction<ITask[]>>,
  setNewTaskData: React.Dispatch<React.SetStateAction<Omit<ITask, "id" | "created_at" | "position"> | null>>
) => {


  const saveTaskData = async (task: ITask | Partial<ITask>): Promise<void> => {
    const ordered = sortByPosition(tasks || []);
    const orderedTask: ITask | Partial<ITask> = {
      ...task,
      above_task_id: ordered ? ordered[tasks.length - 1]?.id : null,
    };

    if (task.id) {
      return await TaskService.updateTask(orderedTask as ITask, boardId).then(
        (result) => {
          const exists = tasks.find((t) => t.id === result.id);
          exists
            ? updateTasks(tasks.map((t) => (t.id === result.id ? result : t)))
            : updateTasks([...tasks, result]);
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
        column_id: task?.column_id || null,
        above_task_id: orderedTask.above_task_id || null,
        board_id: boardId,
      };
      return TaskService.createTask(task_request).then((created) => {
        const lastPosition = ordered[tasks.length - 1]?.position || 0;
        const updatedList = [
          ...tasks,
          { ...created, position: lastPosition + 1 },
        ];
        updateTasks(updatedList);
        setNewTaskData(null);
        const toast: IToast = createToast(
          "Task created successfully.",
          "success"
        );
        addNotification(toast);
      });
    }
  };

  const deleteTask = async (taskId: ITask["id"]) => {
    await TaskService.deleteTask(taskId, boardId)
      .then(async () => {
        const elemIndex = tasks.findIndex((t) => t.id === taskId);
        // element exists and is not the last in the list
        const nextElem = tasks?.length > 1 ? tasks[elemIndex + 1] : null;
        const nextElemUpdated: ITask = {
          ...tasks[elemIndex + 1],
          above_task_id: elemIndex === 0 ? null : tasks[elemIndex - 1]?.id,
          position: nextElem?.position
            ? nextElem?.position - 1
            : tasks.length - 1,
        };
        if (nextElem) {
          const nextElemUpdatedNoPosition: ITask = cloneDeep(nextElemUpdated);
          delete nextElemUpdatedNoPosition.position;
          await TaskService.updateTask(nextElemUpdatedNoPosition, boardId);
        }

        const updatedTasks = tasks
          .map((t) => (t.id === nextElem?.id ? nextElemUpdated : t))
          .filter((t) => t.id !== taskId);
        updateTasks
          ? updateTasks(updatedTasks)
          : console.warn("updateTasks not provided");
        const toast: IToast = createToast(
          "The requested task was deleted.",
          "success"
        );
        addNotification(toast);
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
