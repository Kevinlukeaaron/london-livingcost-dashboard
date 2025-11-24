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

  // cheapest boroughs
  const [cheapestList, setCheapestList] = useState([]);

  const formatMoney = (v) => `£${Number.isFinite(v) ? v.toFixed(0) : "0"}`;

  // ---- COMPUTE CHEAPEST ----
  const getCheapestBoroughs = () => {
    const ranked = Object.entries(rentData).map(([boroughName, rent]) => {
      let utilitiesKey = "single_flat";
      if (housingType === "1-bed flat") utilitiesKey = "one_bed";

      let lifestyleKey = "average";
      if (lifestyle === "Frugal") lifestyleKey = "low";
      if (lifestyle === "Comfortable") lifestyleKey = "high";

      const utilities =
        utilitiesData[utilitiesKey]?.[lifestyleKey] ?? 0;

      let groceriesKey = "single_medium";
      if (lifestyle === "Frugal") groceriesKey = "single_low";
      if (lifestyle === "Comfortable") groceriesKey = "single_high";

      const groceries = groceryData[groceriesKey] || 0;

      const transport = transportData["zones_1_3"] || 0;

      const totalCost = rent + utilities + groceries + transport;
      return { boroughName, totalCost };
    });

    return ranked.sort((a, b) => a.totalCost - b.totalCost).slice(0, 3);
  };

  // ---- HANDLE ESTIMATE ----
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
      setCheapestList([]);
      return;
    }

    const rent = rentData[borough] || 0;
    const transport = transportData["zones_1_3"] || 0;

    let utilitiesKey = "single_flat";
    if (housingType === "1-bed flat") utilitiesKey = "one_bed";

    let lifestyleKey = "average";
    if (lifestyle === "Frugal") lifestyleKey = "low";
    if (lifestyle === "Comfortable") lifestyleKey = "high";

    const utilities =
      utilitiesData[utilitiesKey]?.[lifestyleKey] ?? 0;

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

    setCheapestList(getCheapestBoroughs());
  };

  const boroughOptions = Object.keys(rentData).sort();

  return (
    <div className="app">
      <header className="app-header">
        <h1>London Living Cost Dashboard</h1>
        <p>Estimate your monthly cost of living across London.</p>
      </header>

      <main className="app-main">
        
        {/* LEFT SIDE */}
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
                <option key={b} value={b}>{b}</option>
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

        {/* RIGHT SIDE */}
        <section className="panel panel-output">
          <h2>Summary</h2>

          <div className="summary-grid">
            <div className="summary-card">
              <h3>Estimated total</h3>
              <p className="summary-number">{formatMoney(estimatedTotal)} / month</p>
              <p className="summary-sub">Based on your inputs.</p>
            </div>

            <div className="summary-card">
              <h3>Leftover</h3>
              <p className="summary-number">{formatMoney(leftover)}</p>
              <p className="summary-sub">After essentials.</p>
            </div>

            <div className="summary-card">
              <h3>Rent ratio</h3>
              <p className="summary-number">
                {Number.isFinite(rentRatio) ? rentRatio.toFixed(1) : "0"}%
              </p>
              <p className="summary-sub">of income.</p>
            </div>
          </div>

          {/* CHART */}
          <div className="panel panel-chart">
            <h2>Breakdown</h2>
            <CostBreakdownChart
              rent={rentValue}
              utilities={utilitiesValue}
              groceries={groceriesValue}
              transport={transportValue}
            />
          </div>

          {/* ---- BOROUGH INSIGHTS ---- */}
          <div className="panel" style={{ marginTop: "16px" }}>
            <h2>Borough insights</h2>

            {estimatedTotal > 0 && borough ? (
              <>
                <p style={{ margin: 0, fontSize: 14 }}>
                  For <strong>{borough}</strong>, your total cost is{" "}
                  <strong>{formatMoney(estimatedTotal)}</strong> / month, leaving{" "}
                  <strong>{formatMoney(leftover)}</strong>.
                </p>

                <p style={{ marginTop: 8, fontSize: 13, color: "#c7cad6" }}>
                  Rent takes{" "}
                  <strong>{rentRatio.toFixed(1)}%</strong> of your income.{" "}
                  {leftover < 0
                    ? "Unaffordable — you'd be in the red."
                    : rentRatio > 40
                    ? "High rent burden — consider cheaper boroughs."
                    : rentRatio > 30
                    ? "Borderline but manageable."
                    : "Healthy ratio — fairly affordable."}
                </p>
              </>
            ) : (
              <p style={{ fontSize: 13, color: "#8b8fa3" }}>
                Run an estimate to see insights.
              </p>
            )}
          </div>

          {/* ---- STATIC MAP PANEL ---- */}
          <section className="panel panel-map" style={{ marginTop: "16px" }}>
            <h2>Map view (static)</h2>

            <p style={{ fontSize: "13px", color: "#8b8fa3", marginTop: 0 }}>
              Selected borough:{" "}
              {borough ? <strong>{borough}</strong> : "none selected yet"}
            </p>

            <img
              src="/london-boroughs-map.png"
              alt="London borough map"
              className="map-image"
              style={{
                width: "100%",
                borderRadius: "8px",
                marginTop: "12px",
                border: "1px solid #1f2435",
              }}
            />
          </section>

          {/* ---- TOP 3 CHEAPEST ---- */}
          <div className="panel" style={{ marginTop: "16px" }}>
            <h2>Top 3 Cheapest Boroughs</h2>

            {cheapestList.length === 0 ? (
              <p style={{ margin: 0 }}>Click "Estimate costs" to see suggestions.</p>
            ) : (
              <>
                <ul style={{ margin: 0, paddingLeft: "18px" }}>
                  {cheapestList.map((item) => (
                    <li key={item.boroughName}>
                      <strong>{item.boroughName}</strong> — £
                      {item.totalCost.toFixed(0)} / month
                    </li>
                  ))}
                </ul>

                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#8b8fa3",
                  }}
                >
                  Based on rent + utilities + groceries + transport (ONS / TFL / Ofgem / DEFRA)
                </p>

                {cheapestList.length > 0 && borough && (
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "13px",
                      color: "#c7cad6",
                    }}
                  >
                    If you lived in <strong>{cheapestList[0].boroughName}</strong>{" "}
                    instead of <strong>{borough}</strong>, you'd save{" "}
                    <strong>
                      £
                      {(
                        estimatedTotal -
                        cheapestList[0].totalCost
                      ).toFixed(0)}
                    </strong>{" "}
                    per month.
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
