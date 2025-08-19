// lib/widgets/priority_box_card.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:task_tracker/models/priority_box.dart';
import 'package:task_tracker/models/priority.dart';
import 'package:task_tracker/models/task.dart';
import 'package:task_tracker/utils/app_colors.dart';
import 'package:flutter_animate/flutter_animate.dart';

class PriorityBoxCard extends StatefulWidget {
  final PriorityBox box;
  final VoidCallback onTap;
  
  const PriorityBoxCard({
    super.key, 
    required this.box,
    required this.onTap,
  });

  @override
  State<PriorityBoxCard> createState() => _PriorityBoxCardState();
}

class _PriorityBoxCardState extends State<PriorityBoxCard> with SingleTickerProviderStateMixin {
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
  
  int get completedTasks => widget.box.tasks.where((task) => task.isCompleted).length;
  int get totalTasks => widget.box.tasks.length;
  double get progress => totalTasks > 0 ? completedTasks / totalTasks : 0.0;
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return GestureDetector(
      onTap: widget.onTap,
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        transform: Matrix4.identity()..scale(_isPressed ? 0.97 : 1.0),
        child: Container(
          decoration: BoxDecoration(
            color: isDark ? Colors.grey[850] : Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
            border: Border.all(
              color: isDark ? Colors.grey[800]! : Colors.grey[200]!,
              width: 1.5,
            ),
          ),
          child: Stack(
            children: [
              // Background pattern or decoration
              Positioned(
                right: -20,
                top: -20,
                child: Opacity(
                  opacity: 0.1,
                  child: Icon(
                    _getPriorityIcon(widget.box.tasks.firstOrNull?.priority ?? Priority.medium),
                    size: 100,
                    color: widget.box.color,
                  ),
                ),
              ),
              
              // Content
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Project Name
                    Text(
                      widget.box.name,
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: isDark ? Colors.white : AppColors.textPrimary,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    
                    const Spacer(),
                    
                    // Progress Bar
                    if (totalTasks > 0) ...[
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Progress Text
                          Text(
                            '${(progress * 100).toInt()}% Complete',
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              color: AppColors.textTertiary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 6),
                          // Progress Bar
                          Container(
                            height: 6,
                            decoration: BoxDecoration(
                              color: isDark ? Colors.grey[800] : Colors.grey[200],
                              borderRadius: BorderRadius.circular(3),
                            ),
                            child: AnimatedFractionallySizedBox(
                              duration: const Duration(milliseconds: 600),
                              curve: Curves.easeOutQuart,
                              widthFactor: progress,
                              alignment: Alignment.centerLeft,
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      widget.box.color,
                                      widget.box.color.withOpacity(0.7),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                    
                    const SizedBox(height: 12),
                    
                    // Task Count and Due Date
                    Row(
                      children: [
                        // Task Count
                        _buildInfoChip(
                          icon: Icons.check_circle_outline_rounded,
                          value: '$completedTasks/$totalTasks',
                          color: widget.box.color,
                          isDark: isDark,
                        ),
                        
                        const SizedBox(width: 8),
                        
                        // Due Date (if any)
                        if (widget.box.tasks.any((task) => task.dueDate != null))
                          _buildInfoChip(
                            icon: Icons.calendar_today_rounded,
                            value: _getNearestDueDate(),
                            color: widget.box.color,
                            isDark: isDark,
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(
      duration: 300.ms,
      curve: Curves.easeOutQuart,
    );
  }
  
  Widget _buildInfoChip({
    required IconData icon,
    required String value,
    required Color color,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 12,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white : AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
  
  String _getNearestDueDate() {
    final now = DateTime.now();
    final upcomingTasks = widget.box.tasks
        .where((task) => task.dueDate != null && task.dueDate!.isAfter(now))
        .toList();
    
    if (upcomingTasks.isEmpty) return 'No due date';
    
    upcomingTasks.sort((a, b) => a.dueDate!.compareTo(b.dueDate!));
    final nextDue = upcomingTasks.first.dueDate!;
    
    final difference = nextDue.difference(now);
    if (difference.inDays > 0) {
      return '${difference.inDays}d';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h';
    } else {
      return '${difference.inMinutes}m';
    }
  }
  
  IconData _getPriorityIcon(Priority priority) {
    switch (priority) {
      case Priority.high:
        return Icons.arrow_upward_rounded;
      case Priority.medium:
        return Icons.horizontal_rule_rounded;
      case Priority.low:
        return Icons.arrow_downward_rounded;
      default:
        return Icons.circle_outlined; // Default icon if priority is somehow null or invalid
    }
  }
}
