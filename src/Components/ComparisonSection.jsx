import { useState } from "react";
import DemoButtons from "./Utiilities/DemoButtons";

const colors = {
    navy: "#0B1F3A",
    navy2: "#122742",
    blue: "#1565C0",
    blueL: "#1976D2",
    accent: "#00B4D8",
    accent2: "#0096C7",
    white: "#ffffff",
    gray50: "#F8FAFC",
    gray100: "#EEF2F7",
    gray300: "#CBD5E1",
    gray600: "#64748B",
    gray800: "#1E293B",
};

const tabs = [
    { id: "adoption", label: "User Adoption" },
    { id: "security", label: "Security & Compliance" },
    { id: "integration", label: "Integration" },
    { id: "cost", label: "Cost & IT Overhead" },
    { id: "features", label: "Contract Features" },
];

const panelData = {
    adoption: [
        {
            category: "LEARNING CURVE",
            bad: "New interface and workflows often require additional employee training",
            good: "Works within SharePoint, Teams, and Outlook, tools employees already use",
        },
        {
            category: "ADOPTION SPEED",
            bad: "Teams may need time to become familiar with a separate expense platform",
            good: "Familiar Microsoft 365 experience helps teams start using the system faster",
        },
        {
            category: "COLLABORATION",
            bad: "Expense discussions may move between the application, email, and other communication tools",
            good: "Review and discuss expenses through Microsoft Teams and Outlook within the Microsoft ecosystem ",
        },
        {
            category: "MOBILE & REMOTE ACCESS",
            bad: "Separate mobile applications or platform sign-in may be required ",
            good: "Employees can work through supported Microsoft 365 experiences from different locations",
        },
    ],
    security: [
        {
            category: "DATA ENVIRONMENT ",
            bad: "Expense information is typically maintained within the vendor's separate environment ",
            good: "Expense information stays connected with the organization's Microsoft 365 and SharePoint environment ",
        },
        {
            category: "ACCESS CONTROL",
            bad: "Permissions must be configured and maintained separately inside another platform",
            good: "Role-based permissions support controlled handling of expense information within the Microsoft environment",
        },
        {
            category: "AUDIT TRAIL",
            bad: "Audit information depends on the standalone application's own controls and reporting ",
            good: "SharePoint records and expense activity provide structured visibility for finance and governance reviews",
        },
        {
            category: "COMPLIANCE STANDARD",
            bad: "Organizations must evaluate the security controls of an additional software provider",
            good: "Built around Microsoft 365 security controls with Apps365 SOC 2 Type II positioning ",
        },
    ],
    integration: [
        {
            category: "MICROSOFT 365",
            bad: "Microsoft tools may require separate connectors or third-party configuration",
            good: "Works with SharePoint, Microsoft Teams, Outlook, and Microsoft Copilot",
        },
        {
            category: "WORKFLOW AUTOMATION",
            bad: "Expense workflows depend on the application's separate automation tools",
            good: "Connect expense processes with Power Automate for approvals, reminders, and notifications ",
        },
        {
            category: "REPORTING & ANALYTICS",
            bad: "Reporting usually remains inside the expense application's reporting environment ",
            good: "Connect expense information with Power BI for dashboards and spending analysis",
        },
        {
            category: "ACCOUNTING CONNECTIONS",
            bad: "Accounting integrations vary depending on the selected vendor and plan ",
            good: "Connect approved expense information with supported accounting platforms such as QuickBooks and Xero",
        },
    ],
    cost: [
        {
            category: "ADDITIONAL PLATFORM",
            bad: "Adds another business application for employees and IT teams to manage ",
            good: "Works within the organization's existing Microsoft 365 ecosystem ",
        },
        {
            category: "USER MANAGEMENT",
            bad: "User administration may need to be handled separately from Microsoft 365",
            good: "Uses the organization's Microsoft environment for a more connected user experience ",
        },
        {
            category: "SYSTEM ADMINISTRATION",
            bad: "IT teams may need to manage another platform, configuration, and integration layer ",
            good: "SharePoint and Microsoft 365-based architecture keeps expense management connected with existing IT practices ",
        },
        {
            category: "TOOL FRAGMENTATION",
            bad: "Expense, collaboration, automation, and reporting may be spread across separate systems ",
            good: "Connects expense management with Microsoft Teams, Outlook, Power Automate, Power BI, and SharePoint",
        },
    ],
    features: [
        {
            category: "AI RECEIPT SCANNING",
            bad: "Receipt capture capabilities depend on the selected software and subscription ",
            good: "AI captures key receipt information such as vendor, date, amount, and tax for expense records ",
        },
        {
            category: "EXPENSE APPROVALS",
            bad: "Approvals are managed within a separate expense application ",
            good: "Route expenses through structured approval workflows connected with Microsoft 365",
        },
        {
            category: "REIMBURSEMENT & TRACKING",
            bad: "Employees may need to return to a separate system to review expense status ",
            good: "Follow expense submissions, approvals, and reimbursement progress from one connected expense process ",
        },
        {
            category: "BUSINESS EXPENSE MANAGEMENT",
            bad: "Feature coverage varies across standalone expense platforms",
            good: "Manage corporate cards, mileage, per diem, budgets, expense audits, and reporting from Expense 365",
        },
    ],
};

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="2.2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const CheckIcon = ({ color = "#1565C0" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

export default function ComparisonSection() {
    const [activeTab, setActiveTab] = useState("adoption");
    const rows = panelData[activeTab];

    return (
        <section id = 'comparison' style={{
            padding: "2.5vw 3%",
            background: "#eff2fb",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}>
            {/* Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .compare-section * { box-sizing: border-box; }

        .ctab-btn {
          padding: 9px 22px;
          border-radius: 40px;
          border: 1.5px solid ${colors.gray300};
          background: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 1.1vw;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          font-family:Assistant;
        }
        .ctab-btn:hover {
            background: linear-gradient(135deg,#1285f5 24%,#2323ce 80%);
            border: 1px solid #3445e8;
            border-radius: 1.5vw;
            color: #fff;
        }
        .ctab-btn.active {
            background: linear-gradient(135deg,#1285f5 24%,#2323ce 80%);
            border: 1px solid #3445e8;
            border-radius: 1.5vw;
            color: #fff;
        }

        .compare-table {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 32px rgba(11,31,58,0.10);
          width: 100%;
        }

        .col-headers {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .col-head-left {
          background: #F1F5F9;
          padding: 22px 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .col-head-right {
          background: linear-gradient(135deg, #1285f5 24%, #2323ce 80%);
          padding: 22px 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .badge-icon {
          width: 2.4vw;
    height: 2.4vw;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
        }

        .badge-label-left {
       font-family: 'Assistant';
    font-size: 1.4vw;
    font-weight: 700;
    color: #1E293B;
        }
        .badge-label-right {
    font-size: 1.4vw;
    font-weight: 700;
    color: #fff;
    font-family: 'Assistant';
        }

        .recommended-pill {
          margin-left: auto;
          background: #c10161;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          border-radius: 4px;
          padding: 3px 9px;
          white-space: nowrap;
          flex-shrink: 0;
          font-family: 'Assistant';
        }

        .compare-row-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .compare-row-group:nth-child(even) .cr-right { background: #F0F7FF; }
        .compare-row-group:nth-child(odd) .cr-left { background: #fff; }
        .compare-row-group:nth-child(odd) .cr-right { background: #E8F4FE; }

        .cr-category {
            grid-column: 1 / -1;
    background: #F8FAFC;
    padding: 9px 28px;
    border-top: 1px solid #EEF2F7;
    text-align: left;
        }
        .cr-category span {
    font-size: 1vw;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #000;
    font-family: 'Assistant';
        }

        .cr-left, .cr-right {
          padding: 15px 28px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-top: 1px solid rgba(0,0,0,0.05);
          
        }

        .cr-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .cr-text-bad {
      font-size: 1.2vw;
    font-family: 'ASSISTANT';
    line-height: 1.5;
    color: #64748B;
    text-align: left;
    
        }
        .cr-text-good {
            font-size: 1.2vw;
    line-height: 1.5;
    color: #0B1F3A;
    font-weight: 500;
    text-align: left;
    font-family: 'ASSISTANT';
        }

        .cta-btn {
          background: ${colors.accent};
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 14px 36px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,180,216,0.35);
        }
        .cta-btn:hover {
          background: ${colors.accent2};
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(0,180,216,0.5);
        }

        @media (max-width: 768px) {
          .col-headers,
          .compare-row-group {
            grid-template-columns: 1fr;
          }
          .cr-category {
            grid-column: 1;
          }
          .tabs-scroll {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }
          .tabs-inner {
            flex-wrap: wrap !important;
          }
            .ctab-btn{
            font-size:3.2vw;
            }
            .ctab-btn.active{
                border-radius: 40px;
            }
                  .badge-label-right{
    font-size: 3.5vw;
  }
    .badge-label-left{
        font-size: 3.5vw;

    }
        .badge-icon{
            width: 8.4vw;
    /* height: 6.5vw; */
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    }
    .cr-category span{
        font-size: 3.5vw;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #000;
    font-family: 'Assistant';
    }
    .cr-text-bad{
        font-size: 3.5vw;
    }
        .cr-text-good{
        font-size: 3.5vw;
        }
        
    }

      `}</style>

            <div className="compare-section">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "16px" }}>

                    <h2 className="HR_heading">
                        Microsoft 365-Native Expense Management vs Standalone Expense Software
                    </h2>

                    <p className="organizationsText">
                        See why organizations choose a Microsoft 365-native approach over disconnected expense management software.
                    </p>

                </div>

                {/* Tabs */}
                <div className="tabs-scroll" style={{ marginBottom: "40px" }}>
                    <div className="tabs-inner" style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "32px",
                    }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ctab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="compare-table">
                    {/* Column Headers */}
                    <div className="col-headers">
                        <div className="col-head-left">
                            <div className="badge-icon" style={{ background: "#E2E8F0" }}>🏢</div>
                            <span className="badge-label-left">Standalone Expense Management Application</span>
                        </div>
                        <div className="col-head-right">
                            <div className="badge-icon" style={{ background: "rgba(0,180,216,0.2)" }}>
                                <img src="https://ik.imagekit.io/apps365/Lp-pages/ET365-White-12001200.png" alt="Expense365" />
                            </div>
                            <span className="badge-label-right">Expense 365 – Microsoft 365 Native </span>
                            <span className="recommended-pill">Recommended</span>
                        </div>
                    </div>

                    {/* Rows */}
                    {rows.map((row, i) => (
                        <div key={i} className="compare-row-group">
                            <div className="cr-category" style={{ gridColumn: "1 / -1" }}>
                                <span>{row.category}</span>
                            </div>
                            <div className="cr-left">
                                <div className="cr-icon"><XIcon /></div>
                                <div className="cr-text-bad">{row.bad}</div>
                            </div>
                            <div className="cr-right">
                                <div className="cr-icon"><CheckIcon /></div>
                                <div className="cr-text-good">{row.good}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginTop: "40px" }}>
                    <DemoButtons LMS365="LMS365"
                        demobtnText="See Expense 365 in Action" />
                </div>
            </div>
        </section>
    );
}
