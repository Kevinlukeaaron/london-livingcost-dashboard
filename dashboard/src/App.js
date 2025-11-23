import "./App.css";

function App() {
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
            <input type="number" placeholder="e.g. 2200" />
          </div>

          <div className="field">
            <label>Area / Borough</label>
            <select>
              <option value="">Select an area</option>
              <option value="zone1">Zone 1–2 (Central)</option>
              <option value="zone23">Zone 2–3</option>
              <option value="zone34">Zone 3–4</option>
              <option value="zone45">Zone 4–5</option>
            </select>
          </div>

          <div className="field">
            <label>Housing type</label>
            <select>
              <option>Room in shared flat</option>
              <option>Studio</option>
              <option>1-bed flat</option>
            </select>
          </div>

          <div className="field">
            <label>Lifestyle</label>
            <select>
              <option>Frugal</option>
              <option>Average</option>
              <option>Comfortable</option>
            </select>
          </div>

          <button className="primary-btn">Estimate costs</button>
        </section>

        {/* Right column – outputs */}
        <section className="panel panel-output">
          <h2>Summary</h2>

          <div className="summary-grid">
            <div className="summary-card">
              <h3>Estimated total</h3>
              <p className="summary-number">£0 / month</p>
              <p className="summary-sub">Based on your inputs.</p>
            </div>

            <div className="summary-card">
              <h3>Leftover</h3>
              <p className="summary-number">£0</p>
              <p className="summary-sub">After rent, bills, travel & basics.</p>
            </div>

            <div className="summary-card">
              <h3>Rent ratio</h3>
              <p className="summary-number">0%</p>
              <p className="summary-sub">of your net income.</p>
            </div>
          </div>

          <div className="panel panel-chart">
            <h2>Breakdown (coming soon)</h2>
            <p>Add chart here: rent vs bills vs food vs transport.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
