import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  MessageSquare,
  Calendar,
  ClipboardList,
  Users,
  Settings as SettingsIcon,
  Menu,
  X,
  User,
  Activity,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

const navItems = [
  { path: "/chat", label: "Chat Assistant", icon: MessageSquare },
  { path: "/book", label: "Book Appointment", icon: Calendar },
  { path: "/appointments", label: "My Appointments", icon: ClipboardList },
  { path: "/doctors", label: "Doctors", icon: Users },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/chat" && location.pathname === "/") return true;
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Dental AI</h1>
              <p className="text-xs text-slate-500">Assistant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                PT
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-900">Patient</p>
              <p className="text-xs text-slate-500">ID: P-1000049</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Dental AI</h1>
              <p className="text-xs text-slate-500">Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-semibold text-slate-900">Dental AI</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">ID: P-1000049</span>
              </div>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  PT
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
