// lib/models/priority_box.dart
import 'package:flutter/material.dart';
import 'package:task_tracker/models/task.dart';

class PriorityBox {
  final String id;
  String name;
  Color color;
  final List<Task> tasks;

  PriorityBox({
    required this.id,
    required this.name,
    required this.color,
    required this.tasks,
  });
}
