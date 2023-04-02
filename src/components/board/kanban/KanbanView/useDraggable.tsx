
import { IBoard, IBoardColumn } from '../../../../model/board';
import GroupedTasks from "../../../../model/groupedTasks";
import { ITask } from "../../../../model/task";
import { createToast, IToast } from "../../../../model/toast";
import TaskService from "../../../../service/taskService";
import { addNotification } from "../../../../stores/notificationStore";
import { getDifference, getOldMapped, getUpdatedMapped, swap, UNASSIGNED_COLUMN_ID } from '../../../../utils/helpers';

interface DragItem {
  draggableId: string,
  index: number
}

export const useDraggable = (
  groupedTasks: GroupedTasks[],
  updateTasks: (tasks: ITask[], colId: string | null) => void,
  boardId: string
) => {
  function handleDragEnd(props) {
    if (!props.destination) return

    const dragged: DragItem | null = props.source
    const over: DragItem | null = props.destination
    console.log(`dragged ${JSON.stringify(dragged, null, 2)}`);
    console.log(`over ${JSON.stringify(over, null, 2)}`);

    if (over && dragged?.index !== over.index) {
      // retrieving tasks from their index and column
      let draggedItem;
      let overItem;
      const hasColumn = !!dragged.draggableId && dragged.draggableId !== UNASSIGNED_COLUMN_ID
      console.log(`hasColumn ${hasColumn}`);
      const sourceColumnTasks = groupedTasks
        ?.filter(g => hasColumn
          ? g.columnId === dragged.draggableId
          : !!!g.columnId || g.columnId === UNASSIGNED_COLUMN_ID)
        ?.flatMap(e => e.elems) || []
      console.log(`sourceColumnTasks ${JSON.stringify(sourceColumnTasks, null, 2)}`);
      draggedItem = sourceColumnTasks.find(t => t.position === dragged.index)
      overItem = sourceColumnTasks.find(t => t.position === over.index)
      console.log(`draggedItem ${JSON.stringify(draggedItem, null, 2)}`);
      console.log(`overItem ${JSON.stringify(overItem, null, 2)}`);

      // logic if swapped tasks are within same column
      if (dragged?.draggableId === over?.draggableId) {
        // remapping array with swapped tasks through their index
        const reordered: ITask[] = swap(sourceColumnTasks, draggedItem, overItem).map((t, i) => ({ ...t, position: i }))
        console.log(`reordered:\n ${JSON.stringify(reordered, null, 2)}`)

        const newMapped: Omit<ITask, "position">[] = getUpdatedMapped(reordered)
        console.log(`newMapped:\n ${JSON.stringify(newMapped, null, 2)}`)
        const oldMapped: Omit<ITask, "position">[] = getOldMapped(sourceColumnTasks)
        console.log(`oldMapped:\n ${JSON.stringify(oldMapped, null, 2)}`)
        const difference = getDifference(oldMapped, newMapped)
        // removing position forced by UI as it does not get saved in backend
        handleTasksUpdate(difference, boardId, reordered, dragged?.draggableId)
      }

      // ? tasks.filter(t => t.column_id === )
      // const newIndex = tasks.findIndex((i) => i.id === over?.id);
      // const reordered = arrayMove([...tasks], oldIndex, newIndex).map(
      //   (t, i) => ({ ...t, position: i })
      // );

      // const mapped = reordered?.map((task, i) => {
      //   delete task.position;
      //   if (i === 0) {
      //     delete task.above_task_id;
      //     return task;
      //   } else {
      //     const parent = reordered[i - 1] || null;
      //     return { ...task, above_task_id: parent?.id || null };
      //   }
      // });
      // const oldMapped = tasks.map((t) => {
      //   delete t.position;
      //   return t;
      // });

      // const toUpdate = getDifference(oldMapped, mapped);

      // todo bring back to usage
      //handleTasksUpdate(toUpdate, boardId, mapped)
    }
  }

  const handleTasksUpdate = (
    updated: Omit<ITask, "position">[],
    boardId: IBoard["id"],
    allMapped: ITask[],
    columnId: IBoardColumn["id"]
  ) =>
    TaskService.updateTasks(updated, boardId)
      .then(() => {
        console.log(`allMapped:\n ${JSON.stringify(allMapped, null, 2)}`)
        updateTasks(allMapped, columnId);
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
