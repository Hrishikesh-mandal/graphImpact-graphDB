import { useState } from "react";
import { findPath } from "../services/api";

function PathFinder() {
  const [source, setSource] = useState("");

  const [target, setTarget] = useState("");

  const [graphData, setGraphData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [noPath, setNoPath] = useState(false);

  const handleFindPath = async () => {
    if (!source.trim() || !target.trim()) {
      setError("Enter both source and target services.");

      return;
    }

    try {
      setLoading(true);
      setError("");
      setNoPath(false);
      setGraphData(null);

      const response = await findPath(source.trim(), target.trim());

      if (!response.data) {
        setNoPath(true);
        return;
      }

      setGraphData(response.data);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to find path.");

      setGraphData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operation">
      <div className="operation-header">
        <div>
          <h2>Service Path Finder</h2>

          <p>Find the relationship path between two services.</p>
        </div>
      </div>

      <div className="search-row">
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source service eg. api-gateway"
        />

        <span className="arrow">→</span>

        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target service eg. payment-service"
        />

        <button
          className="primary-button"
          onClick={handleFindPath}
          disabled={loading}
        >
          {loading ? "Finding..." : "Find Path"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {noPath && !loading && (
        <div className="empty-state">
          <h3>No path found</h3>

          <p>
            There is no dependency path from{" "}
            <strong>{source}</strong> to{" "}
            <strong>{target}</strong>.
          </p>
        </div>
      )}

      {graphData && (
        <div className="path-card">
          <div className="path-card-header">
            <h3>Connection Path</h3>
            <span>{graphData.length} hops</span>
          </div>

          <div className="path-info">
            <div>
              <small>Source</small>
              <strong>{source}</strong>
            </div>

            <div>
              <small>Destination</small>
              <strong>{target}</strong>
            </div>
          </div>

          <div className="path-list">
            {graphData.nodes.map((node, index) => (
              <div key={node.id} className="path-node">
                <div className="path-number">{index + 1}</div>

                <div className="path-node-content">
                  <strong>{node.properties.name}</strong>

                  <div>
                    <span>{node.properties.language}</span>
                    <span>{node.properties.team}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PathFinder;
