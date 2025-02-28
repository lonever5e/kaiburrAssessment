import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import TaskList from "./pages/TaskList";
import CreateTask from "./pages/CreateTask";
import TaskDetail from "./pages/TaskDetail";
import RunResult from "./pages/RunResult";

const { Header, Content } = Layout;

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link to="/">Task List</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/create">Create Task</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "24px", minHeight: "calc(100vh - 64px)" }}>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/run/:id" element={<RunResult />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
