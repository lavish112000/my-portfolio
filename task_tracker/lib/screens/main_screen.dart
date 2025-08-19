// lib/screens/main_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
  
  // Define colors for unselected bottom navigation items
  final List<Color> _unselectedIconColors = [
    Colors.grey,
    Colors.grey,
    Colors.grey,
    Colors.grey,
  ];

  final List<PriorityBox> _priorityBoxes = [
    PriorityBox(
      id: '1',
      name: 'High Priority',
      color: Colors.red.shade300,
      tasks: [
        Task(id: 't1', title: 'Finish report for Q3', priority: Priority.high, isCompleted: false, dueDate: DateTime.now().add(const Duration(days: 1))),
        Task(id: 't2', title: 'Prepare for client meeting', priority: Priority.high, isCompleted: true, dueDate: DateTime.now().add(const Duration(days: 1))),
      ],
    ),
    PriorityBox(
      id: '2',
      name: 'Medium Priority',
      color: Colors.orange.shade300,
      tasks: [
        Task(id: 't3', title: 'Review design mockups', priority: Priority.medium, isCompleted: false, dueDate: DateTime.now().add(const Duration(days: 3))),
      ],
    ),
    PriorityBox(
      id: '3',
      name: 'Low Priority',
      color: Colors.blue.shade300,
      tasks: [
        Task(id: 't4', title: 'Organize team lunch', priority: Priority.low, isCompleted: false, dueDate: DateTime.now().add(const Duration(days: 5))),
        Task(id: 't5', title: 'Update documentation', priority: Priority.low, isCompleted: false, dueDate: DateTime.now().add(const Duration(days: 7))),
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
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Scaffold(
      extendBody: true,
      body: Container(
        decoration: BoxDecoration(
          gradient: isDark 
              ? LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.grey[900]!,
                    Colors.grey[850]!,
                  ],
                )
              : LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.white,
                    Theme.of(context).scaffoldBackgroundColor,
                  ],
                ),
        ),
        child: _getScreenForIndex(_selectedIndex),
      ),
      bottomNavigationBar: _buildBottomNavBar(theme, isDark),
    );
  }

  Widget _buildBottomNavBar(ThemeData theme, bool isDark) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? Colors.grey[850] : Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        child: BottomNavigationBar(
          items: [
            _buildNavItem(
              icon: Icons.home_rounded,
              label: 'Home',
              index: 0,
              isDark: isDark,
            ),
            _buildNavItem(
              icon: Icons.bar_chart_rounded,
              label: 'Stats',
              index: 1,
              isDark: isDark,
            ),
            _buildNavItem(
              icon: Icons.calendar_month_rounded,
              label: 'Calendar',
              index: 2,
              isDark: isDark,
            ),
            _buildNavItem(
              icon: Icons.person_rounded,
              label: 'Profile',
              index: 3,
              isDark: isDark,
            ),
          ],
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          type: BottomNavigationBarType.fixed,
          backgroundColor: isDark ? Colors.grey[850] : Colors.white,
          selectedItemColor: Theme.of(context).primaryColor,
          unselectedItemColor: _unselectedIconColors[_selectedIndex],
          selectedLabelStyle: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
          unselectedLabelStyle: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
          elevation: 0,
          showSelectedLabels: true,
          showUnselectedLabels: true,
        ),
      ),
    );
  }

  BottomNavigationBarItem _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
    required bool isDark,
  }) {
    final isSelected = _selectedIndex == index;
    
    return BottomNavigationBarItem(
      icon: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
        decoration: isSelected
            ? BoxDecoration(
                color: Theme.of(context).primaryColor.withAlpha(25), // 0.1 * 255 ≈ 25
                borderRadius: BorderRadius.circular(12),
              )
            : null,
        child: Icon(
          icon,
          size: 24,
          color: isSelected 
              ? Theme.of(context).primaryColor
              : (isDark ? Colors.grey[500] : Colors.grey[600]),
        ),
      ),
      label: label,
    );
  }
}
