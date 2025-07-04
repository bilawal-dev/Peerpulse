## PeerPulse – 360° Performance Review & Feedback Platform

### What Is PeerPulse?
PeerPulse is a cloud-based HR platform that lets companies design, run, and analyse end-to-end performance review cycles.  It automates the entire 360° feedback workflow – from employee onboarding, peer selection, and review collection to delivering compiled insights to HR, managers, and employees.

> **Audience**: HR teams, People-Ops, and organisational leaders who want a repeatable, data-driven process for continuous employee development.

---

### Core Capability Map
1. **Multi-Company Tenancy**  
   • Each company registers its own secure space inside PeerPulse.  
   • Independent branding, employee directory, review cycles, and data.

2. **Credit-Based Billing**  
   * In each reviewCylce based on how many employees are there, we calculate the cost
   * cost = number of employees * 10$ ,
   * and then you can do everytinhg
   * if employeees are uploaded but paymetn is not paid, so we restrict that reviewCylce for enabling peer_selection and review_forms

3. **Company (HR) Dashboard**
   **a. Review-Cycle Builder**  
   • Define cycle *name*, *start & end dates*, *max peers an employee can pick*, and *max reviews required*.  
   • Independently toggle *Peer-Selection Enabled* and *Review Enabled* flags to control phase timing.  
   • Launch unlimited concurrent or sequential cycles – historical data always retained.

   **b. Employee Management**  
   • Bulk import via CSV or manage individuals with full CRUD tools.  
   • Invite all or selected employees with one click; credentials delivered automatically via email.  
   • Employee status tracked per cycle: **Initial Upload → Invited → Peer Selected → Review Given**.

   **c. Automated & Manual Pairing**  
   • One-click algorithm assigns reviewers based on who works together most closely.  
   • Interactive drag-and-drop interface lets HR fine-tune pairings before the review phase opens.

   **d. Questionnaire Designer**  
   • Starts with best-practice default questions (Self, Peer, Manager tracks).  
   • HR can edit wording, add new items, change order, and set character limits.  
   • When **Review Enabled** is activated the form locks to guarantee consistency.

   **e. Reminder & Notification Centre**  
   • Schedule *Initial, 1st, 2nd,* and *Final* reminders for both the peer-selection and review windows.  
   • System auto-enables the relevant phase if it is not yet open when the first reminder fires.  
   • Real-time in-app notifications keep everyone informed.

   **f. Monitoring & Reporting**  
   • Live progress widgets: total employees, peer-selection completed/pending, reviews completed/pending.  
   • **Compiled Review Reports** combine an employee's self-assessment with peer and manager feedback.  
   • HR can share compiled reports with managers; managers can optionally pass them on to direct reports.

4. **Employee Dashboard**  
   • Single login can participate in multiple companies and cycles.  
   • Clear timeline and countdown for each active cycle.  
   • Guided peer-selection flow – validates maximum peers instantly.  
   • Adaptive review form that shows only the required sections (self, each peer, manager).  
   • Access to compiled report once HR/manager grants visibility.

5. **Manager Dashboard**  
   • Everything in the Employee view **plus** team overview panels.  
   • View subordinate compiled reports and prepare for 1-on-1 discussions.  
   • Receive HR triggers to start feedback conversations.

6. **Automated Email Engine**  
   • Branded HTML emails (logo, colours) for invitations, reminders, and report notifications.  
   • Respect company time-zone; schedule runs locally so emails land at appropriate hours.

7. **Secure Role-Based Access**  
   • JWT-protected APIs enforce distinct scopes for Admin, Manager, and Employee.  
   • Strict data isolation – users only see information for their company and authorised cycles.

---

### Typical Workflow Walkthrough
1. **Register & Purchase Credits**  
   HR creates a company account, selects a subscription plan, and buys credits.

2. **Create a Review Cycle**  
   HR sets dates, limits, and toggles peer selection OFF (by default).  Default self/peer/manager questions are auto-seeded.

3. **Upload Employees**  
   CSV import brings in employees, departments, and reporting lines (manager relationships).  All employees start in *Initial Upload* state.

4. **Invite Employees**  
   HR clicks *Invite All*; employees receive credentials and enter the *Invited* state.

5. **Enable Peer Selection & Send Reminder(s)**  
   HR flips *Peer-Selection Enabled* or waits for the first scheduled reminder – employees pick peers (max limit enforced).  Status moves to *Peer Selected*.

6. **Automated Pairing + Manual Tweaks**  
   HR runs the pairing engine.  Optional manual drag-and-drop adjustments ensure relevant reviewers.

7. **Enable Review Phase & Notify**  
   HR enables reviews (or the system does it automatically via the first review reminder).  Employees fill in self, peer, and manager assessments.  Once complete status becomes *Review Given*.

8. **Analyse Compiled Reports**  
   HR watches live completion stats, then opens the Compiled Review area.  They notify managers, who meet with employees armed with holistic feedback.

9. **Share Reports with Employees**  
   When ready, HR/Managers toggle report access on.  Employees read the same PDF-style report from their dashboard.

10. **Start Next Cycle**  
    HR can duplicate settings or create a fresh cycle; past data remains searchable forever.

---

### Value Proposition
• **Full 360° Coverage** – self, peer, and manager perspectives organised in one place.  
• **Automation First** – reminders, phase toggles, and pairing reduce manual HR overhead.  
• **Flexible Yet Controlled** – admins can customise questions & pairings while preserving reporting integrity.  
• **Transparent Pricing** – credit-based model scales with headcount.  
• **Actionable Insights** – compiled reports surface strengths, growth areas, and team trends for better talent decisions.

---

### At A Glance
| Stakeholder | Key Benefit |
|-------------|-------------|
| HR / People-Ops | End-to-end workflow automation, compliance, and powerful analytics |
| Managers | Consolidated team feedback and readiness for development conversations |
| Employees | Simple interface to select peers, submit reviews, and view results |
| C-Level | Consistent performance data to inform promotions, compensation, and succession planning |

---

*This document focuses on functional capabilities.  For technical stack and API details, refer to the developer documentation.* 