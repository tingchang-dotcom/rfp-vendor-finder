# Competitive Analysis
## RFP Vendor Finder — AI-Powered Vendor Discovery & Shortlisting

| | |
|---|---|
| **Author** | [Your Name] |
| **Version** | v1.0 |
| **Date** | April 2026 |

---

## 1. Purpose

This document maps the competitive landscape for an AI-powered vendor discovery tool that accepts a plain-language sourcing brief, autonomously web-searches for vendors, scores candidates against user-defined criteria, and returns a structured shortlist with rationale in under 5 minutes — with no implementation, no contract, and no enterprise commitment required.

---

## 2. Competitive Landscape Overview

The vendor discovery space splits into three clusters, none of which fully serves the individual practitioner:

- **Enterprise supplier intelligence platforms** (Tealbook, Scoutbee, Beroe) — purpose-built for discovery but priced at $80K–$500K+ ACV, requiring implementation and integration
- **Enterprise procurement suites** (SAP Ariba, Coupa) — include discovery as a feature inside a broader platform that costs $500K–$5M+ and takes 6–18 months to implement
- **Generic AI tools** (ChatGPT, Perplexity) — accessible and cheap but produce unstructured output with no scoring, no criteria weighting, and no audit trail

The gap is a self-serve, AI-native discovery tool accessible to individual practitioners at zero cost.

---

## 3. Competitor Profiles

### 3.1 Tealbook
**Type:** Direct competitor — AI supplier intelligence platform
**Core capability:** Maintains an AI-curated database of 5M+ suppliers, surfaces candidates based on commodity codes and buyer criteria, enriches profiles with third-party data feeds. Integrates with Ariba, Coupa, and Jaggaer.
**Target customer:** Enterprise (Fortune 500, large public sector)
**Pricing:** $100K–$500K+ ACV, enterprise contract required
**Key weakness:** Searches a pre-indexed proprietary database — vendors not in Tealbook's universe are invisible. Requires enterprise procurement stack integration. Inaccessible to individual practitioners or SMBs.

---

### 3.2 Scoutbee
**Type:** Direct competitor — AI supplier discovery
**Core capability:** Users input requirements and Scoutbee's AI searches its supplier network and the open web to surface and qualify candidates. Outputs a scored supplier longlist with profile cards. Integrates with Ariba and other P2P tools.
**Target customer:** Enterprise and upper mid-market, particularly manufacturing and automotive
**Pricing:** $80K–$300K+ ACV, enterprise contract required
**Key weakness:** Requires full implementation, SSO setup, and admin-configured scoring criteria. Not self-serve. Turnaround is longer than 5 minutes for complex queries. Inaccessible to individual practitioners.

---

### 3.3 Beroe LiVE.Ai
**Type:** Direct competitor — procurement category intelligence
**Core capability:** Embeds supplier discovery inside category-specific market intelligence reports. Surfaces supplier recommendations alongside pricing benchmarks and risk scores. Strong in direct materials and specialised categories.
**Target customer:** Enterprise category managers and CPOs, heavy in pharma, chemicals, and manufacturing
**Pricing:** $50K–$200K+ ACV, enterprise subscription
**Key weakness:** Discovery is tied to pre-built category reports rather than user-defined free-text briefs. Slow to produce custom output outside covered categories. No autonomous web agent — relies on analyst-curated databases.

---

### 3.4 Fairmarkit
**Type:** Direct competitor — AI tail spend sourcing
**Core capability:** AI-powered sourcing automation with an "Intelligent Supplier Recommendations" feature that suggests vendors from its network for a given RFQ. Primarily automates invite-to-bid workflows.
**Target customer:** Mid-market to enterprise procurement teams managing high-volume, low-value (tail spend) categories
**Pricing:** $40K–$150K+ ACV
**Key weakness:** Vendor suggestions are drawn from Fairmarkit's proprietary network, not the open web — discovery is bounded by who is already registered. Output is a bid invitation, not a scored shortlist with rationale. Requires team-level rollout.

---

### 3.5 Supplier.io
**Type:** Direct competitor (narrow scope) — supplier diversity discovery
**Core capability:** Helps buyers find and certify diverse suppliers (MBE, WBE, veteran-owned) against sourcing requirements. Searchable supplier database with diversity certifications.
**Target customer:** Enterprise procurement teams and supplier diversity offices
**Pricing:** $30K–$100K+ ACV
**Key weakness:** Scope is narrow — optimised for diversity compliance, not general vendor discovery. No AI scoring against free-form criteria. No scored shortlist output.

---

### 3.6 Thomasnet
**Type:** Indirect competitor — static supplier directory
**Core capability:** The largest industrial supplier directory in North America (500K+ manufacturer profiles). Filter-driven search by product category, certifications, geography, revenue, and employee count.
**Target customer:** Engineering and procurement professionals in manufacturing (primarily US)
**Pricing:** Free for buyers; suppliers pay for profile listings
**Key weakness:** No AI scoring or plain-language brief input. Results require substantial manual triage. Coverage limited to manufacturers with listings. No intelligence layer on top of raw directory data.

---

### 3.7 ChatGPT (OpenAI) / Perplexity AI
**Type:** Indirect competitor — general-purpose AI with web search
**Core capability:** Both accept free-text sourcing questions and can return vendor lists with short descriptions using live web browsing. ChatGPT-4o with browsing and Perplexity both cite sources.
**Target customer:** Individual practitioners, knowledge workers across company sizes
**Pricing:** Free tier available; paid plans at $20/month
**Key weakness:** Not procurement-specific. No scoring rubric, no criteria weighting, no structured shortlist schema, no rationale tied to the user's brief. Output quality is inconsistent. Requires the user to engineer prompts, interpret unstructured responses, and manually cross-reference. The gap widens significantly on specialised or niche categories.

---

### 3.8 SAP Ariba (Supplier Discovery)
**Type:** Indirect competitor — enterprise procurement suite
**Core capability:** SAP's Business Network (5.5M+ registered suppliers) allows buyers to search by category, region, and certification within the sourcing module. Joule AI copilot is adding natural language interaction.
**Target customer:** Large enterprise, Fortune 500
**Pricing:** Bundled with broader Ariba suite — typically $500K–$5M+ total contract value
**Key weakness:** Discovery is constrained to suppliers registered on the Ariba Network. Joule AI is early-stage and not designed for ad hoc individual use. Requires 6–18 month implementation. Completely inaccessible to individual practitioners or SMBs.

---

### 3.9 Zip
**Type:** AI-native procurement startup — intake and workflow orchestration
**Core capability:** Natural language intake with AI-assisted vendor recommendation within an intake workflow. Suggests existing preferred vendors or flags gaps when a requestor describes a need.
**Target customer:** Mid-market to enterprise (200–5,000 employees), tech-forward companies
**Pricing:** $50K–$250K+ ACV
**Key weakness:** Vendor discovery surfaces from a company's existing preferred-vendor list, not the open web. New vendor discovery against the external market is not the primary motion. Requires internal deployment and procurement team adoption.

---

## 4. Positioning Table

| Competitor | Purpose-built for discovery | Live web search | Scored shortlist with rationale | Free / no contract | Accessible to solo practitioner |
|---|---|---|---|---|---|
| Tealbook | Yes | Partial | Yes | No | No |
| Scoutbee | Yes | Partial | Yes | No | No |
| Beroe LiVE.Ai | Yes | No | Partial | No | No |
| Fairmarkit | Partial | No | No | No | No |
| Supplier.io | Partial (diversity only) | No | No | No | No |
| Thomasnet | Partial (directory) | No | No | Yes (free) | Yes |
| ChatGPT / Perplexity | No | Yes | No | Freemium | Yes |
| SAP Ariba | Partial | No | No | No | No |
| Zip | No | No | No | No | No |
| **RFP Vendor Finder** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |

---

## 5. Competitive Gaps This Product Exploits

**1. The self-serve vacuum.**
Every purpose-built vendor discovery tool (Tealbook, Scoutbee, Beroe, Fairmarkit) is sold exclusively to enterprise teams under multi-year contracts. There is no comparable tool available to an individual practitioner or small procurement team without a six-figure budget and an existing procurement tech stack.

**2. Live web vs. walled-garden databases.**
All specialist tools search proprietary, pre-indexed supplier databases. A vendor not in Tealbook's universe or the Ariba Network is invisible. An open-web AI agent has no such constraint — it finds any vendor that has a web presence, including niche, regional, or recently founded suppliers.

**3. Speed and zero-friction entry.**
Enterprise tools require sales engagement, onboarding, SSO configuration, and IT involvement. This product produces a shortlist in under 5 minutes from a cold start with no account setup.

**4. Structured rationale for free.**
ChatGPT and Perplexity can approximate a vendor list but produce unstructured output without criteria weighting, scoring, or sourced rationale. Bridging that gap — producing a criteria-scored, evidence-backed shortlist — is the product's core differentiation over the lowest-cost incumbent behaviour (a procurement manager typing into ChatGPT).

**5. Cost.**
All enterprise alternatives carry minimum contract values of $30K+. The closest low-cost alternative (ChatGPT Plus at $20/month) requires significant prompt engineering skill and produces inconsistent output.

---

## 6. Notes on Data Currency

Pricing figures are drawn from publicly available information, analyst estimates, and G2/Capterra reviews. Actual contract values vary significantly by organisation size. The AI-native procurement space is moving rapidly — verify current pricing and feature sets against each vendor's pricing page and recent press releases before finalising this analysis.

---

*End of document*
*RFP Vendor Finder — Competitive Analysis v1.0 | [Your Name] | April 2026*
