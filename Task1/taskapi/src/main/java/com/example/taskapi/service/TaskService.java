package com.example.taskapi.service;

import com.example.taskapi.model.Task;
import com.example.taskapi.model.TaskExecution;
import com.example.taskapi.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public Task saveTask(Task task) {
        // Validate the command for safety
        if (!isValidCommand(task.getCommand())) {
            throw new IllegalArgumentException("Invalid or unsafe command");
        }
        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public List<Task> findTasksByName(String name) {
        return taskRepository.findByNameContaining(name);
    }

    public TaskExecution executeTask(String taskId) throws Exception {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (!optionalTask.isPresent()) {
            throw new Exception("Task not found");
        }
        Task task = optionalTask.get();

        // Validate command safety again
        if (!isValidCommand(task.getCommand())) {
            throw new IllegalArgumentException("Invalid or unsafe command");
        }

        TaskExecution taskExecution = new TaskExecution();
        Date start = new Date();
        taskExecution.setStartTime(start);

        // Execute command using ProcessBuilder (note: for production, consider security implications)
        ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", task.getCommand());
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        process.waitFor();

        Date end = new Date();
        taskExecution.setEndTime(end);
        taskExecution.setOutput(output.toString());

        // Save execution details into the task
        task.addTaskExecution(taskExecution);
        taskRepository.save(task);

        return taskExecution;
    }

    // Basic validation method – adjust this whitelist/logic as needed
    private boolean isValidCommand(String command) {
        if (command == null) return false;
        String lowerCaseCommand = command.toLowerCase();
        if(lowerCaseCommand.contains("rm") || lowerCaseCommand.contains("sudo") || lowerCaseCommand.contains("shutdown")){
            return false;
        }
        // Further restrict commands as needed (e.g., allow only "echo")
        return true;
    }
}
