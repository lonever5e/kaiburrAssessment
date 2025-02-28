import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";

const CreateTask: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log("Form submitted with values:", values); // Debug log
    setLoading(true);
    try {
      await createTask(values);
      message.success("Task created successfully");
      navigate("/");
    } catch (error) {
      console.error("Error creating task:", error); // Debug error log
      message.error("Failed to create task");
    }
    setLoading(false);
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item
        name="id"
        label="ID"
        rules={[{ required: true, message: "Please input the task ID!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the task name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="owner"
        label="Owner"
        rules={[{ required: true, message: "Please input the owner!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="command"
        label="Command"
        rules={[{ required: true, message: "Please input the command!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Task
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateTask;

