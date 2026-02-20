// Auto-Resolved Dashboard — Tickets resolved automatically by the AI engine
import { useState } from "react";
import { MOCK_TICKETS } from "@/data/mockData";
import { Search, Filter, CheckCircle, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ExplainabilityPanel from "@/components/ExplainabilityPanel";
import type { Ticket } from "@/data/mockData";

const AUTO_STATUSES = ["auto_resolved", "approved"];

function ConfidenceBar({ score }: { score: number }) {
  const colorClass = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="confidence-bar w-20">
        <div className={cn("h-full rounded-full", colorClass)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-medium text-foreground">{score}%</span>
    </div>
  );
}

function SlaChip({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    low: "status-success",
    medium: "status-warning",
    high: "status-error",
  };
  return <span className={cn("px-2 py-0.5 rounded text-xs font-medium capitalize", styles[risk] ?? "status-info")}>{risk}</span>;
}

export default function AutoResolved() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Ticket>("confidenceScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const autoTickets = MOCK_TICKETS.filter((t) => AUTO_STATUSES.includes(t.status));
  const categories = ["All", ...Array.from(new Set(autoTickets.map((t) => t.category)))];

  const filtered = autoTickets
    .filter((t) => {
      const q = search.toLowerCase();
      return (
        (category === "All" || t.category === category) &&
        (t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.department.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const av = a[sortField] as number | string;
      const bv = b[sortField] as number | string;
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: keyof Ticket }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-muted-foreground/40" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Auto-Resolved Tickets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-medium text-success">{autoTickets.length}</span> tickets resolved automatically by the AI engine.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-md px-3 py-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-success" />
          Auto-resolution threshold: 80% confidence
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full text-sm pl-8 pr-3 py-1.5 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Category:</span>
          <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  category === cat ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5">
                <button onClick={() => handleSort("id")} className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  Ticket ID <SortIcon field="id" />
                </button>
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-2.5">
                <button onClick={() => handleSort("category")} className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  Category <SortIcon field="category" />
                </button>
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Department</th>
              <th className="text-left px-4 py-2.5">
                <button onClick={() => handleSort("confidenceScore")} className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  Confidence <SortIcon field="confidenceScore" />
                </button>
              </th>
              <th className="text-left px-4 py-2.5">
                <button onClick={() => handleSort("similarityScore")} className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  Similarity <SortIcon field="similarityScore" />
                </button>
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">SLA Risk</th>
              <th className="text-left px-4 py-2.5">
                <button onClick={() => handleSort("rsiScore")} className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  RSI <SortIcon field="rsiScore" />
                </button>
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => (
              <>
                <tr
                  key={ticket.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                >
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-primary">{ticket.id}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-xs font-medium text-foreground truncate max-w-[200px]">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">{ticket.submittedBy}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">{ticket.category}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{ticket.department}</td>
                  <td className="px-4 py-3"><ConfidenceBar score={ticket.confidenceScore} /></td>
                  <td className="px-4 py-3"><ConfidenceBar score={ticket.similarityScore} /></td>
                  <td className="px-4 py-3"><SlaChip risk={ticket.slaRisk} /></td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{ticket.rsiScore}</td>
                  <td className="px-4 py-3">
                    <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", expandedId === ticket.id && "rotate-90")} />
                  </td>
                </tr>
                {expandedId === ticket.id && (
                  <tr key={`${ticket.id}-exp`} className="bg-muted/10">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold text-foreground mb-1.5">Resolution Applied</div>
                          <div className="text-xs text-muted-foreground bg-card border border-border rounded-md p-3 leading-relaxed">
                            {ticket.resolution ?? "—"}
                          </div>
                        </div>
                        <div>
                          <ExplainabilityPanel ticket={ticket} defaultOpen />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No tickets match your filters.</div>
        )}
      </div>
    </div>
  );
}
