// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  Shield,
  Bell,
  Database
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/lib/utils';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const adminLinks = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    { 
      name: 'User Management', 
      path: '/admin/users', 
      icon: Users,
      description: 'Manage alumni and admin accounts'
    },
    { 
      name: 'Event Management', 
      path: '/admin/events', 
      icon: Calendar,
      description: 'Create and manage events'
    },
    { 
      name: 'Job Board', 
      path: '/admin/jobs', 
      icon: Briefcase,
      description: 'Manage job postings'
    },
    { 
      name: 'Forum Moderation', 
      path: '/admin/forum', 
      icon: MessageSquare,
      description: 'Moderate discussion forums'
    },
    { 
      name: 'Content Management', 
      path: '/admin/content', 
      icon: FileText,
      description: 'Manage website content'
    },
    { 
      name: 'Fundraising', 
      path: '/admin/fundraising', 
      icon: BarChart3,
      description: 'Manage fundraising campaigns'
    },
    { 
      name: 'Notifications', 
      path: '/admin/notifications', 
      icon: Bell,
      description: 'Send system notifications'
    },
    { 
      name: 'Data & Analytics', 
      path: '/admin/analytics', 
      icon: Database,
      description: 'View platform analytics'
    },
    { 
      name: 'Security', 
      path: '/admin/security', 
      icon: Shield,
      description: 'Security settings'
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: Settings,
      description: 'Platform configuration'
    },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-dark-blue"
          >
            Admin Panel
          </motion.h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg text-sm font-medium transition-colors group",
                    isActive 
                      ? 'bg-soft-blue text-dark-blue' 
                      : 'text-dark-gray hover:bg-soft-blue hover:text-dark-blue'
                  )}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-3"
                    >
                      <span>{link.name}</span>
                      <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                    </motion.div>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {link.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!isCollapsed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-gray-200"
        >
          <div className="bg-soft-blue rounded-lg p-3">
            <h3 className="text-sm font-medium text-dark-blue mb-1">Need Help?</h3>
            <p className="text-xs text-dark-gray mb-2">
              Check our documentation or contact support for assistance.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;