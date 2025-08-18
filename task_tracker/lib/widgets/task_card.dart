import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:task_tracker/models/task.dart';
import 'package:task_tracker/utils/app_colors.dart';

class TaskCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      elevation: 2.0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        onLongPress: onLongPress,
        leading: Checkbox(
          value: task.isCompleted,
          onChanged: (bool? value) {
            onToggle();
          },
          activeColor: AppColors.accentColor,
        ),
        title: Text(
          task.title,
          style: TextStyle(
            color: task.isCompleted
                ? AppColors.completedTaskColor
                : AppColors.textPrimary,
            decoration: task.isCompleted
                ? TextDecoration.lineThrough
                : TextDecoration.none,
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: task.dueDate != null
            ? Text(
                'Due: ${DateFormat.yMMMd().format(task.dueDate!)}',
                style: TextStyle(
                  color: task.isCompleted
                      ? AppColors.completedTaskColor
                      : AppColors.textSecondary,
                  fontSize: 12,
                ),
              )
            : null,
        trailing: Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: AppColors.getPriorityColor(task.priority),
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }
}