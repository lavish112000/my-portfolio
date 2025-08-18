import 'package:task_tracker/models/task.dart';
import 'package:task_tracker/models/priority.dart'; // Ensure Priority is imported

class TaskService {
  // This will eventually interact with a database. For now, it's just a placeholder.

  Future<List<Task>> getTasks() async {
    // Dummy data for now. Will be replaced by database fetch.
    return [
      // Example task with priority
      Task(
        id: 'svc_001',
        title: 'Service Layer Task 1',
        description: 'This task comes from the (future) service layer.',
        dueDate: DateTime.now().add(const Duration(days: 10)),
        isCompleted: false,
        category: 'Service',
        priority: Priority.high,
      ),
    ];
  }

  Future<void> addTask(Task task) async {
    // Will save task to database
  }

  Future<void> updateTask(Task task) async {
    // Will update task in database
  }

  Future<void> deleteTask(String id) async {
    // Will delete task from database
  }
}