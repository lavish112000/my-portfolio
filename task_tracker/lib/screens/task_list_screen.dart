import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:task_tracker/models/priority.dart';
import 'package:task_tracker/models/priority_box.dart';
import 'package:task_tracker/models/task.dart';
import 'package:task_tracker/widgets/task_card.dart';

class TaskListScreen extends StatefulWidget {
  final PriorityBox box;
  final VoidCallback onBack;

  const TaskListScreen({super.key, required this.box, required this.onBack});

  @override
  State<TaskListScreen> createState() => _TaskListScreenState();
}

class _TaskListScreenState extends State<TaskListScreen> {
  void _showAddOrEditTaskDialog({Task? task}) {
    final isEditing = task != null;
    final titleController = TextEditingController(text: task?.title);
    DateTime? selectedDate = task?.dueDate;
    Priority selectedPriority = task?.priority ?? Priority.medium;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: Text(isEditing ? 'Edit Task' : 'Add Task'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(labelText: 'Task Name'),
                      autofocus: true,
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            selectedDate == null
                                ? 'No due date'
                                : 'Due: ${DateFormat.yMd().format(selectedDate!)}',
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.calendar_today),
                          onPressed: () async {
                            final pickedDate = await showDatePicker(
                              context: context,
                              initialDate: selectedDate ?? DateTime.now(),
                              firstDate: DateTime(2000),
                              lastDate: DateTime(2101),
                            );
                            if (pickedDate != null) {
                              setDialogState(() {
                                selectedDate = pickedDate;
                              });
                            }
                          },
                        ),
                      ],
                    ),
                    DropdownButtonFormField<Priority>(
                      value: selectedPriority,
                      decoration: const InputDecoration(labelText: 'Priority'),
                      items: Priority.values.map((Priority priority) {
                        return DropdownMenuItem<Priority>(
                          value: priority,
                          child: Text(priority.toString().split('.').last.toUpperCase()),
                        );
                      }).toList(),
                      onChanged: (Priority? newValue) {
                        if (newValue != null) {
                          setDialogState(() {
                            selectedPriority = newValue;
                          });
                        }
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (titleController.text.isNotEmpty) {
                      setState(() {
                        if (isEditing) {
                          final updatedTask = task.copyWith(
                            title: titleController.text,
                            dueDate: selectedDate,
                            priority: selectedPriority,
                          );
                          final taskIndex = widget.box.tasks.indexOf(task);
                          if (taskIndex != -1) {
                            widget.box.tasks[taskIndex] = updatedTask;
                          }
                        } else {
                          widget.box.tasks.add(Task(
                            id: DateTime.now().toString(),
                            title: titleController.text,
                            priority: selectedPriority,
                            dueDate: selectedDate,
                          ));
                        }
                      });
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('Save'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: widget.onBack,
        ),
        title: Text(widget.box.name),
        backgroundColor: widget.box.color,
        foregroundColor: Colors.white,
      ),
      body: ListView.builder(
        itemCount: widget.box.tasks.length,
        itemBuilder: (context, index) {
          final task = widget.box.tasks[index];
          return TaskCard(
            task: task,
            onToggle: () {
              setState(() {
                final updatedTask = task.copyWith(isCompleted: !task.isCompleted);
                widget.box.tasks[index] = updatedTask;
              });
            },
            onLongPress: () => _showAddOrEditTaskDialog(task: task),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddOrEditTaskDialog(),
        tooltip: 'Add Task',
        backgroundColor: widget.box.color,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
