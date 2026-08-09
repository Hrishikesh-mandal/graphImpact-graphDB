import { useState } from "react";
import { getServiceDependencies } from "../services/api";

function ServiceDependencies() {
  const [searched, setSearched] = useState(false);

  const [service, setService] = useState("");

  const [dependencies, setDependencies] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!service.trim()) {
      setError("Enter a service name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      setSearched(true);
      setDependencies([]);

      const response = await getServiceDependencies(service.trim());

      setDependencies(response.data);
      
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to fetch dependencies.");

      setDependencies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operation">
      <div className="operation-header">
        <div>
          <h2>Service Dependencies</h2>

          <p>See which services a service directly depends on.</p>
        </div>
      </div>

      <div className="search-row">
        <input
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="e.g. api-gateway"
        />

        <button
          className="primary-button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Loading..." : "Find Dependencies"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {searched && !loading && dependencies.length === 0 && !error && (
        <div className="empty-state">
          <h3>No dependencies found</h3>

          <p>{service} does not have any outgoing dependencies.</p>
        </div>
      )}

      {!loading && dependencies.length > 0 && (
        <div className="result-section">
          <div className="result-header">
            <h3>{dependencies.length} dependencies found</h3>
          </div>

          <div className="service-grid">
            {dependencies.map((dependency) => (
              <div className="service-card" key={dependency.name}>
                <h3>{dependency.name}</h3>

                <p>Team: {dependency.team}</p>

                <p>Language: {dependency.language}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceDependencies;
