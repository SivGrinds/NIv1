import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Star,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  current: boolean;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, current: true },
  { name: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" />, current: false },
  { name: 'Providers', href: '/admin/providers', icon: <Building2 className="h-5 w-5" />, current: false },
  { name: 'Claims', href: '/admin/claims', icon: <Shield className="h-5 w-5" />, current: false },
  { name: 'Reviews', href: '/admin/reviews', icon: <Star className="h-5 w-5" />, current: false },
  { name: 'Messages', href: '/admin/messages', icon: <MessageSquare className="h-5 w-5" />, current: false },
  { name: 'Reports', href: '/admin/reports', icon: <FileText className="h-5 w-5" />, current: false },
  { name: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" />, current: false },
  { name: 'Support', href: '/admin/support', icon: <HelpCircle className="h-5 w-5" />, current: false },
  { name: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" />, current: false },
];

const AdminSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div
                  className={`mr-3 flex-shrink-0 ${
                    item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                >
                  {item.icon}
                </div>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 