import db from "../database";
import { Task, TaskRepository } from "./TaskRepository";

type TaskRow = {
    id: number;
    title: string;
    done: number;
};

function mapTaskRow(task: TaskRow): Task {
    return {
        id: task.id,
        title: task.title,
        done: task.done === 1,
    };
}

export class SQLiteRepository implements TaskRepository {
    async findAll(): Promise<Task[]> {
        const rows = db.prepare("SELECT * FROM tasks;").all() as TaskRow[];
        return rows.map(mapTaskRow);
    }

    async findById(id: number): Promise<Task | null> {
        const row = db
            .prepare("SELECT * FROM tasks WHERE id = ?;")
            .get(id) as TaskRow | undefined;
        return row ? mapTaskRow(row) : null;
    }

    async create(title: string): Promise<Task> {
        const insertTask = db.prepare(
            "INSERT INTO tasks (title, done) VALUES (?, ?);"
        );
        const result = insertTask.run(title, 0);
        return {
            id: Number(result.lastInsertRowid),
            title,
            done: false,
        };
    }

    async update(
        id: number,
        data: { title?: string; done?: boolean }
    ): Promise<Task | null> {
        const existing = db
            .prepare("SELECT * FROM tasks WHERE id = ?;")
            .get(id) as TaskRow | undefined;

        if (!existing) {
            return null;
        }

        const updatedTitle = data.title !== undefined ? data.title : existing.title;
        const updatedDone =
            data.done !== undefined ? (data.done ? 1 : 0) : existing.done;

        db.prepare(
            "UPDATE tasks SET title = ?, done = ? WHERE id = ?;"
        ).run(updatedTitle, updatedDone, id);

        return {
            id: existing.id,
            title: updatedTitle,
            done: updatedDone === 1,
        };
    }

    async delete(id: number): Promise<boolean> {
        const result = db.prepare("DELETE FROM tasks WHERE id = ?;").run(id);
        return result.changes > 0;
    }
}
