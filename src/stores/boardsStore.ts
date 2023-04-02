import { atom } from "nanostores";
import { IBoard } from "../model/board";
import BoardService from "../service/boardService";

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
