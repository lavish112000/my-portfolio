// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:task_tracker/models/priority_box.dart';
import 'package:task_tracker/utils/app_colors.dart';

class HomeScreen extends StatelessWidget {
  final List<PriorityBox> priorityBoxes;
  final Function(PriorityBox) onBoxTapped;
  final VoidCallback onShowDialog;

  const HomeScreen({
    super.key,
    required this.priorityBoxes,
    required this.onBoxTapped,
    required this.onShowDialog,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Tasks'),
        backgroundColor: AppColors.backgroundColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Projects',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.2,
                ),
                itemCount: priorityBoxes.length + 1, // Add one for the 'Add' button
                itemBuilder: (context, index) {
                  if (index == priorityBoxes.length) {
                    // This is the 'Add' button
                    return GestureDetector(
                      onTap: onShowDialog,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade400, width: 2, style: BorderStyle.solid),
                        ),
                        child: const Center(
                          child: Icon(Icons.add, size: 40, color: Colors.grey),
                        ),
                      ),
                    );
                  }
                  final box = priorityBoxes[index];
                  return GestureDetector(
                    onTap: () => onBoxTapped(box),
                    child: Container(
                      decoration: BoxDecoration(
                        color: box.color,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              box.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${box.tasks.length} Tasks',
                              style: TextStyle(
                                color: Colors.white.withAlpha((255 * 0.8).round()),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: onShowDialog,
        backgroundColor: AppColors.primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}