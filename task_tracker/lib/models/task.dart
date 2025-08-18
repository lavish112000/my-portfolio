// lib/models/task.dart
import 'package:task_tracker/models/priority.dart';

class Task {
  final String id;
  final String title;
  final Priority priority;
  bool isCompleted;
  final String? description;
  final DateTime? dueDate;
  final String? category;

  Task({
    required this.id,
    required this.title,
    required this.priority,
    this.isCompleted = false,
    this.description,
    this.dueDate,
    this.category,
  });

  Task copyWith({
    String? id,
    String? title,
    Priority? priority,
    bool? isCompleted,
    String? description,
    DateTime? dueDate,
    String? category,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      priority: priority ?? this.priority,
      isCompleted: isCompleted ?? this.isCompleted,
      description: description ?? this.description,
      dueDate: dueDate ?? this.dueDate,
      category: category ?? this.category,
    );
  }
}