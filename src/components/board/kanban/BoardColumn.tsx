import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { IBoardColumn, IBoard } from "../../../model/board";
import { ITask } from "../../../model/task";
import BoardService from "../../../service/boardService";
import { SortableTask } from "./SortableTask";

type TaskColumnProps = {
  column?: IBoardColumn;
  tasks: ITask[];
  updateTasks: (tasks: ITask[]) => void;
  updateBoardColumn: (column: IBoardColumn) => Promise<void>;
  overriddenName?: string
};

export default function TaskColumn({
  column,
  overriddenName,
  tasks,
  updateTasks,
  updateBoardColumn,
}: TaskColumnProps) {
  const [currentColumn, setCurrentColumn] = useState<IBoardColumn | null>(
    column || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: { x: 100, y: 50 },
      },
    }),
    useSensor(TouchSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((i) => i.id === active?.id);
      const newIndex = tasks.findIndex((i) => i.id === over?.id);
      updateTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  }

  const saveColumn = async () => {
    await updateBoardColumn(currentColumn).then(() => {
      setIsTyping(false);
      setCurrentColumn(null);
    });
  };

  const updateColumnName = (e) => {
    setIsTyping(true);
    setCurrentColumn((prev) => ({ ...prev, name: e.target.value }));
  };

  return (
    <>
      <div
        className={`flex flex-col tasks-center justify-center mx-4 h-[80vh] sm:w-64`}
      >
        <div
          className={` mb-4 letter-spacing-2 py-1 px-4 flex flex-col
             tasks-center justify-center bg-gray-100 rounded-t-md`}
        >
          {(currentColumn?.name && !isTyping) || overriddenName ? (
            <p className={`w-fit font-bold text-gray-700 ${overriddenName ? `` : `uppercase`} text-sm `}>
              {currentColumn?.name || (
                overriddenName ? overriddenName : "Create new column"
              )
              }
            </p>
          ) : (
            <div className="flex w-full justify-between items-center">
              <input
                className={`bg-inherit font-bold text-gray-700 text-sm w-full 
                            outline-0
                            `}
                onKeyDown={(e) => (e.key === "Enter" ? saveColumn() : null)}
                onChange={updateColumnName}
                value={currentColumn?.name || ""}
                placeholder="Create new column.."
              />
              {isTyping && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer hover:stroke-theme-500"
                  onClick={saveColumn}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
        <div
          className={`bg-gray-100 hover:bg-gray-200 py-0.5 px-4 mb-2 rounded-md w-full cursor-pointer`}
        >
          <PlusIcon className={`text-gray-500 w-5 mx-auto`} />
        </div>

        <div className={` bg-gray-100 py-4 px-4 rounded-md h-full shadow-md`}>
          <DndContext
            autoScroll={false}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {tasks?.map((task) => (
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
      </div>
    </>
  );
}
