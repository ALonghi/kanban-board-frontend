export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error_message?: string;
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
}

export const EMPTY_BOARD_REQ: CreateBoardRequest = {
  title: "",
};
