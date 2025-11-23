import { useState } from "react";
import "./App.css";
import rentData from "./data/rentData.json";
import transportData from "./data/transportData.json";
import groceryData from "./data/groceryData.json";
import utilitiesData from "./data/utilitiesData.json";
import CostBreakdownChart from "./components/CostBreakdownChart";

function App() {
  const [income, setIncome] = useState("");
  const [borough, setBorough] = useState("");
  const [housingType, setHousingType] = useState("Room in shared flat");
  const [lifestyle, setLifestyle] = useState("Average");

  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [leftover, setLeftover] = useState(0);
  const [rentRatio, setRentRatio] = useState(0);

  const [rentValue, setRentValue] = useState(0);
  const [utilitiesValue, setUtilitiesValue] = useState(0);
  const [groceriesValue, setGroceriesValue] = useState(0);
  const [transportValue, setTransportValue] = useState(0);

  const formatMoney = (value) =>
    `£${Number.isFinite(value) ? value.toFixed(0) : "0"}`;

  const handleEstimate = () => {
    const incomeNum = Number(income);
    if (!incomeNum || !borough) {
      setEstimatedTotal(0);
      setLeftover(0);
      setRentRatio(0);
      setRentValue(0);
      setUtilitiesValue(0);
      setGroceriesValue(0);
      setTransportValue(0);
      return;
    }

    // --- RENT (real data by borough) ---
    const rent = rentData[borough] || 0;

    // --- TRANSPORT: assume Zones 1–3 baseline for now ---
    const transport = transportData["zones_1_3"] || 0;

    // --- UTILITIES based on housing type + lifestyle ---
    let utilitiesKey = "single_flat";
    if (housingType === "1-bed flat") utilitiesKey = "one_bed";

    let lifestyleKey = "average";
    if (lifestyle === "Frugal") lifestyleKey = "low";
    if (lifestyle === "Comfortable") lifestyleKey = "high";

    const utilities =
      utilitiesData[utilitiesKey]?.[lifestyleKey] !== undefined
        ? utilitiesData[utilitiesKey][lifestyleKey]
        : 0;

    // --- GROCERIES: single person + lifestyle ---
    let groceriesKey = "single_medium";
    if (lifestyle === "Frugal") groceriesKey = "single_low";
    if (lifestyle === "Comfortable") groceriesKey = "single_high";

    const groceries = groceryData[groceriesKey] || 0;

    const total = rent + utilities + groceries + transport;
    const left = incomeNum - total;
    const ratio = incomeNum > 0 ? (rent / incomeNum) * 100 : 0;

    setEstimatedTotal(total);
    setLeftover(left);
    setRentRatio(ratio);

    setRentValue(rent);
    setUtilitiesValue(utilities);
    setGroceriesValue(groceries);
    setTransportValue(transport);
  };

  const boroughOptions = Object.keys(rentData).sort();

  return (
    <div className="app">
      <header className="app-header">
        <h1>London Living Cost Dashboard</h1>
        <p>Estimate your monthly cost of living across different areas in London.</p>
      </header>

      <main className="app-main">
        {/* Left column – inputs */}
        <section className="panel panel-inputs">
          <h2>Inputs</h2>

          <div className="field">
            <label>Net monthly income (£)</label>
            <input
              type="number"
              placeholder="e.g. 2200"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Area / Borough</label>
            <select
              value={borough}
              onChange={(e) => setBorough(e.target.value)}
            >
              <option value="">Select a borough</option>
              {boroughOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Housing type</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
            >
              <option>Room in shared flat</option>
              <option>Studio</option>
              <option>1-bed flat</option>
            </select>
          </div>

          <div className="field">
            <label>Lifestyle</label>
            <select
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value)}
            >
              <option>Frugal</option>
              <option>Average</option>
              <option>Comfortable</option>
            </select>
          </div>

          <button className="primary-btn" onClick={handleEstimate}>
            Estimate costs
          </button>
        </section>

        {/* Right column – outputs */}
        <section className="panel panel-output">
          <h2>Summary</h2>

          <div className="summary-grid">
            <div className="summary-card">
              <h3>Estimated total</h3>
              <p className="summary-number">
                {formatMoney(estimatedTotal)} / month
              </p>
              <p className="summary-sub">Based on your inputs.</p>
            </div>

            <div className="summary-card">
              <h3>Leftover</h3>
              <p className="summary-number">{formatMoney(leftover)}</p>
              <p className="summary-sub">
                After rent, bills, groceries & transport.
              </p>
            </div>

            <div className="summary-card">
              <h3>Rent ratio</h3>
              <p className="summary-number">
                {Number.isFinite(rentRatio) ? rentRatio.toFixed(1) : "0"}%
              </p>
              <p className="summary-sub">of your net income.</p>
            </div>
          </div>

          <div className="panel panel-chart">
            <h2>Breakdown</h2>
            <CostBreakdownChart
              rent={rentValue}
              utilities={utilitiesValue}
              groceries={groceriesValue}
              transport={transportValue}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
