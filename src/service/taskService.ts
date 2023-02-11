export default class TaskService {
    static createTask(task): Promise<string> {
        return Promise.resolve("")
    }

    static getTasksByBoardId(): Promise<[]> {
        return Promise.resolve([])
    }

    static updateTasks(tasks: []): Promise<void> {
        return Promise.resolve()
    }
}