package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByClientId(Long clientId) {
        return taskRepository.findByClientId(clientId);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        task.setStatus("OPEN"); // Ensure new tasks are always OPEN
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        // Update the task fields
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setSkills(taskDetails.getSkills());
        task.setCategory(taskDetails.getCategory());
        task.setDifficulty(taskDetails.getDifficulty());
        task.setDeadline(taskDetails.getDeadline());
        task.setTotalBudget(taskDetails.getTotalBudget());
        task.setStatus(taskDetails.getStatus());

        // Milestones would need more complex logic for updates, additions, and removals
        // For simplicity, we are not handling milestone updates here in this example

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // ---- More complex business logic would go here ----

    // Example: Assign a freelancer to a task
    public Task assignFreelancer(Long taskId, Long freelancerId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        
        // In a real app, you would also check if the freelancer exists and is available
        task.setFreelancerId(freelancerId);
        task.setStatus("IN_PROGRESS");
        
        return taskRepository.save(task);
    }
}
