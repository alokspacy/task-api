import pool from "../database/postgres";
import { Task, TaskRepository } from "./TaskRepository";

type PostgresTaskRow = {
    id: number;
    title: string;
    done: boolean;
};

export class PostgresRepository implements TaskRepository {
    async findAll(): Promise<Task[]> {
        const result = await pool.query<PostgresTaskRow>(
            "SELECT id, title, done FROM tasks ORDER BY id ASC;"
        );
        return result.rows;
    }

    async findById(id: number): Promise<Task | null> {
        const result = await pool.query<PostgresTaskRow>(
            "SELECT id, title, done FROM tasks WHERE id = $1;",
            [id]
        );
        return result.rows[0] || null;
    }

    async create(title: string): Promise<Task> {
        const result = await pool.query<PostgresTaskRow>(
            "INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id, title, done;",
            [title, false]
        );
        return result.rows[0];
    }

    async update(
        id: number,
        data: { title?: string; done?: boolean }
    ): Promise<Task | null> {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }

        const updatedTitle = data.title !== undefined ? data.title : existing.title;
        const updatedDone = data.done !== undefined ? data.done : existing.done;

        const result = await pool.query<PostgresTaskRow>(
            "UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING id, title, done;",
            [updatedTitle, updatedDone, id]
        );

        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM tasks WHERE id = $1;", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
