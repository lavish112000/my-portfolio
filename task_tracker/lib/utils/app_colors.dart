// lib/utils/app_colors.dart
import 'package:flutter/material.dart';
import 'package:task_tracker/models/priority.dart';

class AppColors {
  // Main theme colors
  static const Color primaryColor = Color(0xFF4E33FF); // A vibrant purple
  static const Color accentColor = Color(0xFF00BFFF);   // A deep sky blue for accents
  static const Color backgroundColor = Color(0xFFF5F5F5); // A very light, clean grey

  // Text colors
  static const Color textPrimary = Color(0xFF333333); // Dark grey for primary text
  static const Color textSecondary = Colors.grey; // Grey for secondary text
  static const Color completedTaskColor = Colors.grey; // Grey for completed tasks

  // Priority colors
  static const Color highPriority = Colors.redAccent;
  static const Color mediumPriority = Colors.orange;
  static const Color lowPriority = Colors.blue;

  // A utility function to get the correct color based on a task's priority.
  // This is used in the TaskCard widget.
  static Color getPriorityColor(Priority priority) {
    switch (priority) {
      case Priority.high:
        return highPriority;
      case Priority.medium:
        return mediumPriority;
      case Priority.low:
        return lowPriority;
    }
  }
}