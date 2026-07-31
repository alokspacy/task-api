export interface Task {
    id: number;
    title: string;
    done: boolean;
}

export interface TaskRepository {
    findAll(): Promise<Task[]>;
    findById(id: number): Promise<Task | null>;
    create(title: string): Promise<Task>;
    update(id: number, data: { title?: string; done?: boolean }): Promise<Task | null>;
    delete(id: number): Promise<boolean>;
}
