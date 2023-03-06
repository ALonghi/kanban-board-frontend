import {
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { ITask } from "../../../../model/task";
import { createToast, IToast } from "../../../../model/toast";
import TaskService from "../../../../service/taskService";
import { addNotification } from "../../../../stores/notificationStore";
import { getColumnId, getDifference } from "../../../../utils/helpers";

export const useDraggable = (
  tasks: ITask[],
  updateTasks: (tasks: ITask[], colId: string | null) => void,
  boardId: string
) => {
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: { x: 100, y: 50 },
      },
    }),
    useSensor(TouchSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log(`drag end active ${JSON.stringify(event.active, null, 2)}`);
    setIsDragging(false);

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((i) => i.id === active?.id);
      const newIndex = tasks.findIndex((i) => i.id === over?.id);
      const reordered = arrayMove([...tasks], oldIndex, newIndex).map(
        (t, i) => ({ ...t, position: i })
      );
      updateTasks(reordered, getColumnId(reordered));

      const mapped = reordered?.map((task, i) => {
        delete task.position;
        if (i === 0) {
          delete task.above_task_id;
          return task;
        } else {
          const parent = reordered[i - 1] || null;
          return { ...task, above_task_id: parent?.id || null };
        }
      });
      const oldMapped = tasks.map((t) => {
        delete t.position;
        return t;
      });

      const toUpdate = getDifference(oldMapped, mapped);

      TaskService.updateTasks(toUpdate, boardId)
        .then(() => {
          const mappedWithPosition = mapped.map((t, i) => ({
            ...t,
            position: i,
          }));
          updateTasks(mappedWithPosition, getColumnId(mappedWithPosition));
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
    }
  }

  return {
    isDragging,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
};
