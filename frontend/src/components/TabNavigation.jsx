function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: "dependencies",
      label: "Dependencies",
    },
    {
      id: "impact",
      label: "Impact Analysis",
    },
    {
      id: "path",
      label: "Find Path",
    },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? "tab active" : "tab"}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabNavigation;
