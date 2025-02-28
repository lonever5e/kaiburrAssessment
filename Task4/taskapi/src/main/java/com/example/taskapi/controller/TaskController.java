package com.example.taskapi.controller;

import com.example.taskapi.model.Task;
import com.example.taskapi.model.TaskExecution;
import com.example.taskapi.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // GET /tasks or GET /tasks?id=123
    @GetMapping
    public ResponseEntity<?> getTasks(@RequestParam(required = false) String id) {
        if(id != null) {
            Optional<Task> task = taskService.getTaskById(id);
            if(task.isPresent()){
                return ResponseEntity.ok(task.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
            }
        } else {
            List<Task> tasks = taskService.getAllTasks();
            return ResponseEntity.ok(tasks);
        }
    }

    // PUT /tasks – Create or update a task
    @PutMapping
    public ResponseEntity<?> createOrUpdateTask(@RequestBody Task task) {
        try {
            Task savedTask = taskService.saveTask(task);
            return ResponseEntity.ok(savedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /tasks?id=123 – Delete a task
    @DeleteMapping
    public ResponseEntity<?> deleteTask(@RequestParam String id) {
        Optional<Task> task = taskService.getTaskById(id);
        if(task.isPresent()){
            taskService.deleteTask(id);
            return ResponseEntity.ok("Task deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
    }

    // GET /tasks/search?name=someName – Search tasks by name (partial match)
    @GetMapping("/search")
    public ResponseEntity<?> searchTasksByName(@RequestParam String name) {
        List<Task> tasks = taskService.findTasksByName(name);
        if(tasks.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tasks found");
        } else {
            return ResponseEntity.ok(tasks);
        }
    }

    // PUT /tasks/{id}/execute – Execute the command associated with a task
    @PutMapping("/{id}/execute")
    public ResponseEntity<?> executeTask(@PathVariable("id") String id) {
        try {
            TaskExecution taskExecution = taskService.executeTask(id);
            return ResponseEntity.ok(taskExecution);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
