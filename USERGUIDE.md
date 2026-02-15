# Bammo Shield User Guide

**Bammo Shield** is a reinsurance and capital risk platform built by Paramean Solutions. It provides end-to-end customized underwriting and risk products that maximize financial security and limit exposure for at-risk care delivery organizations.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Products](#products)
4. [Plan Sponsors](#plan-sponsors)
5. [Quotes](#quotes)
6. [Underwriting](#underwriting)
7. [Policies](#policies)
8. [Cost Drivers](#cost-drivers)
9. [High-Cost Claims](#high-cost-claims)
10. [Claims Insights](#claims-insights)
11. [Analytics](#analytics)
12. [Glossary](#glossary)

---

## Getting Started

### Accessing the Application

Open your browser and navigate to the Bammo Shield application URL (default: `http://localhost:5173`).

The application uses a sidebar navigation on the left. Click any menu item to navigate between sections. The currently active page is highlighted in the sidebar.

### Navigation Overview

The sidebar contains the following sections, organized by workflow:

| Section | Purpose |
|---------|---------|
| **Dashboard** | At-a-glance metrics and charts for your book of business |
| **Products** | Browse the four Bammo Shield product offerings |
| **Plan Sponsors** | Manage organizations purchasing coverage |
| **Quotes** | Generate and manage insurance quotes |
| **Underwriting** | Review and approve/decline submitted quotes |
| **Policies** | View and manage bound policies |
| **Cost Drivers** | Analyze population-level cost drivers |
| **High-Cost Claims** | Drill into high-cost claimant details |
| **Claims Insights** | Predictive analytics, benchmarking, and trend monitoring |
| **Analytics** | Aggregate reporting and financial metrics |

---

## Dashboard

**Route:** `/`

The Dashboard provides a high-level summary of your entire book of business.

### Metric Cards

Six key performance indicators are displayed at the top:

- **Plan Sponsors** -- Total number of organizations with active or pending relationships.
- **Active Quotes** -- Number of quotes currently in progress (draft, under review, or approved).
- **Active Policies** -- Count of bound and active insurance policies.
- **Premium In-Force** -- Total annual premium across all active policies.
- **Avg Risk Score** -- Weighted average risk score across your portfolio.
- **Avg PEPM Rate** -- Average per-employee-per-month rate across all groups.

### Charts

- **Quote Activity** -- Bar chart showing the distribution of quotes by status (Draft, Pending Review, Approved, Bound).
- **Risk Distribution** -- Pie chart breaking down groups by risk tier (Low, Moderate, High, Very High).
- **Premium Trend** -- Bar chart showing monthly premium growth over time.

---

## Products

**Route:** `/products`

The Products page showcases the four Bammo Shield product offerings. Each product card displays a description, key features, current active policy count, premium volume, and typical attachment levels.

### Specific Stop Loss

Protects self-funded employers against catastrophic claims by an individual. The employer's liability is capped at a predetermined amount per person (the "attachment point"). Claims exceeding the attachment point are reimbursed by the stop-loss policy.

**Key features:**
- Individual claimant protection
- Configurable attachment points
- Per-person liability cap
- Customizable deductible levels

### Aggregate Stop Loss

Limits the total amount an employer will pay for all covered medical claims during a contract period. Provides protection against higher-than-expected overall claim costs.

**Key features:**
- Total claims liability cap
- Budget certainty and predictability
- Configurable attachment factors (typically 120-130% of expected claims)
- Protection against trend volatility

### Gains/Loss Quota Share

A reinsurance arrangement where the insurer and reinsurer agree to share a fixed percentage of premiums and losses for a specific line of business. This allows risk diversification.

**Key features:**
- Shared premium and loss arrangement
- Fixed percentage participation (e.g., 60/40 split)
- Risk diversification for insurers
- Customizable quota share percentages

### Surety Bonds

Three-party financial guarantees that ensure contractual obligations are met. The surety protects the obligee if the principal fails to fulfill their commitments.

**Key features:**
- Contractual obligation guarantee
- Three-party protection structure (principal, obligee, surety)
- Regulatory compliance support
- Customizable bond amounts and terms

### Provider Pain Points & Solutions

The bottom of the Products page maps common provider challenges to Bammo Shield solutions, along with "Simplified Decision Points" that help plan sponsors navigate premium, risk protection, capital, and ongoing support questions.

---

## Plan Sponsors

**Route:** `/plan-sponsors`

Plan Sponsors are the organizations purchasing coverage -- ACOs, health plans, TPAs, employers, and provider groups.

### Viewing Plan Sponsors

The main table displays all plan sponsors with the following columns:
- **Name** -- Organization name
- **Type** -- Organization type (ACO, Health Plan, TPA, Employer, Provider Group)
- **Contract** -- Contract type (Full Risk, Shared Savings, Shared Risk, Global Capitation)
- **State** -- Primary state of operation
- **Members** -- Total enrolled member count
- **SIC** -- Standard Industrial Classification code

Click any row to view the plan sponsor's detail page.

### Creating a New Plan Sponsor

1. Click the **"New Plan Sponsor"** button in the top right.
2. Fill in the required fields:
   - **Name** -- Organization name
   - **Organization Type** -- Select from ACO, Health Plan, TPA, Employer, or Provider Group
   - **Contract Type** -- Select the contract arrangement
   - **State** -- Primary state (e.g., CA, IL, GA)
   - **SIC Code** -- Industry classification code
   - **Member Count** -- Number of enrolled members
3. Click **"Create Plan Sponsor"** to save, or **"Cancel"** to discard.

---

## Quotes

**Route:** `/quotes`

Quotes represent insurance proposals generated for plan sponsors. Each quote includes pricing, risk assessment, and coverage terms.

### Viewing Quotes

The quotes table shows:
- **Quote #** -- Unique identifier (e.g., BSQ-2026-001)
- **Coverage** -- Coverage type badge (Specific, Aggregate, Both, Quota Share, Surety Bond)
- **Status** -- Current status (Draft, Pending Review, Approved, Declined, Expired, Bound)
- **Premium** -- Total annual premium
- **PEPM** -- Per-employee-per-month rate
- **Risk** -- Risk score percentage
- **Actions** -- Available actions based on status

Click any row to view the quote detail panel on the right, which shows:
- Coverage type and current status
- Total annual premium and PEPM rate
- Specific stop-loss details (attachment point, annual premium)
- Aggregate stop-loss details (attachment factor, annual premium)
- Risk assessment (risk score, expected claims)
- Risk factor breakdown (demographic, historical claims, chronic condition, large claimant, geographic, industry scores)

### Generating a New Quote

1. Click **"Generate Quote"** in the top right.
2. Fill in the quote parameters:
   - **Plan Sponsor** -- Select the organization
   - **Coverage Type** -- Specific, Aggregate, or Both
   - **Effective Date** -- When coverage begins
   - **Specific Attachment Point ($)** -- Per-claimant threshold
   - **Aggregate Attachment Factor** -- Multiplier applied to expected claims
   - **Contract Period (months)** -- Duration of coverage
3. Click **"Generate Quote"** to create the quote.

### Quote Workflow

Quotes follow this lifecycle:

```
Draft --> Pending Review --> Approved --> Bound
                        \--> Declined
```

- **Draft** quotes have a **"Review"** action button that submits them for underwriting review.
- **Approved** quotes have a **"Bind"** action button that converts them into active policies.

---

## Underwriting

**Route:** `/underwriting`

The Underwriting Workbench is where underwriters review submitted quotes and make approval decisions.

### Reviewing Quotes

The table displays all underwriting reviews with:
- **Quote** -- Quote number
- **Risk Tier** -- Low, Moderate, High, or Very High
- **Decision** -- Approve, Decline, Refer, or Request Info
- **Risk Score** -- Calculated risk percentage
- **Loss Ratio** -- Expected loss ratio
- **Actions** -- Approve or Decline buttons

Click a row to open the detail panel showing:
- Risk tier and current decision
- Risk score and premium adjustment factor
- Large claimant count and expected loss ratio
- Recommended attachment point
- Risk factor breakdown with visual progress bars
- Underwriter notes

### Making Decisions

- Click **"Approve"** to approve the quote for binding.
- Click **"Decline"** to reject the quote.

Decisions update the associated quote's status and may include notes explaining the rationale.

---

## Policies

**Route:** `/policies`

Policies are bound insurance contracts created from approved quotes.

### Viewing Policies

The policy table shows:
- **Policy #** -- Unique policy number (e.g., BSP-2026-0001)
- **Plan Sponsor** -- Organization name
- **Coverage** -- Coverage type
- **Status** -- Active, Pending, Expired, or Cancelled
- **Premium** -- Total annual premium
- **PEPM** -- Per-employee-per-month rate
- **Effective** -- Coverage start date

Click a row to view the full detail panel:
- Status and coverage type
- Total premium and PEPM rate
- Effective and termination dates
- Specific stop-loss details (attachment point, max liability)
- Aggregate stop-loss details (attachment point, attachment factor)
- Binding information (who bound it and when)

---

## Cost Drivers

**Route:** `/cost-drivers`

The Cost Driver Analysis page helps you identify and monitor the key factors driving healthcare costs across your population. Cost drivers vary by organization based on disease burden, demographics, geography, and social determinants of health.

### Metric Cards

- **Chronic Condition Spend** -- Total annual spend on chronic clinical conditions with year-over-year trend.
- **High-Cost Claimants** -- Number of members exceeding $100K in claims. Click this card to navigate to the High-Cost Claims detail page.
- **GLP-1 Monthly Spend** -- Current monthly pharmacy spend on GLP-1 medications with YoY growth.
- **Medical Trend Rate** -- Forecasted annual medical cost trend rate.

### Cost Driver Breakdown

A pie chart showing the relative contribution of each cost driver category:
- Chronic Conditions
- High-Cost Claimants
- Pharmacy / GLP-1
- Emerging Conditions
- External Factors

Click a segment to see the annual spend amount for that driver.

### GLP-1 Spend Trend

A bar chart tracking monthly GLP-1 medication spend. GLP-1 drugs (used for diabetes and weight management) are a rapidly growing cost driver for many plan sponsors.

### Chronic Clinical Conditions Table

Detailed table of the top chronic conditions showing:
- Condition name
- Number of affected members
- Average annual cost per member
- Year-over-year cost trend
- Severity rating (High, Moderate, Low)

Conditions tracked include Cancer, Cardiovascular Disease, Musculoskeletal, Diabetes, Behavioral Health, and Respiratory/COPD.

### High-Cost Claimant Distribution

Breakdown of high-cost claimants by claim tier ($100K-$250K, $250K-$500K, $500K-$1M, $1M+), showing claimant count, total spend, and percentage of total HCC spend per tier.

### Emerging Clinical Conditions

Cards highlighting new and growing conditions that may significantly impact future costs:
- Gastrointestinal (IBD, Diverticulitis)
- Neurological (MS, Migraines, Seizures)
- Autoimmune Disorders
- Gene / Cell Therapy Pipeline

Each card shows the PEPM cost increase and a contextual note.

### External Cost Factors

Three cards covering external market forces:
- Health System Consolidation
- Tariff & Supply Chain impacts
- General Inflation

---

## High-Cost Claims

**Route:** `/high-cost-claimants`

This page provides a deep drill-down into all high-cost claimants (members with $100K+ in annual claims).

### Summary Metrics

- **Total High-Cost Claimants** -- Current count (as a percentage of total population).
- **Total HCC Spend** -- Aggregate spend across all high-cost claimants.
- **$1M+ Claimants** -- Count of members exceeding $1M in claims.
- **Avg Cost per HCC** -- Average annual cost per high-cost claimant.

### Charts

- **Spend by Claim Tier** -- Horizontal bar chart comparing total spend across the four tiers.
- **Primary Diagnosis Mix** -- Pie chart showing distribution of primary diagnoses (Cancer, Cardiovascular, Musculoskeletal, Neurological, Transplant, Other).
- **HCC Growth Trend** -- Line chart showing how the number of high-cost claimants has grown over 12 months.

### Tier Breakdown Cards

Four clickable cards (one per tier) showing claimant count, total spend, average cost, and percentage of total HCC spend. Click a card to filter the member table to that tier.

### Member Detail Table

A scrollable, filterable table of all 51 high-cost claimants with columns:
- Member ID
- Plan Sponsor
- Primary Diagnosis
- Total Claims
- Risk Score (with visual bar)
- Tier badge
- Status badge

**Filters:** Use the dropdown menus above the table to filter by:
- **Claim Tier** -- All, $1M+, $500K-$1M, $250K-$500K, $100K-$250K
- **Plan Sponsor** -- All, or a specific organization

### Claimant Detail Panel

Click any row to open the detail panel on the right, which includes:
- **Demographics** -- Age, gender, state
- **Diagnosis** -- Primary diagnosis (highlighted) and secondary diagnoses as tags
- **Claims Breakdown** -- Medical vs. Pharmacy split
- **Utilization** -- Admissions, ER visits, specialist count
- **Cost Trajectory** -- Prior year claims vs. projected next year claims
- **Care Management** -- Assigned care manager or specialist
- **Chronic Conditions** -- Tags for all chronic conditions affecting the member
- **Last Claim Date** -- Most recent claim activity

---

## Claims Insights

**Route:** `/claims-insights`

The Claims Insights page brings together predictive analytics, precision benchmarking, and trend monitoring to help forecast future risk and implement targeted mitigation strategies.

### Metric Cards

- **Predicted Next-Qtr PEPM** -- Machine-learning-forecasted per-employee-per-month cost for the upcoming quarter.
- **Flagged High-Cost Members** -- Number of members predicted to become high-cost claimants, with estimated exposure.
- **Benchmark Variance** -- How your population's costs compare to a precision-matched peer group.
- **Current Loss Ratio** -- Claims paid as a percentage of premiums collected, with trend direction.

### Claims PEPM Trend Chart

A line chart with three series:
- **Your Population** (solid line) -- Actual PEPM costs over the past 12 months.
- **Matched Benchmark** (dashed line) -- PEPM for a precision-matched peer population.
- **ML Predicted** (dotted line) -- Machine learning forecast for the next 4 months.

The gap between your population and the benchmark highlights areas of cost mitigation opportunity.

### Precision Benchmarking by Category

A horizontal bar chart comparing your cost per category against the matched benchmark:
- Cancer, Cardiovascular, Musculoskeletal, Diabetes, Behavioral Health, Pharmacy
- Positive gaps indicate you are above benchmark (opportunity areas).
- Negative gaps indicate you outperform the benchmark.

### Loss Ratio Trend

An area chart showing how your loss ratio has trended over 12 months. Useful for measuring whether cost mitigation strategies are having an effect.

### Predictive High-Cost Claimant Identification

A table of members flagged by the ML model as likely to become high-cost claimants. Columns include:
- Member ID
- Risk Score (with visual bar)
- Predicted Annual Cost
- Top Condition driving the prediction
- Model Confidence percentage
- Status (Flagged, Monitoring, Review)

Early identification enables proactive care management and cost containment.

### Alternative Financing Strategies

Three cards presenting financing options beyond traditional stop-loss:
- **Stop-Loss Reinsurance** -- Primary high-cost claimant risk transfer (active in the platform).
- **Captive Insurance** -- Employee benefit cell captives for groups with favorable loss experience.
- **Health Risk Financing** -- Credit-based solutions to smooth budget impacts, fill coverage gaps, and improve capital efficiency.

---

## Analytics

**Route:** `/analytics`

The Analytics & Reporting page provides aggregate financial and operational metrics across your entire book of business.

### Metric Cards

- **Premium In-Force** -- Total annual premium across all active policies.
- **Expected Claims** -- Projected total claims based on population risk models.
- **Expected Loss Ratio** -- Ratio of expected claims to premium in-force.
- **Active Policies** -- Total count of active policies.

### Coverage Distribution

A pie chart showing the distribution of policies by product type:
- Specific Stop Loss
- Aggregate Stop Loss
- Both (Specific + Aggregate)
- Quota Share
- Surety Bonds

### Risk Distribution

A bar chart showing group counts by risk tier (Low, Moderate, High, Very High), color-coded from green to red.

### Premium Trend

A line chart (when data is available) showing monthly premium collection trends, useful for tracking growth and seasonal patterns.

---

## Glossary

| Term | Definition |
|------|-----------|
| **Attachment Point** | The dollar threshold above which the stop-loss policy begins to pay claims. For specific coverage, this is per individual; for aggregate, it is a total amount. |
| **Aggregate Attachment Factor** | A multiplier applied to expected claims to determine the aggregate attachment point (e.g., 125% of expected claims). |
| **PEPM** | Per Employee Per Month -- a standard unit of measurement for healthcare costs and premiums. |
| **Loss Ratio** | The ratio of claims paid to premiums collected. A loss ratio above 100% means claims exceed premiums. |
| **Risk Score** | A calculated score (0-100%) representing the likelihood and expected severity of future claims for a member or group. |
| **High-Cost Claimant (HCC)** | A member whose annual claims exceed a defined threshold (typically $100,000+). |
| **GLP-1** | Glucagon-like peptide-1 receptor agonists -- a class of drugs used for type 2 diabetes and weight management. |
| **Quota Share** | A proportional reinsurance arrangement where premiums and losses are shared at a fixed percentage. |
| **Surety Bond** | A three-party financial guarantee ensuring contractual obligations are met. |
| **Plan Sponsor** | The organization that sponsors and funds a health benefit plan (e.g., an ACO, employer, TPA, or provider group). |
| **MGU** | Managing General Underwriter -- an organization authorized to underwrite and bind insurance on behalf of a carrier. |
| **Captive Insurance** | A form of self-insurance where a company creates its own insurance subsidiary to manage risk. |

---

*Bammo Shield is a product of Paramean Solutions. For support, contact your Paramean Solutions representative or visit [parameansolutions.com](https://parameansolutions.com).*
