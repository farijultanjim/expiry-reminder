import Link from "next/link";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const tabs = ["Dashboard", "Domains", "Archived", "Email Settings", "About"];

  return (
    <div className="w-64 h-[88vh] flex flex-col gap-4 border-r-2 bg-zinc-100">
      <div className="px-6 py-4">
        <Link href="/home/create_list">
          <button className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md mb-4">
            Create List
          </button>
        </Link>

        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setSelectedTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-md hover:bg-red-400 hover:text-white ${
                  selectedTab === tab ? "bg-red-400 text-white" : ""
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
