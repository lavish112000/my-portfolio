import 'package:flutter/material.dart';
import 'package:task_tracker/models/priority_box.dart';
import 'package:task_tracker/models/user.dart';
import 'package:task_tracker/screens/appearance_screen.dart';
import 'package:task_tracker/screens/edit_profile_screen.dart';
import 'package:task_tracker/screens/help_support_screen.dart';
import 'package:task_tracker/screens/notifications_screen.dart';
import 'package:task_tracker/screens/privacy_security_screen.dart';
import 'package:task_tracker/utils/app_colors.dart';

class ProfileScreen extends StatefulWidget {
  final List<PriorityBox> priorityBoxes;
  const ProfileScreen({super.key, required this.priorityBoxes});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late User _user;
  int _createdTasks = 0;
  int _completedTasks = 0;
  int _pendingTasks = 0;

  @override
  void initState() {
    super.initState();
    _user = User(
      name: 'Lavish',
      email: 'lavish.user@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      phoneNumber: '+1 234 567 890',
    );
    _calculateTaskStats();
  }

  void _calculateTaskStats() {
    int created = 0;
    int completed = 0;
    for (var box in widget.priorityBoxes) {
      created += box.tasks.length;
      completed += box.tasks.where((task) => task.isCompleted).length;
    }
    setState(() {
      _createdTasks = created;
      _completedTasks = completed;
      _pendingTasks = created - completed;
    });
  }

  void _navigateToEditProfile(BuildContext context) async {
    final updatedUser = await Navigator.push<User>(
      context,
      MaterialPageRoute(
        builder: (context) => EditProfileScreen(user: _user),
      ),
    );

    if (updatedUser != null) {
      setState(() {
        _user = updatedUser;
      });
    }
  }

  void _showLogoutConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: const Text('Logout'),
          content: const Text('Are you sure you want to logout?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(dialogContext).pop(); // Dismiss the dialog
              },
            ),
            TextButton(
              child: const Text('Logout'),
              onPressed: () {
                Navigator.of(dialogContext).pop(); // Dismiss the dialog
                // Here you would typically navigate to the login screen
                // For now, we'll just pop the profile screen
                if (Navigator.of(context).canPop()) {
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 40),
            _buildProfileHeader(_user),
            const SizedBox(height: 20),
            _buildStatsRow(),
            const SizedBox(height: 20),
            _buildMenuList(context),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(User user) {
    return Column(
      children: [
        CircleAvatar(
          radius: 50,
          backgroundImage: NetworkImage(user.avatarUrl),
          backgroundColor: Colors.white,
        ),
        const SizedBox(height: 12),
        Text(
          user.name,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        Text(
          user.email,
          style: const TextStyle(
            fontSize: 16,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildStatsRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildStatItem(_createdTasks.toString(), 'Created'),
        _buildStatItem(_completedTasks.toString(), 'Completed'),
        _buildStatItem(_pendingTasks.toString(), 'Pending'),
      ],
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildMenuList(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          _buildMenuListItem(
            context: context,
            icon: Icons.person_outline,
            title: 'Edit Profile',
            onTap: () => _navigateToEditProfile(context),
          ),
          _buildMenuListItem(
            context: context,
            icon: Icons.notifications_none,
            title: 'Notifications',
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const NotificationsScreen()));
            },
          ),
          _buildMenuListItem(
            context: context,
            icon: Icons.color_lens_outlined,
            title: 'Appearance',
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const AppearanceScreen()));
            },
          ),
          _buildMenuListItem(
            context: context,
            icon: Icons.lock_outline,
            title: 'Privacy & Security',
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const PrivacySecurityScreen()));
            },
          ),
          _buildMenuListItem(
            context: context,
            icon: Icons.help_outline,
            title: 'Help & Support',
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const HelpSupportScreen()));
            },
          ),
          _buildMenuListItem(
            context: context,
            icon: Icons.logout,
            title: 'Logout',
            onTap: () => _showLogoutConfirmationDialog(context),
            isLogout: true,
          ),
        ],
      ),
    );
  }

  Widget _buildMenuListItem({
    required BuildContext context,
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isLogout = false,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: isLogout ? Colors.red : AppColors.primaryColor,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isLogout ? Colors.red : AppColors.textPrimary,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: const Icon(
        Icons.arrow_forward_ios,
        size: 16,
        color: AppColors.textSecondary,
      ),
      onTap: onTap,
    );
  }
}
