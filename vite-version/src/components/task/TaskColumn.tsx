import {Column, TaskModel} from "@/model/task";
import React, {useState} from "react";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";

import {SortableTask} from "./SortableTask";

const t = [
    {
        id: "1",
        title: "Task 1",
        column: "To Do",
        color: "red-500"
    },
    {
        id: "2",
        title: "Task 2",
        column: "To Do",
        color: "red-500"
    },
    {
        id: "3",
        title: "Task 3",
        column: "To Do",
        color: "red-500"
    },
]

export default function TaskColumn({column}: { column: Column }) {
    const [items, setItems] = useState<TaskModel[]>(t);
    const [isDragging, setIsDragging] = useState(false);

    const sensors = useSensors(useSensor(MouseSensor,{
        activationConstraint: {
            delay: 100,
            tolerance: {x: 100, y: 50}
        },
    }), useSensor(TouchSensor));

    function handleDragStart(event: DragStartEvent) {
        setIsDragging(true);
    }

    function handleDragEnd(event: DragEndEvent) {
        setIsDragging(false);

        const {active, over} = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(i => i.id === active?.id);
                const newIndex = items.findIndex(i => i.id === over?.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className={`flex flex-col items-center justify-start mx-3 h-[80vh] 
        bg-gray-100 px-3 py-3 rounded-xl `}>

            <DndContext
                autoScroll={false}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        {items.map((task) => (
                            <SortableTask
                                key={task.id}
                                task={task}
                                someoneIsDragging={isDragging}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
        // <div className={`flex flex-col items-center justify-center mx-4 h-[80vh]`}>
        //     <div className={` mb-4 letter-spacing-2 py-1 px-4 flex flex-col
        //     items-center justify-center bg-sky-300 rounded-full`}>
        //         <p className={`font-bold text-gray-700 uppercase text-sm`}>{column}</p>
        //     </div>
        //     <div className={`bg-gray-100 hover:bg-gray-200 py-0.5 px-4 mb-2 rounded-md w-full cursor-pointer`}>
        //         <PlusIcon className={`text-gray-500 w-5 mx-auto`}/>
        //     </div>
        //     <div className={` bg-gray-100 py-6 px-4 rounded-md h-full`}>
        //         {ColumnTasks}
        //     </div>
        // </div>
    );
}


