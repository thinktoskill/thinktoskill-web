# ThinkToSkill Virtual Academy - Premier Tech Training & Placement Institute

A modern, high-converting, production-ready website designed specifically for an IT & Software Training Institute based in India, inspired by top industry institutes like **ACTE** (`acte.in`) with **100% original brand assets, copy, and code (zero copyright infringements)**.

Built with **HTML5, Tailwind CSS, Modern JavaScript, and Google Fonts**, it requires **zero installation** or build tools to run—simply open `index.html` directly in any web browser.

---

## 🌟 High-Converting Architecture (Inspired by ACTE's Conversion Funnel)

1. **ACTE-Style Instant Course Search with Autocomplete Dropdown**:
   - Prominent search bar in the Hero section with real-time suggestions across tech and enterprise ERP domains.
   - Quick trending suggestion chips (`SAP S/4HANA`, `Python`, `Data Science`, `AWS & DevOps`, `AI & Deep Learning`, `Power BI / Tableau`).

2. **Core In-Demand Tech & Enterprise ERP Programs Covered**:
   - **Enterprise ERP Track (SAP S/4HANA)**:
     - **SAP S/4HANA Finance (FI/CO)** (2 Months / ₹30,000): Universal Journal (ACDOCA), General Ledger, Accounts Payable, Accounts Receivable, New Asset Accounting, Controlling (CO), and SAP Fiori Launchpad.
     - **SAP S/4HANA Materials Management (MM)** (2 Months / ₹30,000): Procure-to-Pay (P2P), Material Master, Purchasing, Inventory Management (MIGO), Logistics Invoice Verification (MIRO), and Automatic Account Determination (OBYC).
     - **SAP S/4HANA Integrated ERP (Finance & MM)** (Dual Functional Specialization | 4 Months / ₹60,000): Comprehensive cross-functional dual specialization with live SAP server sandbox access.
   - **Data & AI Tracks**:
     - **Data Analytics**, **Data Science**, **Artificial Intelligence (AI)**, **Machine Learning (ML)**, **Deep Learning**
   - **Cloud & Infrastructure Tracks**:
     - **Cloud Computing**, **DevOps**, **AWS**, **Docker & Kubernetes (Basics)**, **Linux Basics**
   - **Programming, Databases & BI Tools**:
     - **Python Programming**, **SQL / Databases**, **Excel (Advanced)**, **Power BI / Tableau**, **Git & GitHub**, **Jupyter Notebook**, **VS Code**

3. **Explore Programs with Dual Conversion CTAs**:
   - **Enroll / Apply Now**: Seamless admissions pathway directing directly to the student registration desk.
   - **View Complete Curriculum**: In-depth module modal detailing topics, capstones, and hiring partners.

4. **Modes of Virtual Training (ACTE Style)**:
   - **Live Interactive Virtual Batches**: Weekday Morning (7–9 AM IST) & Evening (7:30–9:30 PM IST).
   - **Weekend Intensive Virtual Batches**: Saturday & Sunday for working professionals.
   - **1-on-1 Fast-Track Mentorship**: Dedicated Lead Architect guidance with accelerated completion.
   - **Corporate & Team Upskilling**: Custom cohorts for engineering teams.

5. **Free Add-On Benefits You'll Gain (ACTE Signature Pack)**:
   - Free Soft Skills & Corporate Communication Grooming (Worth ₹9,999 — FREE)
   - Unlimited 1-on-1 Mock Technical Interviews (Worth ₹14,999 — FREE)
   - Lifetime Access to LMS 1080p Recordings (Worth ₹12,000 — FREE)
   - Professional Resume & LinkedIn Optimization (Worth ₹7,500 — FREE)
   - 10+ Production GitHub Repositories (Worth ₹10,000 — FREE)
   - Dedicated WhatsApp Doubt Clearing Group (Worth ₹8,000 — FREE)

6. **Sticky Bottom Conversion Bar**:
   - Non-intrusive floating bar with live batch countdown alert, "Book Free Live Demo" CTA, and instant WhatsApp chat.

7. **Transparent Pricing & Milestone Payments**:
   - Course fees displayed clearly in Indian Rupees (**₹ INR**) with upfront transparent pricing.
   - Flexible 2-Part Milestone Payment Option (50% upon enrollment, 50% after Month 1) via UPI, Net Banking, or Cards.
   - 100% 7-Day Money-Back Guarantee.

8. **100% Live Virtual Learning (Zero Physical Campus Dependencies)**:
   - Pan-India & international reach with zero travel requirement.
   - Real-time 2-way screen sharing, live code debugging, and cloud sandbox labs.

9. **Legal & Intellectual Property Compliance**:
   - Original brand name: **ThinkToSkill Virtual Academy**.
   - Original copy, bespoke SVG icons, and clean semantic code.
   - Zero copyrighted trademarks, scraped assets, or stolen media from ACTE.

---

## 📂 Project Structure

```text
india-tech-institute/
├── index.html          # Main landing page (Hero, 17 Skills Matrix, Programs, Virtual Ecosystem, FAQs, Form)
├── courses.html        # Comprehensive course catalog with curriculum comparison table
├── admissions.html     # Step-by-step admissions roadmap, batch selection, and fee schedules in INR
├── css/
│   └── custom.css      # Custom animations, glow pulses, marquees, and typography
├── js/
│   ├── courses-data.js # Rich dataset of courses, 17 skills, modules, projects, pricing, and virtual pillars
│   └── main.js         # Dynamic rendering, search, filters, modal, WhatsApp logic, and form handlers
└── README.md           # Documentation and deployment instructions
```

---

## 🚀 How to Run the Website

### Option 1: Double-Click (Zero Setup)
Simply navigate to:
`C:\Users\Prabhu\.gemini\antigravity\scratch\india-tech-institute\`
and double-click on `index.html` to open it directly in Google Chrome, Microsoft Edge, or Firefox.

### Option 2: Local Web Server (Optional)
If you have Python or VS Code Live Server:
```bash
# In VS Code, right-click index.html -> "Open with Live Server"
# Or with Python:
python -m http.server 8080
```
Then visit `http://localhost:8080`.

---

## ⚙️ Customization Guide

### 1. Change Institute Name & Branding
- Search and replace `"ThinkToSkill"` in `index.html`, `courses.html`, `admissions.html`, and other pages if you wish to adjust the institute's branding.

### 2. Change Contact Numbers & WhatsApp
- Open `js/courses-data.js` and `js/main.js`.
- Configured with official mobile/WhatsApp: `+91 88258 08110`.
- In `index.html`, `courses.html`, and `admissions.html`, phone links are set to `tel:+918825808110` and WhatsApp URLs to `https://wa.me/918825808110`.

### 3. Edit or Add Courses
- Open `js/courses-data.js`.
- Modify course titles, fees (`discountedFee`, `originalFee`), modules, or add new course objects to the `COURSES_DATA` array. The UI will re-render automatically!

---

## 🌐 Free 1-Click Deployment Options

1. **GitHub Pages (Free)**:
   - Create a GitHub repository and push this folder.
   - Go to **Settings > Pages > Branch: main > Save**.
   - Your website will be live in 60 seconds with a free HTTPS address (`https://<username>.github.io/<repo>`).

2. **Vercel or Netlify (Free)**:
   - Go to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com).
   - Drag and drop the `india-tech-institute` folder.
   - It deploys instantly with custom domain support.

3. **Indian Hosting (Hostinger / BigRock / GoDaddy / cPanel)**:
   - Upload the contents of this folder into your `public_html` directory via cPanel File Manager or FTP.
