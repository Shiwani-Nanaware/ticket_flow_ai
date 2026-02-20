// Ticket Submission Module
import { useState } from "react";
import { CheckCircle, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPARTMENTS = ["Engineering", "Finance", "HR", "Marketing", "Operations", "Security", "Facilities", "Legal", "Product", "Sales"];

interface FormData {
  title: string;
  description: string;
  department: string;
  businessCritical: boolean;
}

interface AIPreview {
  category: string;
  confidence: number;
  predictedAction: "auto_resolve" | "escalate";
  slaRisk: "low" | "medium" | "high";
  rsiScore: number;
}

function mockAIAnalysis(title: string, desc: string): AIPreview {
  const lower = (title + desc).toLowerCase();
  if (lower.includes("password") || lower.includes("reset")) return { category: "Password Reset", confidence: 93, predictedAction: "auto_resolve", slaRisk: "low", rsiScore: 89 };
  if (lower.includes("security") || lower.includes("breach") || lower.includes("hack")) return { category: "Security Alert", confidence: 38, predictedAction: "escalate", slaRisk: "high", rsiScore: 22 };
  if (lower.includes("database") || lower.includes("db") || lower.includes("sql")) return { category: "Database Error", confidence: 31, predictedAction: "escalate", slaRisk: "high", rsiScore: 30 };
  if (lower.includes("vpn") || lower.includes("network")) return { category: "VPN Problem", confidence: 62, predictedAction: "escalate", slaRisk: "medium", rsiScore: 58 };
  if (lower.includes("access") || lower.includes("permission")) return { category: "Access Request", confidence: 86, predictedAction: "auto_resolve", slaRisk: "low", rsiScore: 82 };
  if (lower.includes("install") || lower.includes("software")) return { category: "Software Install", confidence: 89, predictedAction: "auto_resolve", slaRisk: "low", rsiScore: 87 };
  return { category: "Other", confidence: 55, predictedAction: "escalate", slaRisk: "medium", rsiScore: 50 };
}

export default function TicketSubmission() {
  const [form, setForm] = useState<FormData>({ title: "", description: "", department: "", businessCritical: false });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState<AIPreview | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleAnalyze = () => {
    if (!form.title || !form.description) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiPreview(mockAIAnalysis(form.title, form.description));
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setTicketId(`TF-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="max-w-lg mx-auto mt-10 card-surface p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Ticket Submitted</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your ticket <span className="font-mono font-semibold text-primary">{ticketId}</span> has been received and is being processed by the AI engine.
          </p>
          {aiPreview && (
            <div className={cn("rounded-lg border px-4 py-3 mb-5 text-left text-xs", aiPreview.predictedAction === "auto_resolve" ? "bg-success-bg border-success/20" : "bg-warning-bg border-warning/20")}>
              <div className="font-medium text-foreground mb-1">AI Predicted Action</div>
              <div className="text-muted-foreground">
                {aiPreview.predictedAction === "auto_resolve"
                  ? `Auto-resolution will be attempted with ${aiPreview.confidence}% confidence. Expected resolution in under 2 minutes.`
                  : `Ticket will be escalated to a human engineer. Confidence (${aiPreview.confidence}%) is below auto-resolve threshold.`}
              </div>
            </div>
          )}
          <button
            onClick={() => { setSubmitted(false); setForm({ title: "", description: "", department: "", businessCritical: false }); setAiPreview(null); }}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            Submit Another Ticket
          </button>
        </div>
      </div>
    );
  }

  const slaColor = { low: "text-success", medium: "text-warning", high: "text-destructive" };
  const actionColor = { auto_resolve: "status-success", escalate: "status-warning" };
  const confidenceColor = aiPreview ? (aiPreview.confidence >= 80 ? "bg-success" : aiPreview.confidence >= 60 ? "bg-warning" : "bg-destructive") : "";

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-foreground">Submit Support Ticket</h1>
          <p className="text-sm text-muted-foreground mt-0.5">The AI engine will classify, assess, and route your ticket automatically.</p>
        </div>

        <div className="grid grid-cols-5 gap-5">
          {/* Form */}
          <form onSubmit={handleSubmit} className="col-span-3 card-surface p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Ticket Title <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setAiPreview(null); }}
                placeholder="Brief description of the issue"
                className="w-full text-sm px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Description <span className="text-destructive">*</span></label>
              <textarea
                value={form.description}
                onChange={(e) => { setForm({ ...form, description: e.target.value }); setAiPreview(null); }}
                placeholder="Provide detailed context. Include error messages, affected users, and business impact."
                rows={5}
                className="w-full text-sm px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Department <span className="text-destructive">*</span></label>
              <div className="relative">
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full text-sm px-3 py-2 pr-8 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                  required
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Business critical toggle */}
            <div className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30">
              <div>
                <div className="text-xs font-medium text-foreground">Business Critical</div>
                <div className="text-xs text-muted-foreground">Marks ticket for immediate human review regardless of AI confidence</div>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, businessCritical: !form.businessCritical })}
                className={cn(
                  "relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none",
                  form.businessCritical ? "bg-destructive" : "bg-muted-foreground/30"
                )}
              >
                <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform", form.businessCritical ? "translate-x-4" : "translate-x-0")} />
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!form.title || !form.description || isAnalyzing}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-md text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {isAnalyzing ? "Analyzing..." : "Preview AI Analysis"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 ml-auto"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>

          {/* AI Preview Panel */}
          <div className="col-span-2 space-y-4">
            {aiPreview ? (
              <div className="card-surface p-4 space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <h3 className="text-xs font-semibold text-foreground">AI Pre-Analysis</h3>
                  <span className="text-xs text-muted-foreground ml-auto">Live prediction</span>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Predicted Category</div>
                  <div className="text-sm font-semibold text-foreground">{aiPreview.category}</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Confidence Score</span>
                    <span className="font-semibold text-foreground">{aiPreview.confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div className={cn("h-full rounded-full", confidenceColor)} style={{ width: `${aiPreview.confidence}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Resolution Stability Index</span>
                    <span className="font-semibold text-foreground">{aiPreview.rsiScore}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div className={cn("h-full rounded-full", aiPreview.rsiScore >= 80 ? "bg-success" : aiPreview.rsiScore >= 60 ? "bg-warning" : "bg-destructive")} style={{ width: `${aiPreview.rsiScore}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground">SLA Risk</span>
                  <span className={cn("font-semibold capitalize", slaColor[aiPreview.slaRisk])}>{aiPreview.slaRisk}</span>
                </div>

                <div className="flex justify-between text-xs items-center">
                  <span className="text-muted-foreground">Predicted Action</span>
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", actionColor[aiPreview.predictedAction])}>
                    {aiPreview.predictedAction === "auto_resolve" ? "Auto Resolve" : "Escalate to Human"}
                  </span>
                </div>

                {form.businessCritical && (
                  <div className="rounded-md bg-destructive-bg border border-destructive/20 px-3 py-2 text-xs text-destructive">
                    Business critical flag will override AI decision and force human review.
                  </div>
                )}
              </div>
            ) : (
              <div className="card-surface p-4">
                <div className="text-center py-8">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Fill in the form and click "Preview AI Analysis" to see how the AI will classify this ticket.</p>
                </div>
              </div>
            )}

            {/* Decision logic card */}
            <div className="card-surface p-4">
              <h4 className="text-xs font-semibold text-foreground mb-3">Decision Logic</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-success-bg text-success flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">A</span>
                  <span>High confidence (&gt;80%) + Low SLA risk + High similarity + Not business critical = AUTO RESOLVE</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-warning-bg text-warning flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">E</span>
                  <span>Any condition fails = ESCALATE TO HUMAN REVIEW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
