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
  const [boardTasks, setBoardTasks] = useState<ITask[]>(tasks || []);

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
    <div className="mx-2 my-8 min-w-full flex overflow-x-auto flex-nowrap">
      <BoardColumn
        tasks={boardTasks
          ?.filter((t) => currentBoard?.columns?.length > 0
            ? !currentBoard?.columns?.map(c => c.id)?.includes(t?.column_id)
            : true
          )
        }
        updateTasks={(list) => setBoardTasks(list)}
        updateBoardColumn={updateBoardColumn}
        overriddenName="Unassigned"
        boardId={board.id}
      />
      {currentBoard?.columns?.map((col) => (
        <BoardColumn
          key={col.id}
          column={col}
          tasks={
            boardTasks
              ?.filter((t) => t.column_id === col.id)
          }
          updateTasks={(tasks) => null}
          updateBoardColumn={updateBoardColumn}
          boardId={board.id}
        />
      ))}
      <BoardColumn
        tasks={[]}
        updateTasks={() => null}
        updateBoardColumn={updateBoardColumn}
        boardId={board.id}
      />
    </div>
  );
}
