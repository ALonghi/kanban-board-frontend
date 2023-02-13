import { useState } from "react";
import { IBoard, IBoardColumn } from "../../model/board";
import { ITask } from "../../model/task";
import BoardColumn from "./kanban/BoardColumn";
import BoardService from "../../service/boardService";
import Logger from "../../utils/logging";

type KanbanViewProps = {
  board: IBoard;
  tasks: ITask[];
};

export default function KanbanView({ board, tasks }: KanbanViewProps) {
  const [currentBoard, setCurrentBoard] = useState<IBoard>(board);

  const updateBoardColumn = async (col: IBoardColumn) => {
    const previousColumns =
      board?.columns?.filter((c) => c.id !== col.id) || [];
    const updatedBoard = {
      ...board,
      columns: [...previousColumns, col],
    };
    await BoardService.updateBoard(updatedBoard)
      .then((response) => setCurrentBoard(response))
      .catch((err) =>
        Logger.error(
          `Error while updating board ${board.id}: ${err.message || err}`
        )
      );
  };

  return (
    <div className="mx-2 my-8 w-full flex ">
      {currentBoard?.columns?.map((col) => (
        <BoardColumn
          key={col.id}
          column={col}
          tasks={
            tasks
              ?.filter((t) => t.column_id === col.id)
              ?.sort((t) => (t.position > t.position ? 1 : -1)) || []
          }
          updateTasks={(tasks) => null}
          updateBoardColumn={updateBoardColumn}
        />
      ))}
      <BoardColumn
        tasks={[]}
        updateTasks={() => null}
        updateBoardColumn={updateBoardColumn}
      />
    </div>
  );
}
