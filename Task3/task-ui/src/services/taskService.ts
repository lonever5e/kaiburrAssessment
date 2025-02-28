import axios from "axios";

// Use a relative URL; proxy is handling redirection.
const API_BASE_URL = "";

export interface TaskExecution {
  startTime: string;
  endTime: string;
  output: string;
}

export interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
  taskExecutions: TaskExecution[];
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  return response.data;
};

export const searchTasks = async (name: string): Promise<Task[]> => {
  const response = await axios.get(`${API_BASE_URL}/tasks/search?name=${name}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, "taskExecutions">): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tasks`, task);
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/tasks?id=${id}`);
};

export const executeTask = async (id: string): Promise<TaskExecution> => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${id}/execute`);
  return response.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await axios.get(`/tasks?id=${id}`);
  return response.data;
};

