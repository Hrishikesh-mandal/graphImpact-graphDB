import { useState } from "react";

import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import ServiceDependencies from "../components/ServiceDependencies";
import ImpactAnalysis from "../components/ImpactAnalysis";
import PathFinder from "../components/PathFinder";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("dependencies");

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-card">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="tab-content">
          {activeTab === "dependencies" && <ServiceDependencies />}

          {activeTab === "impact" && <ImpactAnalysis />}

          {activeTab === "path" && <PathFinder />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
