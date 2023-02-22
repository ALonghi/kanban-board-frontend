import { useState } from "react";
import CreateBoard from "./CreateBoard";
import EmptyBoard from "./EmptyBoard";
import { PlusIcon } from "@heroicons/react/20/solid";
import BoardService from "../../service/boardService";
import BoardCard from "./BoardCard";
import { IBoard } from "../../model/board";
import { CreateBoardRequest } from "../../model/dto";

export default function BoardsOverview({ boards }) {
  const [currentBoards, setCurrentBoards] = useState<any[]>(boards || []);
  const [open, setOpen] = useState<boolean>(false);

  const addBoard = async (board: CreateBoardRequest) => {
    return await BoardService.createBoard(board).then(
      (board_response: IBoard) => {
        setCurrentBoards((prevState) => [...prevState, board_response]);
        setOpen(false);
      }
    );
  };

  return (
    <div className="sm:w-10/12 mx-auto">
      <div
        className="my-16 flex sm:w-10/12 items-center justify-between mx-auto flex-row
            sm:ml-8 sm:mx-auto"
      >
        <h1 className="w-8/12 text-3xl sm:text-4xl font-bold clip">
          Welcome to <span className="text-gradient">your Boards</span>
        </h1>
        {currentBoards?.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-theme-400
                    px-4 py-1.5 h-fit text-sm font-base text-white shadow-sm 
                    hover:bg-theme-500 focus:outline-none focus:ring-2 focus:ring-theme-700 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-2 mr-2 h-5 w-5" aria-hidden="true" />
            Create
          </button>
        )}
      </div>

      {currentBoards?.length > 0 ? (
        <ul className="w-10/12 mx-auto flex justify-start items-start flex-wrap">
          {currentBoards.map((board) => (
            <BoardCard board={board} key={board.id} />
          ))}
        </ul>
      ) : (
        <div className="mt-8 w-10/12 md:w-6/12 mx-auto">
          <EmptyBoard setOpen={setOpen} />
        </div>
      )}
      <CreateBoard
        open={open}
        setOpen={setOpen}
        addBoard={(board) => addBoard(board)}
      />
    </div>
  );
}
