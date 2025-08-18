import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:task_tracker/models/priority.dart';
import 'package:task_tracker/models/priority_box.dart';
import 'package:task_tracker/models/task.dart';
import 'package:task_tracker/utils/app_colors.dart';

class TaskCalendarScreen extends StatefulWidget {
  final List<PriorityBox> priorityBoxes;
  
  const TaskCalendarScreen({super.key, required this.priorityBoxes});

  @override
  TaskCalendarScreenState createState() => TaskCalendarScreenState();
}

class TaskCalendarScreenState extends State<TaskCalendarScreen> {
  late DateTime _focusedDay;
  DateTime? _selectedDay;
  Map<DateTime, List<Task>> _tasksByDate = {};

  @override
  void initState() {
    super.initState();
    _focusedDay = DateTime.now();
    _selectedDay = _focusedDay;
    _groupTasksByDate();
  }

  void _groupTasksByDate() {
    final Map<DateTime, List<Task>> tasksMap = {};
    
    for (var box in widget.priorityBoxes) {
      for (var task in box.tasks) {
        if (task.dueDate != null) {
          // Normalize the date to remove time part for grouping
          final date = DateTime(
            task.dueDate!.year,
            task.dueDate!.month,
            task.dueDate!.day,
          );
          
          if (tasksMap[date] == null) {
            tasksMap[date] = [];
          }
          tasksMap[date]!.add(task);
        }
      }
    }
    
    setState(() {
      _tasksByDate = tasksMap;
    });
  }

  List<Task> _getTasksForDay(DateTime day) {
    return _tasksByDate[DateTime(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Task Calendar'),
        backgroundColor: AppColors.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Card(
            margin: const EdgeInsets.all(8.0),
            child: TableCalendar(
              firstDay: DateTime.utc(2020, 1, 1),
              lastDay: DateTime.utc(2030, 12, 31),
              focusedDay: _focusedDay,
              selectedDayPredicate: (day) {
                return isSameDay(_selectedDay, day);
              },
              onDaySelected: (selectedDay, focusedDay) {
                setState(() {
                  _selectedDay = selectedDay;
                  _focusedDay = focusedDay;
                });
              },
              calendarStyle: const CalendarStyle(
                selectedDecoration: BoxDecoration(
                  color: AppColors.primaryColor,
                  shape: BoxShape.circle,
                ),
                todayDecoration: BoxDecoration(
                  color: AppColors.primaryColor,
                  shape: BoxShape.circle,
                ),
                markerDecoration: BoxDecoration(
                  color: AppColors.primaryColor,
                  shape: BoxShape.circle,
                ),
                markersMaxCount: 1,
              ),
              headerStyle: HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
              ),
              calendarBuilders: CalendarBuilders(
                markerBuilder: (context, date, events) {
                  final tasks = _getTasksForDay(date);
                  if (tasks.isEmpty) return null;
                  
                  return Positioned(
                    bottom: 1,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: Colors.red.shade400,
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        '${tasks.length}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              _selectedDay != null
                  ? 'Tasks for ${_selectedDay!.day}/${_selectedDay!.month}/${_selectedDay!.year}'
                  : 'Select a date',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: _buildTaskList(),
          ),
        ],
      ),
    );
  }

  Widget _buildTaskList() {
    if (_selectedDay == null) {
      return const Center(child: Text('Select a date to view tasks'));
    }

    final tasks = _getTasksForDay(_selectedDay!);
    
    if (tasks.isEmpty) {
      return const Center(child: Text('No tasks for selected date'));
    }

    return ListView.builder(
      itemCount: tasks.length,
      itemBuilder: (context, index) {
        final task = tasks[index];
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          child: ListTile(
            title: Text(task.title),
            subtitle: Text(
              'Priority: ${task.priority.toString().split('.').last}',
              style: TextStyle(
                color: _getPriorityColor(task.priority),
                fontWeight: FontWeight.bold,
              ),
            ),
            trailing: Checkbox(
              value: task.isCompleted,
              onChanged: (value) {
                // Update task completion status
                setState(() {
                  task.isCompleted = value ?? false;
                });
              },
            ),
            onTap: () {
              // Navigate to task details or edit screen
              _showTaskDetails(task);
            },
          ),
        );
      },
    );
  }

  Color _getPriorityColor(Priority priority) {
    switch (priority) {
      case Priority.high:
        return Colors.red;
      case Priority.medium:
        return Colors.orange;
      case Priority.low:
        return Colors.green;
    }
  }

  void _showTaskDetails(Task task) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Task Details'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Title: ${task.title}'),
              const SizedBox(height: 8),
              Text('Priority: ${task.priority.toString().split('.').last}'),
              const SizedBox(height: 8),
              Text('Due: ${task.dueDate != null ? _formatDate(task.dueDate!) : 'No due date'}'),
              const SizedBox(height: 8),
              Text('Status: ${task.isCompleted ? 'Completed' : 'Pending'}'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy HH:mm').format(date);
  }
}
