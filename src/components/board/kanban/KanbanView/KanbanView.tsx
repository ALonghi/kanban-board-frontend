import { closestCenter, DndContext, useDroppable } from "@dnd-kit/core";
import { IBoard } from "../../../../model/board";
import { ITask } from "../../../../model/task";
import BoardColumn from "../BoardColumn/BoardColumn";
import { useDraggable } from "./useDraggable";
import { useKanbanData } from "./useKanbanData";

type KanbanViewProps = {
  board: IBoard;
  tasks: ITask[];
};

export default function KanbanView({ board, tasks }: KanbanViewProps) {
  const {
    currentBoard,
    currentTasks,
    updatedTasksGrouped,
    updateTasksForColumn,
    updateBoardColumn,
  } = useKanbanData(board, tasks);

  const { isDragging, sensors, handleDragStart, handleDragEnd } = useDraggable(
    currentTasks,
    updateTasksForColumn,
    currentBoard.id
  );

  console.log(
    `updatedTasksGrouped.get(null) ${JSON.stringify(
      updatedTasksGrouped.get(null),
      null
    )}`
  );

  return (
    <div
      className="mx-2 my-8 min-w-full flex flex-1 items-stretch
    gap-x-2 overflow-x-scroll flex-nowrap w-fit"
    >
      <DndContext
        autoScroll={false}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <BoardColumn
          tasks={updatedTasksGrouped.get(null) || []}
          updateTasks={(list) => updateTasksForColumn(list, null)}
          updateBoardColumn={updateBoardColumn}
          overriddenName="Unassigned"
          boardId={currentBoard.id}
          isDragging={isDragging}
        />
        {currentBoard?.columns?.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={updatedTasksGrouped.get(col.id) || []}
            updateTasks={(list) => updateTasksForColumn(list, col.id)}
            updateBoardColumn={updateBoardColumn}
            boardId={currentBoard.id}
            isDragging={isDragging}
          />
        ))}
        <BoardColumn
          tasks={[]}
          updateTasks={(list) => null}
          updateBoardColumn={updateBoardColumn}
          boardId={currentBoard.id}
          isDragging={isDragging}
        />
      </DndContext>
    </div>
  );
}
