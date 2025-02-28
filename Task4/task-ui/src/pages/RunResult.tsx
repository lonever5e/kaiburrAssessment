import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Typography, Button } from "antd";

const { Title, Text } = Typography;

// Define the type for the navigation state
interface ExecutionState {
  task: {
    id: string;
    name: string;
    owner: string;
    command: string;
    taskExecutions: any[];
  };
  execution: {
    startTime: string;
    endTime: string;
    output: string;
  };
}

const RunResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ExecutionState | undefined;

  if (!state) {
    return (
      <Card>
        <Title level={4}>No execution result available</Title>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Card>
    );
  }

  const { task, execution } = state;

  return (
    <Card title="Task Run Result" extra={<Button onClick={() => navigate(-1)}>Back</Button>}>
      <Title level={4}>Task Information</Title>
      <Text strong>ID:</Text> <Text>{task.id}</Text><br />
      <Text strong>Name:</Text> <Text>{task.name}</Text><br />
      <Text strong>Owner:</Text> <Text>{task.owner}</Text><br />
      <Text strong>Command:</Text> <Text>{task.command}</Text><br /><br />
      <Title level={4}>Execution Details</Title>
      <Text strong>Start Time:</Text> <Text>{execution.startTime}</Text><br />
      <Text strong>End Time:</Text> <Text>{execution.endTime}</Text><br />
      <Text strong>Output:</Text>
      <pre style={{ whiteSpace: "pre-wrap" }}>{execution.output}</pre>
    </Card>
  );
};

export default RunResult;
