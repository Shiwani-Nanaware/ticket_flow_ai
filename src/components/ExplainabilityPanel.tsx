// Explainability Panel — AI decision explanation component (reusable)
import { useState } from "react";
import { ChevronDown, ChevronUp, Tag, GitBranch, AlertTriangle, Clock } from "lucide-react";
import type { Ticket } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ExplainabilityPanelProps {
  ticket: Ticket;
  defaultOpen?: boolean;
}

export default function ExplainabilityPanel({ ticket, defaultOpen = false }: ExplainabilityPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  const confidenceColor = ticket.confidenceScore >= 80 ? "bg-success" : ticket.confidenceScore >= 60 ? "bg-warning" : "bg-destructive";
  const confidenceText = ticket.confidenceScore >= 80 ? "text-success" : ticket.confidenceScore >= 60 ? "text-warning" : "text-destructive";

  const slaColors: Record<string, string> = {
    low: "status-success",
    medium: "status-warning",
    high: "status-error",
  };

  return (
    <div className="border border-border rounded-md overflow-hidden text-xs">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <GitBranch className="w-3.5 h-3.5 text-primary" />
          AI Explainability
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="p-3 space-y-3 bg-card">
          {/* Confidence */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className={cn("font-semibold", confidenceText)}>{ticket.confidenceScore}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div className={cn("h-full rounded-full", confidenceColor)} style={{ width: `${ticket.confidenceScore}%` }} />
            </div>
          </div>

          {/* RSI */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Resolution Stability Index (RSI)</span>
              <span className="font-semibold text-foreground">{ticket.rsiScore}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", ticket.rsiScore >= 80 ? "bg-success" : ticket.rsiScore >= 60 ? "bg-warning" : "bg-destructive")}
                style={{ width: `${ticket.rsiScore}%` }}
              />
            </div>
          </div>

          {/* SLA Risk */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3 h-3" />
              SLA Risk
            </div>
            <span className={cn("px-2 py-0.5 rounded font-medium capitalize", slaColors[ticket.slaRisk])}>{ticket.slaRisk}</span>
          </div>

          {/* Keywords */}
          {ticket.keywords && ticket.keywords.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Tag className="w-3 h-3" />
                Keywords Detected
              </div>
              <div className="flex flex-wrap gap-1">
                {ticket.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-medium">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Similar tickets */}
          {ticket.similarTickets && ticket.similarTickets.length > 0 && (
            <div>
              <div className="text-muted-foreground mb-1.5">Similar Tickets (Top Matches)</div>
              <div className="space-y-1.5">
                {ticket.similarTickets.map((st) => (
                  <div key={st.id} className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                    <div className="flex justify-between">
                      <span className="font-mono font-semibold text-primary">{st.id}</span>
                      <span className="font-semibold text-success">{st.similarity}%</span>
                    </div>
                    <p className="text-muted-foreground truncate mt-0.5">{st.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decision path */}
          {ticket.decisionPath && ticket.decisionPath.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <GitBranch className="w-3 h-3" />
                Decision Path
              </div>
              <div className="space-y-1">
                {ticket.decisionPath.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5">{i + 1}</span>
                    <span className={cn("leading-tight", step.startsWith("Decision:") ? "font-semibold text-foreground" : "text-muted-foreground")}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
