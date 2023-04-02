import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Draggable } from "react-beautiful-dnd";

import { ITask } from "../../../model/task";
import TaskCard from "./TaskCard";

type SortableTaskProps = {
  task: ITask;
  someoneIsDragging: boolean;
  onUpdate: (updatedTask: ITask | Partial<ITask>) => Promise<void>;
  onDelete: (id: ITask["id"]) => Promise<void>;
};

export const SortableTask = ({
  task,
  someoneIsDragging,
  onUpdate,
  onDelete,
}: SortableTaskProps) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    // data: { previousColumnId: task.column_id || "-1" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    // <div
    //   ref={setNodeRef}
    //   // @ts-ignore
    //   style={style}
    //   {...attributes}
    //   {...listeners}
    //   onClick={() => {
    //     if (someoneIsDragging) {
    //       console.log("a card somewhere is being dragged still");
    //       return;
    //     }
    //     if (isDragging) {
    //       console.log("this card is being dragged still");
    //       return;
    //     }
    //   }}
    //   className={isDragging ? `opacity-60` : `opacity-100`}
    // >
    <Draggable draggableId={task.id} index={task.position}>
      {(provided) => (
        <div
          style={style}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${task.id}__items`}
        >
          <TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
      )}
    </Draggable>
  );
};
