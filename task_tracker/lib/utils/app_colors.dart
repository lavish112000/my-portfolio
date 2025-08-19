// lib/utils/app_colors.dart
import 'package:flutter/material.dart';
import 'package:task_tracker/models/priority.dart';

class AppColors {
  // Main theme colors
  static const Color primaryColor = Color(0xFF6C63FF); // Vibrant purple
  static const Color secondaryColor = Color(0xFF4A90E2); // Soft blue
  static const Color accentColor = Color(0xFF00D2FF); // Bright cyan
  static const Color backgroundColor = Color(0xFFF8F9FF); // Very light blue-grey
  static const Color surfaceColor = Colors.white; // Card/container color
  
  // Text colors
  static const Color textPrimary = Color(0xFF2D3748); // Dark blue-grey
  static const Color textSecondary = Color(0xFF718096); // Medium grey
  static const Color textTertiary = Color(0xFFA0AEC0); // Light grey
  static const Color textInverse = Colors.white; // White text for dark backgrounds
  
  // Status colors
  static const Color successColor = Color(0xFF48BB78); // Green
  static const Color warningColor = Color(0xFFF6AD55); // Orange
  static const Color errorColor = Color(0xFFF56565); // Red
  
  // Priority colors with better contrast
  static const Color highPriority = Color(0xFFFF3860); // Vibrant red
  static const Color mediumPriority = Color(0xFFFFA000); // Amber
  static const Color lowPriority = Color(0xFF4CAF50); // Green
  
  // Gradient colors
  static const List<Color> primaryGradient = [
    Color(0xFF6C63FF),
    Color(0xFF4A90E2),
  ];
  
  static const List<Color> successGradient = [
    Color(0xFF48BB78),
    Color(0xFF38A169),
  ];
  
  // Shadow
  static const BoxShadow cardShadow = BoxShadow(
    color: Color(0x0D000000),
    blurRadius: 10,
    offset: Offset(0, 4),
  );

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