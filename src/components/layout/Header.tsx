import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Building2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Menu,
} from 'lucide-react';
import { User, UserRole, NotificationItem, ActiveNavModule } from '../../types';
import { UniversityLogo } from '../common/UniversityLogo';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  activeModule: ActiveNavModule;
  onNavigate: (module: ActiveNavModule) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

const moduleTitles: Record<ActiveNavModule, { title: string; category: string }> = {
  dashboard: { title: 'Operational Dashboard', category: 'Overview' },
  laboratories: { title: 'University Laboratories', category: 'Facilities' },
  my_laboratory: { title: 'My Assigned Laboratory', category: 'Facility' },
  inventory: { title: 'Consumables & Asset Inventory', category: 'Stock' },
  equipment: { title: 'Equipment Registry', category: 'Assets' },
  students: { title: 'Student Lab Registry & Records', category: 'Students' },
  lab_assistants: { title: 'Laboratory Assistants & Duty Roster', category: 'Staff' },
  issue_equipment: { title: 'Equipment Checkout / Issue', category: 'Circulation' },
  return_equipment: { title: 'Equipment Check-in / Return', category: 'Circulation' },
  maintenance: { title: 'Maintenance & Calibration Tickets', category: 'Upkeep' },
  overdue_items: { title: 'Overdue Equipment & Hold Registry', category: 'Alerts' },
  reports: { title: 'Utilization & Asset Reports', category: 'Analytics' },
  activity_logs: { title: 'Real-time Activity Stream', category: 'Monitoring' },
  my_activity: { title: 'My Laboratory Activity Log', category: 'Monitoring' },
  audit_logs: { title: 'System Security & Compliance Audit', category: 'Compliance' },
  notifications: { title: 'Notifications & Alerts Hub', category: 'Inbox' },
  settings: { title: 'System & Institutional Settings', category: 'Configuration' },
};

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  activeModule,
  onNavigate,
  notifications,
  onMarkNotificationRead,
  onOpenSearch,
  onLogout,
  onToggleMobileMenu,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMeta = moduleTitles[activeModule] || { title: 'BBSUTSD Central Labs', category: 'App' };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#251816] bg-[#120d0c]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8 shadow-md">
      {/* Zone 1: Mobile toggle & Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#30201d] bg-[#1a1211] text-[#a39589] hover:bg-[#251917] hover:text-[#f5efe8] transition md:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="md:hidden">
            <UniversityLogo size="xs" showText={false} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-medium text-[#8f7e71]">
              <span
                className="font-bold text-stone-300 hover:text-white transition"
                title="The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur"
              >
                BBSUTSD
              </span>
              <span aria-hidden="true" className="text-red-900">/</span>
              <span>{currentMeta.category}</span>
            </div>
            <h1 className="text-base font-semibold tracking-tight text-[#f5efe8] sm:text-lg">
              {currentMeta.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Zone 2: Universal Search Trigger - High Visual Priority */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onOpenSearch}
          className="group relative flex h-9 w-84 items-center justify-between rounded-xl border border-[#36221f] bg-[#17100f] px-3.5 text-xs text-[#a39589] transition-all duration-200 hover:border-red-900/60 hover:bg-[#1d1413] hover:shadow-[0_0_15px_rgba(220,38,38,0.18)]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-3.5 w-3.5 text-red-400 group-hover:text-red-300 transition-colors" />
            <span className="truncate">Universal search: asset IDs, serials, labs...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 rounded border border-[#3b2420] bg-[#221614] px-1.5 py-0.5 font-mono text-[10px] text-[#b3a497] shadow-xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions, Two-Role Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button on small screens */}
        <button
          onClick={onOpenSearch}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#30201d] bg-[#1a1211] text-[#a39589] hover:bg-[#251917] hover:text-[#f5efe8] transition md:hidden"
          title="Search"
        >
          <Search className="h-4 w-4 text-red-400" />
        </button>

        {/* Role Switcher (HOD / Admin & Lab Assistant Only) */}
        <div className="hidden lg:flex items-center rounded-xl border border-[#33201d] bg-[#17100f] p-0.5 text-xs font-medium text-[#a39589]">
          <span className="px-2.5 text-[10px] font-semibold text-[#827164] uppercase tracking-wider">
            Active Role:
          </span>
          <button
            onClick={() => onRoleChange('HOD_ADMIN')}
            className={`rounded-lg px-2.5 py-1 transition-all duration-200 ${
              currentUser.role === 'HOD_ADMIN'
                ? 'bg-gradient-to-r from-red-950 to-red-900 text-red-100 border border-red-700/60 shadow-[0_0_10px_rgba(220,38,38,0.3)] font-semibold'
                : 'text-[#9c8c7f] hover:text-[#f5efe8] hover:bg-[#221614]'
            }`}
          >
            HOD / Admin
          </button>
          <button
            onClick={() => onRoleChange('LAB_ASSISTANT')}
            className={`rounded-lg px-2.5 py-1 transition-all duration-200 ${
              currentUser.role === 'LAB_ASSISTANT'
                ? 'bg-gradient-to-r from-red-950 to-red-900 text-red-100 border border-red-700/60 shadow-[0_0_10px_rgba(220,38,38,0.3)] font-semibold'
                : 'text-[#9c8c7f] hover:text-[#f5efe8] hover:bg-[#221614]'
            }`}
          >
            Lab Assistant
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#30201d] bg-[#1a1211] text-[#a39589] hover:border-red-900/50 hover:bg-[#231715] hover:text-[#f5efe8] transition-all duration-150"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.8)] tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#382320] bg-[#181110] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#281816] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#b8a89b]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[11px] text-red-400 font-mono">({unreadCount} new)</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('notifications');
                  }}
                  className="text-xs font-medium text-red-400 hover:text-red-300 transition"
                >
                  View All
                </button>
              </div>

              <div className="max-h-72 divide-y divide-[#241715] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#7d6c60]">No new notifications</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onMarkNotificationRead(item.id)}
                      className={`group flex items-start gap-3 p-2.5 transition hover:bg-[#201514] cursor-pointer rounded-lg ${
                        !item.read ? 'bg-red-950/20 border-l-2 border-red-500' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'alert' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                        {item.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                        {item.type === 'info' && <Info className="h-4 w-4 text-sky-400" />}
                        {item.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-[#f5efe8]">{item.title}</p>
                          <span className="text-[10px] text-[#7d6c60] font-mono">{item.timestamp}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#a39589] line-clamp-2">{item.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl border border-[#30201d] bg-[#17100f] p-1.5 pl-2 hover:border-red-900/50 hover:bg-[#221614] transition-all duration-150"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-950 to-red-800 border border-red-700/50 text-xs font-semibold text-white shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium text-[#f5efe8] leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-[#8f7e71] leading-tight">
                {currentUser.role === 'HOD_ADMIN' ? 'HOD / Admin' : 'Lab Assistant'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#7d6c60] ml-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#382320] bg-[#181110] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="border-b border-[#241715] p-2.5 mb-1 bg-[#1d1312] rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#f5efe8]">{currentUser.name}</p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/50">
                    {currentUser.role === 'HOD_ADMIN' ? 'HOD / Admin' : 'Lab Assistant'}
                  </span>
                </div>
                <p className="text-[11px] text-[#8f7e71] truncate mt-0.5">{currentUser.email}</p>
                <div className="mt-1.5 text-[11px] text-[#a39589]">
                  <span>{currentUser.department}</span>
                  {currentUser.staffId && (
                    <span className="block font-mono text-[10px] text-red-400 mt-0.5">Staff ID: {currentUser.staffId}</span>
                  )}
                  {currentUser.assignedLabName && currentUser.role === 'LAB_ASSISTANT' && (
                    <span className="block text-[10px] text-amber-300 mt-0.5 truncate">
                      Lab: {currentUser.assignedLabName}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Quick Role Switcher */}
              <div className="lg:hidden border-b border-[#241715] p-2 mb-1">
                <p className="text-[10px] font-semibold text-[#8f7e71] uppercase tracking-wider mb-1.5">
                  Switch Active Role
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={() => {
                      onRoleChange('HOD_ADMIN');
                      setShowUserMenu(false);
                    }}
                    className={`rounded-lg px-2 py-1 text-center font-medium ${
                      currentUser.role === 'HOD_ADMIN'
                        ? 'bg-red-950 text-red-100 border border-red-800'
                        : 'bg-[#221614] text-[#a39589]'
                    }`}
                  >
                    HOD / Admin
                  </button>
                  <button
                    onClick={() => {
                      onRoleChange('LAB_ASSISTANT');
                      setShowUserMenu(false);
                    }}
                    className={`rounded-lg px-2 py-1 text-center font-medium ${
                      currentUser.role === 'LAB_ASSISTANT'
                        ? 'bg-red-950 text-red-100 border border-red-800'
                        : 'bg-[#221614] text-[#a39589]'
                    }`}
                  >
                    Lab Assistant
                  </button>
                </div>
              </div>

              <div className="space-y-0.5">
                {currentUser.role === 'HOD_ADMIN' && (
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#a39589] hover:bg-[#221614] hover:text-[#f5efe8] transition"
                  >
                    <Sliders className="h-3.5 w-3.5 text-[#7d6c60]" />
                    <span>System Settings</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate(currentUser.role === 'HOD_ADMIN' ? 'laboratories' : 'my_laboratory');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#a39589] hover:bg-[#221614] hover:text-[#f5efe8] transition"
                >
                  <Building2 className="h-3.5 w-3.5 text-[#7d6c60]" />
                  <span>{currentUser.role === 'HOD_ADMIN' ? 'University Facilities' : 'My Laboratory'}</span>
                </button>
              </div>

              <div className="border-t border-[#241715] mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
