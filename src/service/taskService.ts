import Logger from "../utils/logging";
import { ApiResponse } from "../model/dto";
import { instance as axios } from "../utils/axios";
import { ITask } from "../model/task";

export default class TaskService {
  static createTask(task): Promise<string> {
    return Promise.resolve("");
  }

  static async getTasksByBoardId(board_id: string): Promise<ITask[]> {
    try {
      Logger.info(`Getting tasks for board ${board_id}..`);
      const response = (await axios
        .get(`/boards/${board_id}/tasks`)
        .then((res) => res.data)) as ApiResponse<ITask[]>;
      if (!response.success || !response.data)
        throw new Error(response.error_message);
      return response.data || [];
    } catch (e) {
      Logger.error(
        `Error in getting tasks for board ${board_id}: ${e.message || e}`
      );
      return Promise.reject(e);
    }
  }

  static updateTasks(tasks: []): Promise<void> {
    return Promise.resolve();
  }
}
