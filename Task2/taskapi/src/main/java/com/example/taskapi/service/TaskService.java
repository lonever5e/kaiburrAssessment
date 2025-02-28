package com.example.taskapi.service;

import com.example.taskapi.model.Task;
import com.example.taskapi.model.TaskExecution;
import com.example.taskapi.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.util.Config;
import io.kubernetes.client.openapi.models.*;

import java.util.Arrays;
import java.util.Collections;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;


    public TaskExecution executeTask(String taskId) throws Exception {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (!optionalTask.isPresent()) {
            throw new Exception("Task not found");
        }
        Task task = optionalTask.get();

        // Initialize Kubernetes client (uses default kubeconfig, e.g., from Minikube)
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);
        CoreV1Api api = new CoreV1Api();

        // Create a unique pod name
        String podName = "execution-pod-" + taskId + "-" + System.currentTimeMillis();
        V1Pod pod = new V1Pod()
            .metadata(new V1ObjectMeta().name(podName))
            .spec(new V1PodSpec()
                .restartPolicy("Never")
                .containers(Collections.singletonList(
                    new V1Container()
                        .name("executor")
                        .image("busybox")
                        .command(Arrays.asList("sh", "-c", task.getCommand()))
                ))
            );

        // Record start time
        Date start = new Date();

        // Create the pod in the default namespace.
        // Note: The method createNamespacedPod requires 6 parameters: namespace, pod, pretty, dryRun, fieldManager, fieldValidation.
        V1Pod createdPod = api.createNamespacedPod("default", pod, null, null, null, null);

        // Wait for the pod to complete (poll every 2 seconds)
        V1PodStatus status = null;
        while (true) {
            V1Pod currentPod = api.readNamespacedPod(podName, "default", null);
            status = currentPod.getStatus();
            if (status != null && "Succeeded".equals(status.getPhase())) {
                break;
            } else if (status != null && "Failed".equals(status.getPhase())) {
                throw new Exception("Pod execution failed");
            }
            Thread.sleep(2000);
        }

        // Retrieve logs from the pod.
        // The method readNamespacedPodLog requires 11 parameters:
        // (name, namespace, container, follow, pretty, tailLines, sinceTime, timestamps, limitBytes, timeoutSeconds, insecureSkipTLSVerify)
        String logs = api.readNamespacedPodLog(podName, "default", null, null, null, null, null, null, null, null, null);

        // Record end time
        Date end = new Date();

        // Clean up the pod (optional)
        api.deleteNamespacedPod(podName, "default", null, null, null, null, null, null);

        // Create a TaskExecution object with the details
        TaskExecution execution = new TaskExecution();
        execution.setStartTime(start);  // Now passing Date instead of String
        execution.setEndTime(end);
        execution.setOutput(logs);

        // Save execution details into the task and persist
        task.addTaskExecution(execution);
        taskRepository.save(task);

        return execution;
    }

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
