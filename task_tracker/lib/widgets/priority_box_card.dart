// lib/widgets/priority_box_card.dart
import 'package:flutter/material.dart';
import 'package:task_tracker/models/priority_box.dart';

class PriorityBoxCard extends StatelessWidget {
  final PriorityBox box;

  const PriorityBoxCard({super.key, required this.box});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: box.color.withAlpha((255 * 0.2).round()),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: box.color, width: 1.5),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              box.name,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: box.color,
              ),
            ),
            const SizedBox(height: 8),
            Text('${box.tasks.length} Tasks'),
          ],
        ),
      ),
    );
  }
}
