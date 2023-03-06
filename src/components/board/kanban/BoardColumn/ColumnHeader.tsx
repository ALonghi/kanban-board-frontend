import { PlusIcon } from "@heroicons/react/24/outline";
import { ChangeEvent } from "react";

import { IBoardColumn } from "../../../../model/board";
import { getEmptyTask, ITask } from "../../../../model/task";
import SaveIcon from "../../../shared/SaveIcon";

type ColumnHeaderProps = {
  column?: IBoardColumn;
  isTyping: boolean;
  updateColumnName: (e: ChangeEvent<HTMLInputElement>) => void;
  saveColumn: () => Promise<void>;
  overriddenName?: string;
  setNewTaskData: (task: Omit<ITask, "id" | "created_at" | "position">) => void;
  boardId: string;
};

export default function ColumnHeader({
  column,
  isTyping,
  updateColumnName,
  saveColumn,
  overriddenName,
  setNewTaskData,
  boardId,
}: ColumnHeaderProps) {
  return (
    <>
      <div
        className={` mb-4 letter-spacing-2 py-2 px-4 flex flex-col
              bg-gray-100 rounded-t-md w-full`}
      >
        {(column?.name && !isTyping) || overriddenName ? (
          <p
            className={`w-fit font-bold text-gray-700 ${
              overriddenName ? `` : `uppercase`
            } text-sm h-full`}
          >
            {column?.name ||
              (overriddenName ? overriddenName : "Create new column")}
          </p>
        ) : (
          <div className="flex w-full justify-between items-center">
            <input
              className={`bg-inherit font-bold text-gray-700 text-sm w-full 
                            outline-0 h-full
                            `}
              onKeyDown={(e) => (e.key === "Enter" ? saveColumn() : null)}
              onChange={updateColumnName}
              value={column?.name || ""}
              placeholder="Create new column.."
            />
            {isTyping && <SaveIcon saveAction={saveColumn} />}
          </div>
        )}
      </div>
      <div
        className={`bg-gray-100 hover:bg-gray-200 py-0.5 px-4 mb-2 rounded-md w-full cursor-pointer`}
        onClick={() => setNewTaskData(getEmptyTask(column?.id, boardId))}
      >
        <PlusIcon className={`text-gray-500 w-5 mx-auto`} />
      </div>
    </>
  );
}
