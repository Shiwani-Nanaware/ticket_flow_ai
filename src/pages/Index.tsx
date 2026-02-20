// Overview Dashboard — Key metrics and recent activity
import { MOCK_TICKETS, ANALYTICS_DATA } from "@/data/mockData";
import { CheckCircle, AlertTriangle, Clock, TrendingUp, Zap, ShieldAlert, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function ConfidenceBar({ score }: { score: number }) {
  const colorClass = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive";
  return (
    <div className="confidence-bar w-full">
      <div className={cn("h-full rounded-full transition-all", colorClass)} style={{ width: `${score}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    auto_resolved: "status-success",
    approved: "status-success",
    pending_review: "status-warning",
    escalated: "status-error",
    overridden: "status-info",
  };
  const labels: Record<string, string> = {
    auto_resolved: "Auto Resolved",
    approved: "Approved",
    pending_review: "Pending Review",
    escalated: "Escalated",
    overridden: "Overridden",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", map[status] ?? "status-info")}>
      {labels[status] ?? status}
    </span>
  );
}

const STAT_CARDS = [
  {
    label: "Total Tickets",
    value: "248",
    sub: "+12 today",
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    label: "Auto-Resolved",
    value: "174",
    sub: "70.2% resolution rate",
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success-bg",
  },
  {
    label: "Pending Review",
    value: "3",
    sub: "Requires human action",
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning-bg",
  },
  {
    label: "SLA Compliance",
    value: "94%",
    sub: "+2% vs last week",
    icon: TrendingUp,
    color: "text-info",
    bg: "bg-info-bg",
  },
];

export default function Index() {
  const recentTickets = MOCK_TICKETS.slice(0, 6);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI engine is processing tickets in real-time. Last sync: just now.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="card-surface p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", card.bg)}>
                <card.icon className={cn("w-4 h-4", card.color)} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground tracking-tight">{card.value}</div>
            <div className="text-xs font-medium text-foreground mt-0.5">{card.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Decision Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI Engine Status</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Confidence Score</span>
              <span className="font-medium text-foreground">78%</span>
            </div>
            <ConfidenceBar score={78} />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg RSI Score</span>
              <span className="font-medium text-foreground">74%</span>
            </div>
            <ConfidenceBar score={74} />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Similarity Score</span>
              <span className="font-medium text-foreground">81%</span>
            </div>
            <ConfidenceBar score={81} />
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-success" />
            <h3 className="text-sm font-semibold text-foreground">Top Auto-Resolved Categories</h3>
          </div>
          <div className="space-y-2">
            {ANALYTICS_DATA.categoryBreakdown.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-32 truncate">{cat.name}</span>
                <div className="confidence-bar flex-1">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${cat.autoRate}%` }} />
                </div>
                <span className="text-xs font-medium text-foreground w-8 text-right">{cat.autoRate}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-semibold text-foreground">Escalation Alerts</h3>
          </div>
          <div className="space-y-2">
            {MOCK_TICKETS.filter((t) => t.status === "pending_review" || t.status === "escalated").map((t) => (
              <div key={t.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/50 border border-border">
                <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground leading-tight">{t.id}</p>
                  <p className="text-xs text-muted-foreground leading-tight truncate w-36">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent tickets table */}
      <div className="card-surface">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Recent Tickets</h3>
          <Link to="/auto-resolved" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">ID</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Title</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Department</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Category</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Confidence</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.map((ticket, i) => (
              <tr key={ticket.id} className={cn("border-b border-border last:border-0 hover:bg-muted/30 transition-colors")}>
                <td className="px-5 py-3 text-xs font-mono text-primary font-medium">{ticket.id}</td>
                <td className="px-5 py-3 max-w-xs">
                  <p className="text-xs font-medium text-foreground truncate">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">{ticket.businessCritical && <span className="status-error px-1 py-0.5 rounded text-[10px] mr-1">Business Critical</span>}{ticket.priority} priority</p>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{ticket.department}</td>
                <td className="px-5 py-3 text-xs text-foreground">{ticket.category}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="confidence-bar w-16">
                      <div
                        className={cn("h-full rounded-full", ticket.confidenceScore >= 80 ? "bg-success" : ticket.confidenceScore >= 60 ? "bg-warning" : "bg-destructive")}
                        style={{ width: `${ticket.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{ticket.confidenceScore}%</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={ticket.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
