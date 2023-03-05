import { cloneDeep } from "lodash";
import { useState } from "react";
import { IBoard, IBoardColumn } from "../../../model/board";
import { ITask } from "../../../model/task";
import BoardService from "../../../service/boardService";
import { updateBoard } from "../../../stores/boardsStore";
import { groupBy } from "../../../utils/helpers";
import Logger from "../../../utils/logging";
import BoardColumn from "./BoardColumn";

type KanbanViewProps = {
  board: IBoard;
  tasks: ITask[];
};

export default function KanbanView({ board, tasks }: KanbanViewProps) {
  const [updatedTasksGrouped, setUpdatedTasksGrouped] = useState<
    Map<IBoardColumn["id"], ITask[]>
  >(groupBy(tasks, (t) => t.column_id));

  const updateBoardColumn = async (col: IBoardColumn) => {
    const previousColumns =
      board?.columns?.filter((c) => c.id !== col.id) || [];
    const updatedBoard = {
      ...board,
      columns: [...previousColumns, col],
    };
    await BoardService.updateBoard(updatedBoard)
      .then((response) => updateBoard(response))
      .catch((err) =>
        Logger.error(
          `Error while updating board ${board.id}: ${err.message || err}`
        )
      );
  };

  const updateTasksForColumn = (tasks: ITask[], colId: IBoardColumn["id"]) => {
    const toUpdate = cloneDeep(updatedTasksGrouped);
    toUpdate.set(colId, tasks);
    setUpdatedTasksGrouped((prev) => {
      const copy = cloneDeep(prev);
      copy.set(colId, toUpdate.get(colId));
      return copy;
    });
  };

  return (
    <div
      className="mx-2 my-8 min-w-full flex flex-1 items-stretch
    gap-x-2 overflow-x-scroll flex-nowrap w-fit"
    >
      <BoardColumn
        tasks={updatedTasksGrouped.get(null) || []}
        updateTasks={(list) => updateTasksForColumn(list, null)}
        updateBoardColumn={updateBoardColumn}
        overriddenName="Unassigned"
        boardId={board.id}
      />
      {board?.columns?.map((col) => (
        <BoardColumn
          key={col.id}
          column={col}
          tasks={updatedTasksGrouped.get(col.id) || []}
          updateTasks={(list) => updateTasksForColumn(list, col.id)}
          updateBoardColumn={updateBoardColumn}
          boardId={board.id}
        />
      ))}
      <BoardColumn
        tasks={[]}
        updateTasks={(list) => null}
        updateBoardColumn={updateBoardColumn}
        boardId={board.id}
      />
    </div>
  );
}
