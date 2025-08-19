import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:task_tracker/models/task.dart';
import 'package:task_tracker/models/priority.dart';
import 'package:task_tracker/utils/app_colors.dart';
import 'package:flutter_animate/flutter_animate.dart';

class TaskCard extends StatefulWidget {
  final Task task;
  final VoidCallback onToggle;
  final VoidCallback onLongPress;

  const TaskCard({
    super.key,
    required this.task,
    required this.onToggle,
    required this.onLongPress,
  });

  @override
  State<TaskCard> createState() => _TaskCardState();
}

class _TaskCardState extends State<TaskCard> with SingleTickerProviderStateMixin {
  bool _isPressed = false;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  String _getPriorityText(Priority priority) {
    switch (priority) {
      case Priority.high:
        return 'High';
      case Priority.medium:
        return 'Medium';
      case Priority.low:
        return 'Low';
      default:
        return 'None';
    }
  }

  @override
  Widget build(BuildContext context) {
    final priorityColor = AppColors.getPriorityColor(widget.task.priority);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      onLongPress: widget.onLongPress,
      onTap: widget.onToggle,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        transform: Matrix4.identity()
          ..scale(_isPressed ? 0.98 : 1.0),
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
        decoration: BoxDecoration(
          color: isDark ? Colors.grey[900] : Colors.white,
          borderRadius: BorderRadius.circular(16.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(13), // 0.05 * 255 ≈ 13
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
          border: Border.all(
            color: widget.task.isCompleted 
                ? Colors.green.withOpacity(0.3) 
                : Colors.grey.withOpacity(0.2),
            width: 1.5,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              // Checkbox with animation
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: widget.task.isCompleted 
                      ? AppColors.successColor.withOpacity(0.1) 
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(8.0),
                  border: Border.all(
                    color: widget.task.isCompleted 
                        ? AppColors.successColor 
                        : Colors.grey.withOpacity(0.5),
                    width: 2.0,
                  ),
                ),
                child: widget.task.isCompleted
                    ? const Icon(
                        Icons.check,
                        size: 16,
                        color: AppColors.successColor,
                      )
                    : null,
              ),
              
              const SizedBox(width: 16.0),
              
              // Task details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Task title with priority
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            widget.task.title,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: widget.task.isCompleted
                                  ? AppColors.textTertiary
                                  : AppColors.textPrimary,
                              decoration: widget.task.isCompleted
                                  ? TextDecoration.lineThrough
                                  : null,
                              decorationThickness: 2.0,
                            ),
                          ),
                        ),
                        // Priority badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8.0,
                            vertical: 4.0,
                          ),
                          decoration: BoxDecoration(
                            color: Color.lerp(priorityColor, Colors.transparent, 0.9),
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: Text(
                            _getPriorityText(widget.task.priority),
                            style: TextStyle(
                              color: priorityColor,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                    
                    if (widget.task.dueDate != null) ...[
                      const SizedBox(height: 6.0),
                      Row(
                        children: [
                          Icon(
                            Icons.calendar_today_rounded,
                            size: 14,
                            color: AppColors.textTertiary,
                          ),
                          const SizedBox(width: 4.0),
                          Text(
                            DateFormat('MMM d, y').format(widget.task.dueDate!),
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.textTertiary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              
              // Chevron icon
              Icon(
                Icons.chevron_right_rounded,
                color: Colors.grey[400],
                size: 20,
              ),
            ],
          ),
        ),
      ).animate().fadeIn(duration: 300.ms).slideY(
        begin: 0.1,
        end: 0,
        curve: Curves.easeOutQuart,
      ),
    );
  }
}