import {cloneDeep} from "lodash";
import {CreateTaskRequest} from "../../../../model/dto";
import GroupedTasks from "../../../../model/groupedTasks";
import {ITask} from "../../../../model/task";
import {createToast, IToast} from "../../../../model/toast";
import TaskService from "../../../../service/taskService";
import {addNotification} from "../../../../stores/notificationStore";
import {sortByPosition, UNASSIGNED_COLUMN_ID,} from "../../../../utils/helpers";
import {IBoardColumn} from "../../../../model/board";

export const useColumnHooks = (
    boardId: string,
    groupedTasks: GroupedTasks[],
    updateGroupedTasks: React.Dispatch<React.SetStateAction<GroupedTasks[]>>,
    setNewTaskData: React.Dispatch<
        React.SetStateAction<Omit<ITask, "id" | "created_at" | "position"> | null>
    >
) => {
    const saveNewTask = (task_request: CreateTaskRequest): Promise<void> => {
        const maybeWithoutColumn: CreateTaskRequest = {
            ...task_request,
            column_id:
                task_request.column_id &&
                task_request.column_id !== UNASSIGNED_COLUMN_ID
                    ? task_request.column_id
                    : null,
        };
        return TaskService.createTask(maybeWithoutColumn).then((created) => {
            const columnId = task_request.column_id || UNASSIGNED_COLUMN_ID;
            const tasks: GroupedTasks[] = cloneDeep(groupedTasks);
            const columnExistingItems: ITask[] =
                tasks?.find((g) => g.columnId === columnId)?.items || [];
            const lastPosition =
                sortByPosition(columnExistingItems)[columnExistingItems.length]
                    ?.position || 0;
            const updatedTasksList = [
                ...columnExistingItems,
                {...created, position: lastPosition + 1},
            ];

            updateGroupedTasks((prev) =>
                prev.map((g: GroupedTasks) =>
                    g.columnId === columnId
                        ? {
                            ...g,
                            items: updatedTasksList,
                        }
                        : g
                )
            );
            setNewTaskData(null);
            const toast: IToast = createToast(
                "Task created successfully.",
                "success"
            );
            addNotification(toast);
        });
    };

    const saveTaskData = async (task: ITask): Promise<void> => {
        return await TaskService.updateTask(task, boardId).then(() => {
            setNewTaskData(null);
            const toast: IToast = createToast(
                "Task updated successfully.",
                "success"
            );
            addNotification(toast);
        });
    };

    const deleteTask = async (
        taskId: ITask["id"],
        colId?: IBoardColumn["id"]
    ) => {
        await TaskService.deleteTask(taskId, boardId)
            .then(() => {
                return Promise.all(
                    groupedTasks.map(async (grouped) => {
                        if (grouped.columnId === colId) {
                            const elemIndex = grouped.items.findIndex((t) => t.id === taskId);
                            // checking if element exists and its not the last in the list
                            const nextElem =
                                grouped?.items.length > 1 ? grouped.items[elemIndex + 1] : null;
                            const nextElemUpdated: ITask = {
                                ...nextElem,
                                above_task_id:
                                    elemIndex === 0 ? null : grouped.items[elemIndex - 1]?.id,
                                position: nextElem?.position
                                    ? nextElem?.position - 1
                                    : groupedTasks.length - 1,
                            };
                            if (nextElem) {
                                const nextElemUpdatedNoPosition: ITask =
                                    cloneDeep(nextElemUpdated);
                                delete nextElemUpdatedNoPosition.position;
                                await TaskService.updateTask(
                                    nextElemUpdatedNoPosition,
                                    boardId
                                );
                            }
                            const updatedTasks = grouped.items
                                ?.map((t) => (t.id === nextElem?.id ? nextElemUpdated : t))
                                ?.filter((t) => t.id !== taskId);
                            updateGroupedTasks((prev) =>
                                prev?.map((elem) =>
                                    elem.columnId === colId
                                        ? {...elem, elems: updatedTasks}
                                        : elem
                                )
                            );
                            const toast: IToast = createToast(
                                "The requested task was deleted.",
                                "success"
                            );
                            addNotification(toast);
                        }
                        return Promise.resolve();
                    })
                );
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
        saveNewTask,
        deleteTask,
        saveTaskData,
    };
};
