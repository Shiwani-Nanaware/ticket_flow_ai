// AppLayout — Enterprise sidebar navigation shell
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle,
  Users,
  BarChart3,
  Ticket,
  Settings,
  Bell,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Submit Ticket", path: "/submit", icon: Ticket },
  { label: "Auto-Resolved", path: "/auto-resolved", icon: CheckCircle },
  { label: "Human Review", path: "/human-review", icon: Users },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-sidebar flex flex-col border-r border-sidebar-border">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-sidebar-primary flex items-center justify-center">
              <Cpu className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <div className="text-sidebar-foreground font-semibold text-sm tracking-tight leading-none">TicketFlow AI</div>
              <div className="text-sidebar-foreground/50 text-[10px] leading-none mt-0.5">Enterprise ITSM</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          <div className="text-sidebar-foreground/40 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Platform</div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/settings"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.label ?? "TicketFlow AI"}
            </h2>
            <p className="text-xs text-muted-foreground">AI-powered ITSM — Production</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
              AI Engine Online
            </div>
            <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive"></span>
            </button>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-semibold">AM</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
