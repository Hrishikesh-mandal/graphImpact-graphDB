import { useState } from "react";
import { getServiceImpact } from "../services/api";

function ImpactAnalysis() {
  const [service, setService] = useState("payment-service");

  const [impact, setImpact] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!service.trim()) {
      setError("Enter a service name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getServiceImpact(service.trim());

      setImpact(response.data);

    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to analyze impact.");

      setImpact(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operation">
      <div className="operation-header">
        <div>
          <h2>Impact Analysis</h2>

          <p>Find services that depend on a given service.</p>
        </div>
      </div>

      <div className="search-row">
        <input
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="e.g. payment-service"
        />

        <button
          className="primary-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Impact"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {impact && (
        <div className="result-section">
          <div className="impact-summary">
            <div>
              <span>Target Service</span>

              <strong>{impact.service}</strong>
            </div>

            <div>
              <span>Potentially Affected</span>

              <strong>{impact.totalAffected}</strong>
            </div>
          </div>

          <div className="service-grid">
            {impact.affectedServices.map((affectedService) => (
              <div className="service-card" key={affectedService.name}>
                <h3>{affectedService.name}</h3>

                <p>Team: {affectedService.team}</p>

                <p>Language: {affectedService.language}</p>

                <span className="depth">
                  {affectedService.depth} hop
                  {affectedService.depth !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImpactAnalysis;
