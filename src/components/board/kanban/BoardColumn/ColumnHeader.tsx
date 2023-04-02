import {PlusIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import {IBoard, IBoardColumn} from "../../../../model/board";
import {getEmptyTask, ITask} from "../../../../model/task";
import SaveIcon from "../../../shared/SaveIcon";
import {UNASSIGNED_COLUMN_ID} from "../../../../utils/helpers";

type ColumnHeaderProps = {
    board: IBoard;
    column?: IBoardColumn;
    overriddenName?: string;
    updateBoardColumn: (column: IBoardColumn) => Promise<void>;
    setNewTaskData: (task: Omit<ITask, "id" | "created_at" | "position">) => void;
};

export default function ColumnHeader({
                                         board,
                                         column,
                                         overriddenName,
                                         updateBoardColumn,
                                         setNewTaskData,
                                     }: ColumnHeaderProps) {
    const [currentColumn, setCurrentColumn] = useState<IBoardColumn | null>(
        column || null
    );
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const saveColumn = async () => {
        await updateBoardColumn(currentColumn).then(() => {
            setIsTyping(false);
            setCurrentColumn(null);
        });
    };

    const updateColumnName = (e) => {
        setIsTyping(true);
        setCurrentColumn((prev) => ({...prev, name: e.target.value}));
    };

    return (
        <>
            <div
                className={` mb-4 letter-spacing-2 py-2 px-4 flex flex-col
              bg-gray-100 rounded-t-md w-full`}
            >
                {(currentColumn?.name && !isTyping) || overriddenName ? (
                    <p
                        className={`w-fit font-bold text-gray-700 ${
                            overriddenName ? `` : `uppercase`
                        } text-sm h-full`}
                    >
                        {currentColumn?.name ||
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
                            value={currentColumn?.name || ""}
                            placeholder="Create new column.."
                        />
                        {isTyping && <SaveIcon saveAction={saveColumn}/>}
                    </div>
                )}
            </div>
            <div
                className={`bg-gray-100 hover:bg-gray-200 py-0.5 px-4 mb-2 rounded-md w-full cursor-pointer`}
                onClick={() =>
                    setNewTaskData(
                        getEmptyTask(board.id, currentColumn?.id || UNASSIGNED_COLUMN_ID)
                    )
                }
            >
                <PlusIcon className={`text-gray-500 w-5 mx-auto`}/>
            </div>
        </>
    );
}
