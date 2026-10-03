import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Package,
  Layers,
  Users,
  GraduationCap,
  ArrowUpRight,
  ArrowDownLeft,
  Wrench,
  AlertOctagon,
  BarChart3,
  Activity,
  ShieldCheck,
  Bell,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import { ActiveNavModule, UserRole } from '../../types';
import { UniversityLogo } from '../common/UniversityLogo';

interface SidebarProps {
  activeModule: ActiveNavModule;
  onNavigate: (module: ActiveNavModule) => void;
  userRole: UserRole;
  overdueCount?: number;
  maintenanceCount?: number;
  unreadNotificationsCount?: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  assignedLabName?: string;
}

interface NavItem {
  id: ActiveNavModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeVariant?: 'danger' | 'warning' | 'neutral';
  roles: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onNavigate,
  userRole,
  overdueCount = 0,
  maintenanceCount = 0,
  unreadNotificationsCount = 0,
  isMobileOpen,
  onCloseMobile,
  assignedLabName = 'Power Systems & Microelectronics Lab (ETC-204)',
}) => {
  // Navigation structure tailored for HOD_ADMIN and LAB_ASSISTANT
  const sections: NavSection[] = [
    {
      title: 'CORE MODULES',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
        {
          id: 'laboratories',
          label: 'Laboratories',
          icon: Building2,
          roles: ['HOD_ADMIN'],
        },
        {
          id: 'my_laboratory',
          label: 'My Laboratory',
          icon: Building2,
          roles: ['LAB_ASSISTANT'],
        },
        {
          id: 'equipment',
          label: 'Equipment',
          icon: Layers,
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: Package,
          roles: ['HOD_ADMIN'],
        },
      ],
    },
    {
      title: 'CIRCULATION & LOANS',
      items: [
        {
          id: 'issue_equipment',
          label: 'Issue Equipment',
          icon: ArrowUpRight,
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
        {
          id: 'return_equipment',
          label: 'Return Equipment',
          icon: ArrowDownLeft,
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
        {
          id: 'overdue_items',
          label: 'Overdue Items',
          icon: AlertOctagon,
          badge: overdueCount,
          badgeVariant: 'danger',
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
      ],
    },
    {
      title: 'RECORDS & MAINTENANCE',
      items: [
        {
          id: 'students',
          label: 'Students',
          icon: GraduationCap,
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
        {
          id: 'lab_assistants',
          label: 'Lab Assistants',
          icon: Users,
          roles: ['HOD_ADMIN'],
        },
        {
          id: 'maintenance',
          label: 'Maintenance',
          icon: Wrench,
          badge: maintenanceCount,
          badgeVariant: 'warning',
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
      ],
    },
    {
      title: 'GOVERNANCE & LOGS',
      items: [
        {
          id: 'reports',
          label: 'Reports',
          icon: BarChart3,
          roles: ['HOD_ADMIN'],
        },
        {
          id: 'activity_logs',
          label: 'Activity Logs',
          icon: Activity,
          roles: ['HOD_ADMIN'],
        },
        {
          id: 'my_activity',
          label: 'My Activity',
          icon: Activity,
          roles: ['LAB_ASSISTANT'],
        },
        {
          id: 'audit_logs',
          label: 'Audit Logs',
          icon: ShieldCheck,
          roles: ['HOD_ADMIN'],
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotificationsCount,
          badgeVariant: 'neutral',
          roles: ['HOD_ADMIN', 'LAB_ASSISTANT'],
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          roles: ['HOD_ADMIN'],
        },
      ],
    },
  ];

  const handleSelectModule = (id: ActiveNavModule) => {
    onNavigate(id);
    onCloseMobile();
  };

  const roleLabelMap: Record<UserRole, { label: string; tone: string }> = {
    HOD_ADMIN: {
      label: 'HOD / Admin',
      tone: 'text-red-300 bg-red-950/40 border-red-900/60 shadow-[0_0_12px_rgba(220,38,38,0.2)]',
    },
    LAB_ASSISTANT: {
      label: 'Lab Assistant',
      tone: 'text-amber-300 bg-amber-950/40 border-amber-900/50 shadow-[0_0_12px_rgba(217,119,6,0.15)]',
    },
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#110c0b] text-[#f5efe8]">
      {/* Brand Header with Electric Crimson Accent */}
      <div>
        <div className="relative flex h-16 items-center justify-between border-b border-[#251816] px-4 bg-[#140e0d]">
          <div className="flex items-center gap-2.5">
            <UniversityLogo size="sm" showText={false} />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base leading-none">
                  BBSUTSD
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 px-1 py-0.5 rounded bg-red-950/80 border border-red-800/40">
                  LABS
                </span>
              </div>
              <span
                className="text-[10px] font-medium text-[#9c8c7f] leading-tight mt-0.5 truncate max-w-[135px]"
                title="The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur"
              >
                Khairpur Campus
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#9c8c7f] hover:bg-[#201412] hover:text-white transition md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Authenticated Role Context Badge */}
        <div className="px-4 py-3 border-b border-[#1f1513]">
          <div
            className={`flex items-center justify-between rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${roleLabelMap[userRole].tone}`}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-red-400 shrink-0" />
              <span className="truncate">{roleLabelMap[userRole].label}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"></span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 px-3 py-3.5 max-h-[calc(100vh-13.5rem)] overflow-y-auto">
          {sections.map((section, idx) => {
            const filteredItems = section.items.filter((item) => item.roles.includes(userRole));
            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-[10px] font-semibold tracking-wider text-[#7d6c60] uppercase">
                  {section.title}
                </p>
                <div className="space-y-0.5 pt-0.5">
                  {filteredItems.map((item) => {
                    const isActive = activeModule === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectModule(item.id)}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-red-950 via-[#3a1013] to-[#250d0f] text-white border-l-2 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.25)] font-semibold'
                            : 'text-[#a39589] hover:bg-[#1a1211] hover:text-[#f5efe8] hover:translate-x-0.5'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute inset-y-0 left-0 w-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
                        )}

                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                              isActive
                                ? 'text-red-400 scale-105'
                                : 'text-[#7d6c60] group-hover:text-red-300 group-hover:scale-105'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== undefined && Number(item.badge) > 0 && (
                          <span
                            className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums transition ${
                              isActive
                                ? 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                                : item.badgeVariant === 'danger'
                                ? 'bg-red-950 text-red-300 border border-red-800/60 shadow-[0_0_8px_rgba(220,38,38,0.25)]'
                                : item.badgeVariant === 'warning'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                                : 'bg-[#221715] text-[#a39589]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* University Institutional Scope Footer Card */}
      <div className="border-t border-[#251816] p-3.5 bg-[#140e0d]">
        <div className="rounded-xl bg-[#1a1210] p-2.5 border border-[#33201d] relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-red-950/30 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-[11px] text-[#9c8c7f] font-medium">
            <span
              className="flex items-center gap-1.5 text-stone-200 truncate max-w-[150px]"
              title="The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              BBSUTSD Khairpur
            </span>
            <span className="font-mono text-[10px] text-red-400">TERM: SP26</span>
          </div>
          <p className="mt-1 text-[11px] text-[#857467] leading-snug truncate">
            {userRole === 'HOD_ADMIN'
              ? 'Complete University Lab Scope (6 Facilities)'
              : `Assigned: ${assignedLabName}`}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 border-r border-[#261816] shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-72 max-w-xs flex-1 flex-col shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
