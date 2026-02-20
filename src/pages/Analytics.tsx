// Analytics Dashboard — Key metrics and visualizations
import { ANALYTICS_DATA } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, CheckCircle, AlertTriangle, Clock, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const CHART_COLORS = {
  primary: "hsl(221, 67%, 33%)",
  success: "hsl(142, 71%, 35%)",
  warning: "hsl(32, 95%, 44%)",
  destructive: "hsl(0, 72%, 51%)",
  muted: "hsl(210, 17%, 88%)",
  info: "hsl(211, 79%, 42%)",
};

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.destructive,
  CHART_COLORS.info,
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#F3F4F6",
];

const SUMMARY = ANALYTICS_DATA.summary;

const STAT_CARDS = [
  { label: "Total Tickets (30d)", value: SUMMARY.totalTickets, unit: "", icon: Activity, color: "text-primary", bg: "bg-primary-light" },
  { label: "Auto-Resolved", value: SUMMARY.autoResolved, unit: ` (${Math.round((SUMMARY.autoResolved / SUMMARY.totalTickets) * 100)}%)`, icon: CheckCircle, color: "text-success", bg: "bg-success-bg" },
  { label: "Escalated to Human", value: SUMMARY.escalated, unit: ` (${Math.round((SUMMARY.escalated / SUMMARY.totalTickets) * 100)}%)`, icon: AlertTriangle, color: "text-warning", bg: "bg-warning-bg" },
  { label: "SLA Compliance", value: `${SUMMARY.slaCompliance}%`, unit: "", icon: TrendingUp, color: "text-info", bg: "bg-info-bg" },
  { label: "Avg AI Confidence", value: `${SUMMARY.avgConfidence}%`, unit: "", icon: Zap, color: "text-primary", bg: "bg-primary-light" },
  { label: "Avg Resolution Time", value: SUMMARY.avgResolutionTime, unit: "", icon: Clock, color: "text-success", bg: "bg-success-bg" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-elevated text-xs p-2.5 min-w-[120px]">
      <div className="font-semibold text-foreground mb-1.5">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const autoEscData = [
    { name: "Auto-Resolved", value: SUMMARY.autoResolved },
    { name: "Escalated", value: SUMMARY.escalated },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform-wide metrics for the last 30 days.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="card-surface p-3.5">
            <div className={cn("w-7 h-7 rounded-md flex items-center justify-center mb-2.5", card.bg)}>
              <card.icon className={cn("w-3.5 h-3.5", card.color)} />
            </div>
            <div className="text-xl font-bold text-foreground tracking-tight">
              {card.value}{card.unit}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-5">
        {/* Weekly volume */}
        <div className="col-span-2 card-surface p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_DATA.weeklyTrend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 13%, 44%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 13%, 44%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="auto" name="Auto-Resolved" fill={CHART_COLORS.success} radius={[3, 3, 0, 0]} />
              <Bar dataKey="escalated" name="Escalated" fill={CHART_COLORS.warning} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS.success }} />Auto-Resolved</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS.warning }} />Escalated</div>
          </div>
        </div>

        {/* Auto vs escalated pie */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Resolution Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={autoEscData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                <Cell fill={CHART_COLORS.success} />
                <Cell fill={CHART_COLORS.warning} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.success }} />Auto ({Math.round((SUMMARY.autoResolved / SUMMARY.totalTickets) * 100)}%)</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.warning }} />Human ({Math.round((SUMMARY.escalated / SUMMARY.totalTickets) * 100)}%)</div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-3 gap-5">
        {/* Category breakdown */}
        <div className="col-span-2 card-surface p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Auto-Resolution Rate by Category</h3>
          <div className="space-y-2.5">
            {ANALYTICS_DATA.categoryBreakdown.sort((a, b) => b.autoRate - a.autoRate).map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-36 truncate">{cat.name}</span>
                <div className="flex-1 h-5 bg-muted rounded-md overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{
                      width: `${cat.autoRate}%`,
                      backgroundColor: cat.autoRate >= 85 ? CHART_COLORS.success : cat.autoRate >= 65 ? CHART_COLORS.warning : CHART_COLORS.destructive,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-10 text-right">{cat.autoRate}%</span>
                <span className="text-xs text-muted-foreground w-12 text-right">{cat.count} tickets</span>
              </div>
            ))}
          </div>
        </div>

        {/* SLA trend */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">SLA Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ANALYTICS_DATA.slaTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(215, 13%, 44%)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: "hsl(215, 13%, 44%)" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="compliance" name="SLA %" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-muted-foreground text-center">6-week rolling average</div>
        </div>
      </div>

      {/* Confidence distribution */}
      <div className="card-surface p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">AI Confidence Score Distribution</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={ANALYTICS_DATA.confidenceDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(215, 13%, 44%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 13%, 44%)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Tickets" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-6 text-xs text-muted-foreground">
          <div>Tickets with &gt;80% confidence: <span className="font-semibold text-success">107 (43%)</span></div>
          <div>Below threshold (&lt;80%): <span className="font-semibold text-warning">141 (57%)</span></div>
          <div>Force-escalated by business critical flag: <span className="font-semibold text-destructive">6</span></div>
        </div>
      </div>
    </div>
  );
}
