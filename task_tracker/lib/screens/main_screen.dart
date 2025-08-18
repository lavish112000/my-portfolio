// lib/screens/main_screen.dart
import 'package:flutter/material.dart';
import 'package:task_tracker/models/priority.dart';
import 'package:task_tracker/models/priority_box.dart';
import 'package:task_tracker/models/task.dart';
import 'package:task_tracker/screens/task_calendar_screen.dart';
import 'package:task_tracker/screens/home_screen.dart';
import 'package:task_tracker/screens/profile_screen.dart';
import 'package:task_tracker/screens/statistics_screen.dart';
import 'package:task_tracker/screens/task_list_screen.dart';
import 'package:task_tracker/widgets/add_project_dialog.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  PriorityBox? _selectedBox;

  final List<PriorityBox> _priorityBoxes = [
    PriorityBox(
      id: '1',
      name: 'High Priority',
      color: Colors.red.shade300,
      tasks: [
        Task(id: 't1', title: 'Finish report for Q3', priority: Priority.high),
        Task(id: 't2', title: 'Prepare for client meeting', priority: Priority.high, isCompleted: true),
      ],
    ),
    PriorityBox(
      id: '2',
      name: 'Medium Priority',
      color: Colors.orange.shade300,
      tasks: [
        Task(id: 't3', title: 'Review design mockups', priority: Priority.medium),
      ],
    ),
    PriorityBox(
      id: '3',
      name: 'Low Priority',
      color: Colors.blue.shade300,
      tasks: [
        Task(id: 't4', title: 'Organize team lunch', priority: Priority.low),
        Task(id: 't5', title: 'Update documentation', priority: Priority.low),
      ],
    ),
    PriorityBox(id: '4', name: 'General', color: Colors.green.shade300, tasks: []),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
      _selectedBox = null; // Go back to the main list view when switching tabs
    });
  }

  void _selectBox(PriorityBox box) {
    setState(() {
      _selectedBox = box;
    });
  }

  void _showAddOrEditBoxDialog() {
    showDialog(
      context: context,
      builder: (context) => AddProjectDialog(
        onAddProject: (projectName) {
          setState(() {
            _priorityBoxes.add(
              PriorityBox(
                id: DateTime.now().toString(),
                name: projectName,
                color: Colors.primaries[(_priorityBoxes.length) % Colors.primaries.length],
                tasks: [],
              ),
            );
          });
        },
      ),
    );
  }

  Widget _getScreenForIndex(int index) {
    if (index == 0) {
      // Home Screen Logic
      if (_selectedBox != null) {
        return TaskListScreen(
          box: _selectedBox!,
          onBack: () => setState(() => _selectedBox = null),
        );
      } else {
        return HomeScreen(
          priorityBoxes: _priorityBoxes,
          onShowDialog: _showAddOrEditBoxDialog,
          onBoxTapped: _selectBox,
        );
      }
    } else if (index == 1) {
      return StatisticsScreen(priorityBoxes: _priorityBoxes);
    } else if (index == 2) {
      return TaskCalendarScreen(priorityBoxes: _priorityBoxes);
    } else if (index == 3) {
      return ProfileScreen(priorityBoxes: _priorityBoxes);
    }
    return Container(); // Fallback
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _getScreenForIndex(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart),
            label: 'Statistics',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'Calendar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).primaryColor,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
