import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, List, Typography, Button, message } from "antd";
import { getTaskById, Task } from "../services/taskService";

const { Title, Text } = Typography;

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTask = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getTaskById(id);
      setTask(data);
    } catch (error) {
      console.error("Error fetching task:", error);
      message.error("Failed to fetch task details");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  if (loading || !task) {
    return <div>Loading...</div>;
  }

  return (
    <Card title="Task Details" extra={<Button onClick={() => navigate(-1)}>Back</Button>}>
      <Title level={4}>Task Information</Title>
      <Text strong>ID: </Text><Text>{task.id}</Text><br />
      <Text strong>Name: </Text><Text>{task.name}</Text><br />
      <Text strong>Owner: </Text><Text>{task.owner}</Text><br />
      <Text strong>Command: </Text><Text>{task.command}</Text><br />
      <br />
      <Title level={4}>Task Executions</Title>
      {task.taskExecutions && task.taskExecutions.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={task.taskExecutions}
          renderItem={(execution, index) => (
            <List.Item key={index}>
              <Text strong>Start Time: </Text>
              <Text>{execution.startTime}</Text><br />
              <Text strong>End Time: </Text>
              <Text>{execution.endTime}</Text><br />
              <Text strong>Output:</Text>
              <pre style={{ whiteSpace: "pre-wrap" }}>{execution.output}</pre>
            </List.Item>
          )}
        />
      ) : (
        <Text>No executions available for this task.</Text>
      )}
    </Card>
  );
};

export default TaskDetail;
