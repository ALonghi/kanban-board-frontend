import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IBoard } from "../../../../model/board";

import { ITask } from "../../../../model/task";
import { sortByPosition } from "../../../../utils/helpers";
import { SortableTask } from "../SortableTask";
import TaskCard from "../TaskCard";
import { resetServerContext } from "react-beautiful-dnd"


resetServerContext()


type ColumnBodyProps = {
  tasks: ITask[];
  isDragging: boolean;
  saveTaskData: (updatedTask: ITask | Partial<ITask>) => Promise<void>;
  newTaskData?: Partial<ITask>;
  deleteTask: (id: ITask["id"]) => Promise<void>;
  columnId: string;
  board: IBoard;
};

export default function ColumnBody({
  tasks,
  isDragging,
  saveTaskData,
  newTaskData,
  deleteTask,
  columnId,
  board
}: ColumnBodyProps) {
  return (
    <div
      className={` bg-gray-100 py-4 px-2 rounded-md w-full h-full shadow-md`}
    >
      {/* <SortableContext items={sortByPosition(tasks)} id={columnId}> */}
      <Droppable
        droppableId={columnId || "-1"}
        >
        {(provided) => (
          <div
            ref={provided.innerRef} {...provided.droppableProps}
            className={`flex flex-col 
            ${board.columns?.find(c => c.id === columnId)?.name.toLowerCase() || "UnassignedColumn"}__wrapper`}
          >
            {sortByPosition(tasks)?.map((task) => (
               <Draggable
                 key={task.id}
                 draggableId={task.id}
                 index={task.position}
               >
                 {(providedDraggable) => (
                   <div
                     ref={providedDraggable.innerRef}
                     {...providedDraggable.draggableProps}
                     {...providedDraggable.dragHandleProps}
                     className={`${task.column_id}__items`}

                   >
                     <TaskCard task={task} onUpdate={saveTaskData} onDelete={deleteTask} />
                   </div>
                 )}
               </Draggable>
              // <SortableTask
              //   key={task.id}
              //   task={task}
              //   someoneIsDragging={isDragging}
              //   onUpdate={saveTaskData}
              //   onDelete={deleteTask}
              // />
            ))}
            {/* {newTaskData && (
              <TaskCard
                task={newTaskData}
                isNew
                isFocus
                onUpdate={(t) => saveTaskData(t)}
                onDelete={(tId) => deleteTask(tId)}
              />
            )} */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* </SortableContext> */}

    </div>
  );
}
