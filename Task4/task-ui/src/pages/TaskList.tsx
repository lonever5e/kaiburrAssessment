import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Task, getTasks, searchTasks, deleteTask, executeTask, TaskExecution } from "../services/taskService";

const { Search } = Input;

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      message.error("Failed to fetch tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onSearch = async (value: string) => {
    setLoading(true);
    try {
      if (value.trim() === "") {
        await fetchTasks();
      } else {
        const data = await searchTasks(value);
        console.log("Search results:", data);
        setTasks(data);
      }
    } catch (error) {
      console.error("Search error:", error);
      message.error("Search failed");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete clicked for task:", id);
    try {
      await deleteTask(id);
      message.success("Task deleted");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete task");
    }
  };

  // Updated: Instead of showing a modal, navigate to the RunResult page.
  const handleExecute = async (task: Task) => {
    console.log("Run button pressed for task id:", task.id);
    try {
      const execution: TaskExecution = await executeTask(task.id);
      console.log("Execution response:", execution);
      message.success("Task executed");
      // Navigate to the run result page, passing task and execution result in state.
      navigate(`/run/${task.id}`, { state: { task, execution } });
    } catch (error) {
      console.error("Execution error:", error);
      message.error("Failed to execute task");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Owner", dataIndex: "owner", key: "owner" },
    { title: "Command", dataIndex: "command", key: "command" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Task) => (
        <Space>
          <Button type="primary" onClick={() => handleExecute(record)}>
            Run
          </Button>
          <Button onClick={() => navigate(`/task/${record.id}`)}>
            View Details
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Search placeholder="Search by name" onSearch={onSearch} enterButton />
      </Space>
      <Table dataSource={tasks} columns={columns} rowKey="id" loading={loading} />
    </>
  );
};

export default TaskList;
