import { IBoard } from "../../../../model/board";
import GroupedTasks from "../../../../model/groupedTasks";
import { ITask } from "../../../../model/task";
import { createToast, IToast } from "../../../../model/toast";
import TaskService from "../../../../service/taskService";
import { addNotification } from "../../../../stores/notificationStore";
import { cloneDeep } from "lodash";
import {
  getDifference,
  mapAfterSwap,
  removePositionField,
} from "../../../../utils/helpers";

interface DragItem {
  droppableId: string;
  index: number;
}

export const useDraggable = (
  groupedTasks: GroupedTasks[],
  updateTasks: React.Dispatch<React.SetStateAction<GroupedTasks[]>>,
  boardId: IBoard["id"]
) => {
  function handleDragEnd(props) {
    console.log(`props ${JSON.stringify(props, null, 2)}`);
    if (!props.destination) return;

    const dragged: DragItem | null = props.source;
    const over: DragItem | null = props.destination;
    console.log(`dragged ${JSON.stringify(dragged, null, 2)}`);
    console.log(`over ${JSON.stringify(over, null, 2)}`);
    let tasks: GroupedTasks[] = cloneDeep(groupedTasks);

    if (
      over?.index === dragged?.index &&
      over?.droppableId === dragged?.droppableId
    )
      return;

    const itemMovedArray =
      tasks.find((g) => g.columnId === dragged.droppableId)?.items || [];
    const itemMoved =
      itemMovedArray?.length > 0 ? itemMovedArray[dragged.index] : null;
    console.log("ItemMoved>>> ", itemMoved);
    let draggedColumn = tasks.find((t) => t.columnId === dragged.droppableId);
    draggedColumn.items.splice(dragged.index, 1);
    draggedColumn.items = mapAfterSwap(draggedColumn.items);

    let overColumn = tasks.find((t) => t.columnId === over.droppableId);
    overColumn.items.splice(over.index, 0, itemMoved);
    overColumn.items = mapAfterSwap(overColumn.items);
    const result = tasks.map((g) =>
      g.columnId === draggedColumn.columnId
        ? draggedColumn
        : g.columnId === overColumn.columnId
        ? overColumn
        : g
    );
    console.log("Source >>>", JSON.stringify(draggedColumn.items, null, 2));
    console.log("Destination >>>", JSON.stringify(overColumn.items, null, 2));
    console.log("Result >>>", JSON.stringify(result, null, 2));
    const difference = getDifference(
      removePositionField(groupedTasks),
      removePositionField(result)
    );
    console.log(
      "removePositionField(groupedTasks) >>>",
      JSON.stringify(removePositionField(groupedTasks), null, 2)
    );
    console.log(
      "removePositionField(result) >>>",
      JSON.stringify(removePositionField(result), null, 2)
    );
    console.log("difference >>>", JSON.stringify(difference, null, 2));
    handleTasksUpdate(difference, boardId, result);
  }

  const handleTasksUpdate = (
    updated: Omit<ITask, "position">[],
    boardId: IBoard["id"],
    groupedUpdated: GroupedTasks[]
  ) =>
    TaskService.updateTasks(updated, boardId)
      .then(() => {
        console.log(
          `updating all groupedTasks:\n ${JSON.stringify(
            groupedUpdated,
            null,
            2
          )}`
        );
        updateTasks(() => groupedUpdated);
        const toast: IToast = createToast(
          "Tasks moved successfully.",
          "success"
        );
        addNotification(toast);
      })
      .catch((err) => {
        const toast: IToast = createToast(
          `Error in moving task: ${err.message}`,
          "error"
        );
        addNotification(toast);
        console.error(`Received error ${err.message || err}`);
      });

  return {
    handleDragEnd,
  };
};
