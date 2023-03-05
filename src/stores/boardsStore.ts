import { atom, WritableAtom } from "nanostores";
import { IBoard, IBoardColumn } from "../model/board";
import { ITask } from "../model/task";
import BoardService from "../service/boardService";
import { groupBy } from "../utils/helpers";

export const cachedBoards = atom<IBoard[]>(await BoardService.getBoards());

export function replaceBoards(boards: IBoard[]) {
  cachedBoards.set(boards);
}

export function updateBoard(board: IBoard) {
  cachedBoards.set([
    ...cachedBoards.get().filter((b) => b.id !== board.id),
    board,
  ]);
  return board;
}

export function addBoard(board: IBoard) {
  cachedBoards.set([...cachedBoards.get(), board]);
}
