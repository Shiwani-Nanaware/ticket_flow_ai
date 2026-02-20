// Human Review Dashboard (HITL Panel)
import { useState } from "react";
import { MOCK_TICKETS } from "@/data/mockData";
import { CheckCircle, Edit3, XCircle, AlertTriangle, Clock, User, ChevronRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import ExplainabilityPanel from "@/components/ExplainabilityPanel";
import type { Ticket } from "@/data/mockData";

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: "status-info",
    medium: "status-warning",
    high: "status-error",
    critical: "bg-destructive text-destructive-foreground",
  };
  return <span className={cn("px-2 py-0.5 rounded text-xs font-semibold capitalize", styles[priority] ?? "status-info")}>{priority}</span>;
}

const REVIEW_STATUSES = ["pending_review", "escalated"];

export default function HumanReview() {
  const reviewTickets = MOCK_TICKETS.filter((t) => REVIEW_STATUSES.includes(t.status));
  const [selected, setSelected] = useState<Ticket>(reviewTickets[0]);
  const [actionTaken, setActionTaken] = useState<Record<string, string>>({});
  const [modifyText, setModifyText] = useState("");
  const [showModify, setShowModify] = useState(false);

  const handleAction = (action: "approve" | "modify" | "override") => {
    setActionTaken({ ...actionTaken, [selected.id]: action });
    if (action === "modify") { setShowModify(true); return; }
    setShowModify(false);
  };

  const handleConfirmModify = () => {
    setActionTaken({ ...actionTaken, [selected.id]: "modify" });
    setShowModify(false);
  };

  const actionLabel = actionTaken[selected?.id];

  const confidenceColor = selected?.confidenceScore >= 80 ? "bg-success" : selected?.confidenceScore >= 60 ? "bg-warning" : "bg-destructive";
  const confidenceText = selected?.confidenceScore >= 80 ? "text-success" : selected?.confidenceScore >= 60 ? "text-warning" : "text-destructive";

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">Human Review — HITL Panel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          <span className="font-medium text-warning">{reviewTickets.length}</span> tickets require human decision. AI confidence was below threshold or ticket is business critical.
        </p>
      </div>

      <div className="flex gap-5 h-[calc(100vh-200px)]">
        {/* Ticket list */}
        <div className="w-72 flex-shrink-0 card-surface overflow-y-auto">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Queued for Review ({reviewTickets.length})</p>
          </div>
          <div className="divide-y divide-border">
            {reviewTickets.map((ticket) => {
              const action = actionTaken[ticket.id];
              return (
                <button
                  key={ticket.id}
                  onClick={() => { setSelected(ticket); setShowModify(false); }}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors",
                    selected?.id === ticket.id && "bg-primary-light border-l-2 border-primary"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-primary">{ticket.id}</span>
                    {action ? (
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", action === "approve" ? "status-success" : action === "override" ? "status-error" : "status-info")}>
                        {action === "approve" ? "Approved" : action === "override" ? "Overridden" : "Modified"}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    )}
                  </div>
                  <p className="text-xs text-foreground font-medium leading-snug line-clamp-2">{ticket.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <PriorityBadge priority={ticket.priority} />
                    {ticket.businessCritical && (
                      <span className="text-[10px] text-destructive font-medium">Business Critical</span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <div className="h-1 rounded-full bg-muted flex-1">
                      <div
                        className={cn("h-full rounded-full", ticket.confidenceScore >= 80 ? "bg-success" : ticket.confidenceScore >= 60 ? "bg-warning" : "bg-destructive")}
                        style={{ width: `${ticket.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{ticket.confidenceScore}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="flex-1 grid grid-cols-2 gap-5 min-h-0">
            {/* Left: Ticket details */}
            <div className="card-surface overflow-y-auto flex flex-col">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-semibold text-primary">{selected.id}</div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">{selected.title}</div>
                </div>
                {selected.businessCritical && (
                  <div className="flex items-center gap-1 status-error px-2 py-1 rounded-md text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" /> Critical
                  </div>
                )}
              </div>

              <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
                <div>
                  <div className="text-xs font-medium text-foreground mb-1.5">Description</div>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-md p-3 border border-border">{selected.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Department</div>
                    <div className="text-xs font-medium text-foreground">{selected.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Priority</div>
                    <PriorityBadge priority={selected.priority} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Category</div>
                    <div className="text-xs font-medium text-foreground">{selected.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">SLA Risk</div>
                    <span className={cn("text-xs font-semibold capitalize", selected.slaRisk === "high" ? "text-destructive" : selected.slaRisk === "medium" ? "text-warning" : "text-success")}>{selected.slaRisk}</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Submitted By</div>
                    <div className="text-xs font-medium text-foreground flex items-center gap-1"><User className="w-3 h-3" />{selected.submittedBy}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Submitted</div>
                    <div className="text-xs font-medium text-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selected.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="border-t border-border pt-4">
                  <div className="text-xs font-semibold text-foreground mb-3">Engineer Actions</div>
                  {actionTaken[selected.id] ? (
                    <div className={cn("rounded-md border px-4 py-3 text-xs", actionTaken[selected.id] === "approve" ? "bg-success-bg border-success/20 text-success" : actionTaken[selected.id] === "override" ? "bg-destructive-bg border-destructive/20 text-destructive" : "bg-info-bg border-info/20 text-info")}>
                      <div className="font-semibold mb-0.5 capitalize">Action taken: {actionTaken[selected.id]}</div>
                      <div>
                        {actionTaken[selected.id] === "approve" && "AI resolution approved and applied."}
                        {actionTaken[selected.id] === "override" && "AI decision overridden. Manual resolution will be applied."}
                        {actionTaken[selected.id] === "modify" && `Resolution modified: ${modifyText || "Custom resolution recorded."}`}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {showModify ? (
                        <div className="space-y-2">
                          <textarea
                            value={modifyText}
                            onChange={(e) => setModifyText(e.target.value)}
                            placeholder="Enter your modified resolution..."
                            rows={3}
                            className="w-full text-xs px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleConfirmModify} className="flex-1 py-1.5 text-xs font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
                              Confirm Modification
                            </button>
                            <button onClick={() => setShowModify(false)} className="px-3 py-1.5 text-xs font-medium border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleAction("approve")}
                            className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleAction("modify")}
                            className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-border rounded-md text-foreground hover:bg-muted transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Modify
                          </button>
                          <button
                            onClick={() => handleAction("override")}
                            className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Override
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: AI panel */}
            <div className="card-surface overflow-y-auto flex flex-col">
              <div className="px-5 py-3.5 border-b border-border">
                <div className="text-sm font-semibold text-foreground">AI Analysis</div>
                <div className="text-xs text-muted-foreground mt-0.5">Automated reasoning and recommendations</div>
              </div>

              <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
                {/* Confidence */}
                <div className="rounded-md border border-border p-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-foreground">AI Confidence Score</span>
                    <span className={cn("font-bold", confidenceText)}>{selected.confidenceScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", confidenceColor)} style={{ width: `${selected.confidenceScore}%` }} />
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {selected.confidenceScore < 80 ? "Below 80% threshold — auto-resolution not safe." : "Above threshold, but flagged for other reasons."}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    AI Reasoning
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-md p-3 border border-border">
                    {selected.aiReasoning ?? "No reasoning available."}
                  </div>
                </div>

                {/* Suggested resolution */}
                <div>
                  <div className="text-xs font-semibold text-foreground mb-2">Suggested Resolution</div>
                  {selected.resolution ? (
                    <div className="text-xs text-muted-foreground bg-primary-light border border-primary/20 rounded-md p-3 leading-relaxed">
                      {selected.resolution}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground bg-muted/30 border border-border rounded-md p-3 italic">
                      No automated resolution generated. Manual investigation required.
                    </div>
                  )}
                </div>

                {/* Explainability */}
                <ExplainabilityPanel ticket={selected} defaultOpen />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
