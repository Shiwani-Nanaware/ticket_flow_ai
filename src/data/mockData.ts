// TicketFlow AI — Mock Data Layer
// Simulates backend API responses for the frontend prototype

export type TicketStatus = "auto_resolved" | "pending_review" | "approved" | "overridden" | "escalated";
export type Priority = "low" | "medium" | "high" | "critical";
export type Category = "Password Reset" | "Network Issue" | "Software Install" | "Hardware Failure" | "Access Request" | "Email Issue" | "VPN Problem" | "Database Error" | "Security Alert" | "Other";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: Priority;
  category: Category;
  status: TicketStatus;
  businessCritical: boolean;
  submittedAt: string;
  resolvedAt?: string;
  submittedBy: string;
  confidenceScore: number; // 0-100
  similarityScore: number; // 0-100
  slaRisk: "low" | "medium" | "high";
  resolution?: string;
  aiReasoning?: string;
  keywords?: string[];
  similarTickets?: SimilarTicket[];
  decisionPath?: string[];
  rsiScore: number; // Resolution Stability Index 0-100
}

export interface SimilarTicket {
  id: string;
  title: string;
  similarity: number;
  resolution: string;
  resolvedAt: string;
}

export interface AuditLog {
  id: string;
  ticketId: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

export interface AnalyticsSummary {
  totalTickets: number;
  autoResolved: number;
  escalated: number;
  pendingReview: number;
  avgConfidence: number;
  slaCompliance: number;
  avgResolutionTime: string;
}

const SIMILAR_TICKETS_DB: SimilarTicket[] = [
  { id: "TF-0021", title: "User cannot reset password via portal", similarity: 94, resolution: "Sent password reset link via admin console. User confirmed access.", resolvedAt: "2024-01-10" },
  { id: "TF-0045", title: "AD password expired for remote worker", similarity: 88, resolution: "Forced AD password reset, updated MFA token.", resolvedAt: "2024-01-14" },
  { id: "TF-0067", title: "VPN disconnects every 30 minutes", similarity: 91, resolution: "Updated split-tunneling config and pushed policy update.", resolvedAt: "2024-01-18" },
  { id: "TF-0089", title: "Can't access SharePoint files from home", similarity: 79, resolution: "Re-enrolled device in Intune and applied conditional access policy.", resolvedAt: "2024-01-22" },
  { id: "TF-0102", title: "Outlook not syncing calendar on mobile", similarity: 85, resolution: "Cleared cache, re-added Exchange account via MDM profile.", resolvedAt: "2024-01-25" },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "TF-1001", title: "Cannot reset my Active Directory password", description: "I am unable to reset my AD password through the self-service portal. The reset link is not arriving in my email.", department: "Finance", priority: "medium", category: "Password Reset", status: "auto_resolved", businessCritical: false, submittedAt: "2024-02-15T09:23:00Z", resolvedAt: "2024-02-15T09:24:12Z", submittedBy: "james.carter@corp.com", confidenceScore: 94, similarityScore: 91, slaRisk: "low", resolution: "Automated password reset triggered via LDAP. Confirmation email dispatched. User account unlocked in AD.", aiReasoning: "High similarity match with 47 previous password reset tickets. Standard resolution pattern identified with 94% confidence. Business impact is low, no SLA risk detected. Auto-resolution approved.", keywords: ["password", "reset", "AD", "self-service", "email"], similarTickets: [SIMILAR_TICKETS_DB[0], SIMILAR_TICKETS_DB[1]], decisionPath: ["Ticket classified: Password Reset (conf: 96%)", "Similarity search: 47 matches found (avg: 91%)", "SLA risk assessed: LOW", "Business critical: NO", "RSI score: 89 — stable pattern", "Decision: AUTO RESOLVE"], rsiScore: 89,
  },
  {
    id: "TF-1002", title: "VPN connection drops intermittently during work hours", description: "Our entire Singapore office experiences VPN drops between 9-11 AM daily. Affecting 45 users. Critical for trading operations.", department: "Operations", priority: "critical", category: "VPN Problem", status: "pending_review", businessCritical: true, submittedAt: "2024-02-15T10:15:00Z", submittedBy: "sarah.wong@corp.com", confidenceScore: 51, similarityScore: 67, slaRisk: "high", resolution: undefined, aiReasoning: "Ticket affects 45+ users in a single office during specific time window. Pattern suggests infrastructure-level issue (BGP route flap or ISP throttling). Business critical flag set. Confidence below threshold. Requires senior network engineer review.", keywords: ["VPN", "intermittent", "Singapore", "office-wide", "trading"], similarTickets: [SIMILAR_TICKETS_DB[2], SIMILAR_TICKETS_DB[3]], decisionPath: ["Ticket classified: VPN Problem (conf: 79%)", "Similarity search: 12 partial matches (avg: 67%)", "SLA risk assessed: HIGH — affects 45 users", "Business critical: YES", "RSI score: 52 — unstable pattern", "Decision: ESCALATE TO HUMAN"], rsiScore: 52,
  },
  {
    id: "TF-1003", title: "Request access to Salesforce Production environment", description: "I need read-only access to Salesforce Production to generate quarterly reports for the CFO presentation.", department: "Finance", priority: "medium", category: "Access Request", status: "auto_resolved", businessCritical: false, submittedAt: "2024-02-14T14:30:00Z", resolvedAt: "2024-02-14T14:31:45Z", submittedBy: "michael.chang@corp.com", confidenceScore: 87, similarityScore: 83, slaRisk: "low", resolution: "Read-only Salesforce role 'Report_Viewer' provisioned via Okta workflow. Access confirmed active.", aiReasoning: "Standard access provisioning request. Role is pre-approved for Finance department per IAM policy P-2024-003. No elevated permissions requested. Auto-provisioned via Okta integration.", keywords: ["Salesforce", "access", "read-only", "Finance", "Okta"], similarTickets: [SIMILAR_TICKETS_DB[3]], decisionPath: ["Ticket classified: Access Request (conf: 91%)", "IAM policy check: P-2024-003 APPROVED for Finance", "Similarity search: 23 matches (avg: 83%)", "SLA risk assessed: LOW", "Business critical: NO", "RSI score: 85 — stable pattern", "Decision: AUTO RESOLVE"], rsiScore: 85,
  },
  {
    id: "TF-1004", title: "Database server CPU at 98% — Production down", description: "Our primary PostgreSQL production database is at 98% CPU. Customer-facing API is timing out. Revenue impact: ~$50k/hour.", department: "Engineering", priority: "critical", category: "Database Error", status: "escalated", businessCritical: true, submittedAt: "2024-02-15T11:00:00Z", submittedBy: "dev-ops-alert@corp.com", confidenceScore: 28, similarityScore: 34, slaRisk: "high", resolution: undefined, aiReasoning: "Critical production incident with direct revenue impact. No reliable resolution pattern found in historical data (similarity < 40%). Root cause is ambiguous — could be runaway query, DDoS, or hardware failure. Immediate DBA and SRE escalation required.", keywords: ["database", "CPU", "production", "outage", "PostgreSQL", "revenue"], similarTickets: [], decisionPath: ["Ticket classified: Database Error (conf: 61%)", "Similarity search: 3 weak matches (avg: 34%)", "SLA risk assessed: CRITICAL", "Business critical: YES", "RSI score: 28 — no stable pattern", "Decision: IMMEDIATE ESCALATION"], rsiScore: 28,
  },
  {
    id: "TF-1005", title: "Outlook 365 not loading on MacBook after update", description: "After the latest macOS Sonoma update, Outlook crashes on startup. Affects only my machine.", department: "Marketing", priority: "low", category: "Software Install", status: "auto_resolved", businessCritical: false, submittedAt: "2024-02-13T08:45:00Z", resolvedAt: "2024-02-13T08:46:30Z", submittedBy: "lisa.taylor@corp.com", confidenceScore: 91, similarityScore: 88, slaRisk: "low", resolution: "Cleared Outlook profile cache, re-registered COM add-ins. Pushed clean config profile via MDM. Verified launch successful.", aiReasoning: "Post-macOS update Outlook crash is a well-documented pattern (47 similar tickets this month). Standard cache-clear + MDM profile resolution has 91% success rate.", keywords: ["Outlook", "macOS", "crash", "update", "MDM"], similarTickets: [SIMILAR_TICKETS_DB[4]], decisionPath: ["Ticket classified: Software Install (conf: 94%)", "Similarity search: 47 matches (avg: 88%)", "SLA risk assessed: LOW", "Business critical: NO", "RSI score: 91 — highly stable pattern", "Decision: AUTO RESOLVE"], rsiScore: 91,
  },
  {
    id: "TF-1006", title: "Suspicious login attempts from unknown IPs", description: "Security team flagged multiple failed login attempts from IPs in Eastern Europe on 3 executive accounts. MFA was bypassed on one attempt.", department: "Security", priority: "critical", category: "Security Alert", status: "pending_review", businessCritical: true, submittedAt: "2024-02-15T07:30:00Z", submittedBy: "siem-alert@corp.com", confidenceScore: 42, similarityScore: 29, slaRisk: "high", resolution: undefined, aiReasoning: "Potential credential compromise involving executive accounts. MFA bypass attempt detected — this could indicate SIM swapping or social engineering. Low similarity to historical incidents makes safe auto-resolution impossible. Immediate security team escalation required.", keywords: ["security", "breach", "MFA", "executive", "credential", "Eastern Europe"], similarTickets: [], decisionPath: ["Ticket classified: Security Alert (conf: 78%)", "Similarity search: 2 weak matches (avg: 29%)", "SLA risk assessed: CRITICAL", "Business critical: YES — executive accounts", "RSI score: 19 — unknown pattern", "Decision: IMMEDIATE ESCALATION"], rsiScore: 19,
  },
  {
    id: "TF-1007", title: "New employee laptop setup request — John Smith starts Monday", description: "Please set up a MacBook Pro M3 for new hire John Smith joining the Product team on Monday. Standard developer config needed.", department: "HR", priority: "medium", category: "Hardware Failure", status: "approved", businessCritical: false, submittedAt: "2024-02-14T09:00:00Z", resolvedAt: "2024-02-14T09:02:10Z", submittedBy: "hr-requests@corp.com", confidenceScore: 89, similarityScore: 92, slaRisk: "low", resolution: "MacBook Pro M3 provisioned with standard developer config. Enrolled in Jamf Pro, Xcode installed, dev tools configured. Ready for pickup Friday.", aiReasoning: "Standard new hire provisioning. Developer config template matches 92% of similar requests. Automated via Jamf Pro workflow. HR approved in HRIS.", keywords: ["onboarding", "laptop", "MacBook", "developer", "Jamf"], similarTickets: [], decisionPath: ["Ticket classified: Access Request (conf: 89%)", "HRIS verification: John Smith — confirmed start date", "Similarity search: 31 matches (avg: 92%)", "SLA risk assessed: LOW", "Business critical: NO", "Decision: AUTO RESOLVE"], rsiScore: 93,
  },
  {
    id: "TF-1008", title: "WiFi network not available in Conference Room B", description: "The WiFi network is completely unavailable in Conference Room B. An all-hands meeting is scheduled in 2 hours.", department: "Facilities", priority: "high", category: "Network Issue", status: "pending_review", businessCritical: false, submittedAt: "2024-02-15T12:00:00Z", submittedBy: "facilities@corp.com", confidenceScore: 63, similarityScore: 71, slaRisk: "medium", resolution: undefined, aiReasoning: "Network outage in meeting room with an imminent SLA event (all-hands in 2 hours). Confidence is moderate — could be AP failure, VLAN misconfiguration, or DHCP scope exhaustion. Physical inspection likely required. Flagged for immediate on-site review.", keywords: ["WiFi", "conference room", "network", "all-hands", "AP"], similarTickets: [SIMILAR_TICKETS_DB[2]], decisionPath: ["Ticket classified: Network Issue (conf: 81%)", "Similarity search: 18 matches (avg: 71%)", "SLA risk assessed: MEDIUM — event in 2h", "Business critical: NO", "RSI score: 68 — partial pattern", "Decision: ESCALATE — SLA risk"], rsiScore: 68,
  },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AL-001", ticketId: "TF-1001", action: "AUTO_RESOLVED", actor: "TicketFlow AI Engine", timestamp: "2024-02-15T09:24:12Z", details: "Confidence: 94%. Resolution applied automatically via LDAP integration." },
  { id: "AL-002", ticketId: "TF-1002", action: "ESCALATED", actor: "TicketFlow AI Engine", timestamp: "2024-02-15T10:15:30Z", details: "Business critical flag + confidence 51% triggered escalation. Assigned to: network-team@corp.com" },
  { id: "AL-003", ticketId: "TF-1003", action: "AUTO_RESOLVED", actor: "TicketFlow AI Engine", timestamp: "2024-02-14T14:31:45Z", details: "IAM policy P-2024-003 matched. Role provisioned via Okta." },
  { id: "AL-004", ticketId: "TF-1004", action: "ESCALATED", actor: "TicketFlow AI Engine", timestamp: "2024-02-15T11:00:15Z", details: "Critical severity + low similarity forced immediate escalation. PagerDuty alert sent." },
  { id: "AL-005", ticketId: "TF-1007", action: "APPROVED", actor: "alex.morgan@corp.com", timestamp: "2024-02-14T09:02:10Z", details: "Human engineer approved AI resolution. Jamf workflow confirmed." },
  { id: "AL-006", ticketId: "TF-1005", action: "AUTO_RESOLVED", actor: "TicketFlow AI Engine", timestamp: "2024-02-13T08:46:30Z", details: "MDM profile push successful. Post-resolution verification: PASSED." },
];

export const ANALYTICS_DATA = {
  summary: {
    totalTickets: 248,
    autoResolved: 174,
    escalated: 74,
    pendingReview: 3,
    avgConfidence: 78,
    slaCompliance: 94,
    avgResolutionTime: "2m 34s",
  } as AnalyticsSummary,
  weeklyTrend: [
    { day: "Mon", auto: 28, escalated: 9, total: 37 },
    { day: "Tue", auto: 34, escalated: 11, total: 45 },
    { day: "Wed", auto: 31, escalated: 14, total: 45 },
    { day: "Thu", auto: 42, escalated: 8, total: 50 },
    { day: "Fri", auto: 39, escalated: 12, total: 51 },
    { day: "Sat", auto: 0, escalated: 0, total: 0 },
    { day: "Sun", auto: 0, escalated: 0, total: 0 },
  ],
  categoryBreakdown: [
    { name: "Password Reset", count: 67, autoRate: 97 },
    { name: "Access Request", count: 48, autoRate: 89 },
    { name: "Software Install", count: 39, autoRate: 92 },
    { name: "Network Issue", count: 35, autoRate: 63 },
    { name: "VPN Problem", count: 28, autoRate: 71 },
    { name: "Email Issue", count: 22, autoRate: 86 },
    { name: "Database Error", count: 9, autoRate: 22 },
    { name: "Security Alert", count: 7, autoRate: 14 },
    { name: "Hardware Failure", count: 16, autoRate: 75 },
  ],
  confidenceDistribution: [
    { range: "90-100%", count: 58 },
    { range: "80-89%", count: 49 },
    { range: "70-79%", count: 37 },
    { range: "60-69%", count: 28 },
    { range: "50-59%", count: 21 },
    { range: "< 50%", count: 55 },
  ],
  slaTrend: [
    { week: "W1", compliance: 91 },
    { week: "W2", compliance: 89 },
    { week: "W3", compliance: 93 },
    { week: "W4", compliance: 94 },
    { week: "W5", compliance: 96 },
    { week: "W6", compliance: 94 },
  ],
};
