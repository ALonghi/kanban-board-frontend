import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

import Task from "./Task";
import {TaskModel} from "@/model/task";

type SortableTaskProps = {
    task: TaskModel,
    someoneIsDragging: boolean
}

export const SortableTask = ({task, someoneIsDragging}: SortableTaskProps) => {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: task.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
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
            <Task task={task}/>
        </div>
    );
};
