import { rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";

import { ITask } from "../../../../model/task";
import { sortByPosition } from "../../../../utils/helpers";
import { SortableTask } from "../SortableTask";
import TaskCard from "../TaskCard";

type ColumnBodyProps = {
  tasks: ITask[];
  isDragging: boolean;
  saveTaskData: (updatedTask: ITask | Partial<ITask>) => Promise<void>;
  newTaskData?: Partial<ITask>;
  deleteTask: (id: ITask["id"]) => Promise<void>;
  columnId: string;
};

export default function ColumnBody({
  tasks,
  isDragging,
  saveTaskData,
  newTaskData,
  deleteTask,
  columnId,
}: ColumnBodyProps) {
  return (
    <div
      className={` bg-gray-100 py-4 px-2 rounded-md w-full h-full shadow-md`}
    >
      <SortableContext items={sortByPosition(tasks)} id={columnId}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {sortByPosition(tasks)?.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              someoneIsDragging={isDragging}
              onUpdate={(t) => saveTaskData(t)}
              onDelete={(tId) => deleteTask(tId)}
            />
          ))}
          {newTaskData && (
            <TaskCard
              task={newTaskData}
              isNew
              isFocus
              onUpdate={(t) => saveTaskData(t)}
              onDelete={(tId) => deleteTask(tId)}
            />
          )}
        </div>
      </SortableContext>
    </div>
  );
}
