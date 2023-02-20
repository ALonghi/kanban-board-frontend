import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ITask } from "../../../model/task";
import TaskCard from "./TaskCard";

type SortableTaskProps = {
  task: ITask;
  someoneIsDragging: boolean;
  onUpdate: (updatedTask: ITask | Partial<ITask>) => Promise<void>;
  onDelete: (id: ITask['id']) => Promise<void>;
};

export const SortableTask = ({
  task,
  someoneIsDragging,
  onUpdate,
  onDelete
}: SortableTaskProps) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      // @ts-ignore
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (someoneIsDragging) {
          console.log("a card somewhere is being dragged still");
          return;
        }
        if (isDragging) {
          console.log("this card is being dragged still");
          return;
        }
      }}
      className={isDragging ? `opacity-60` : `opacity-100`}
    >
      <TaskCard task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
};
