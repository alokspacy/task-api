import { SQLiteRepository } from "./SQLiteRepository";
import { TaskRepository } from "./TaskRepository";

export * from "./TaskRepository";
export * from "./SQLiteRepository";
export * from "./PostgresRepository";

export const taskRepository: TaskRepository = new SQLiteRepository();
