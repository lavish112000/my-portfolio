import 'package:flutter/material.dart';
import 'package:task_tracker/utils/app_colors.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _taskReminders = true;
  bool _deadlineAlerts = true;
  bool _appUpdates = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: AppColors.backgroundColor,
        elevation: 0,
        foregroundColor: AppColors.textPrimary,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          _buildSectionHeader('Task Alerts'),
          _buildSwitchTile(
            title: 'Task Reminders',
            subtitle: 'Get notified for upcoming tasks',
            value: _taskReminders,
            onChanged: (value) => setState(() => _taskReminders = value),
          ),
          _buildSwitchTile(
            title: 'Deadline Alerts',
            subtitle: 'Get notified when a deadline is near',
            value: _deadlineAlerts,
            onChanged: (value) => setState(() => _deadlineAlerts = value),
          ),
          const Divider(height: 40),
          _buildSectionHeader('General'),
          _buildSwitchTile(
            title: 'App Updates',
            subtitle: 'Get notified about new features and updates',
            value: _appUpdates,
            onChanged: (value) => setState(() => _appUpdates = value),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0, bottom: 8.0),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: AppColors.textSecondary,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return SwitchListTile.adaptive(
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: Text(subtitle, style: const TextStyle(color: AppColors.textSecondary)),
      value: value,
      onChanged: onChanged,
      activeColor: AppColors.primaryColor,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }
}
