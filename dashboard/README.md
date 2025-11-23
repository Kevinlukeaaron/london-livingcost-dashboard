# London Living Cost Dashboard

An interactive dashboard that estimates **monthly cost of living in London** by borough, using **real UK datasets** (ONS rent, TFL fares, Ofgem & ONS/DEFRA cost estimates).

---

## 🧠 What it does

Given:

- Net monthly income (£)
- London borough
- Housing type
- Lifestyle (Frugal / Average / Comfortable)

it calculates:

- **Estimated total monthly cost**
- **Leftover money per month**
- **Rent as % of income**
- **Breakdown of Rent vs Utilities vs Groceries vs Transport** (pie chart)

---

## 🔧 Tech stack

- **Frontend:** React (Create React App)
- **Charts:** `react-chartjs-2` + `chart.js`
- **Styling:** Custom CSS (dark dashboard layout)
- **Data:** Local JSON files based on real public sources

---

## 📊 Data sources (simplified)

Data is derived from:

- **Rent by borough:** ONS / VOA – *Private Rental Market Summary Statistics* (median monthly rents)
- **Transport costs:** TfL – London Travelcard monthly fares (Zones 1–3 baseline)
- **Groceries:** ONS / DEFRA – *Family Spending* & *Family Food* surveys (single adult estimates)
- **Utilities:** Ofgem typical consumption & UK average bill estimates

Values are cleaned and stored in:

- `src/data/rentData.json`
- `src/data/transportData.json`
- `src/data/groceryData.json`
- `src/data/utilitiesData.json`

---

## 🚀 Running the project

From the project root:

```bash
cd dashboard
npm install
npm start
