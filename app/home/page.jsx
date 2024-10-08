// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState("Domains"); // Default to "Domains"
  const [domainLists, setDomainLists] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]); // Filtered list of domains by search

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Search function
  const handleSearch = (query) => {
    if (query === "") {
      setFilteredDomains(domainLists); // If the query is empty, show all data
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = domainLists.filter((item) => {
        return (
          item.domainName.toLowerCase().includes(lowerQuery) ||
          item.companyName.toLowerCase().includes(lowerQuery) ||
          item.email.toLowerCase().includes(lowerQuery)
        );
      });
      setFilteredDomains(filtered); // Update the filtered list based on the query
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  // Helper function to calculate remaining days
  const calculateRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDifference = expiry - today;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Helper function to filter domains by tab(Domains or Archived)
  const filterDomainsByTab = (domains, tab) => {
    if (tab === "Domains") {
      setFilteredDomains(domains.filter((domain) => !domain.isArchived)); // Show non-archived
    } else if (tab === "Archived") {
      setFilteredDomains(domains.filter((domain) => domain.isArchived)); // Show archived
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/domainList");
        const data = await response.json();

        if (data.success) {
          const sortedDomainLists = data.domainLists.sort((a, b) => {
            const aDomainExpiryDays = calculateRemainingDays(
              a.domainExpiryDate
            );
            const aHostingExpiryDays = calculateRemainingDays(
              a.hostingExpiryDate
            );
            const aNearestExpiry = Math.min(
              aDomainExpiryDays,
              aHostingExpiryDays
            );

            const bDomainExpiryDays = calculateRemainingDays(
              b.domainExpiryDate
            );
            const bHostingExpiryDays = calculateRemainingDays(
              b.hostingExpiryDate
            );
            const bNearestExpiry = Math.min(
              bDomainExpiryDays,
              bHostingExpiryDays
            );

            return aNearestExpiry - bNearestExpiry;
          });

          setDomainLists(sortedDomainLists);
          filterDomainsByTab(sortedDomainLists, selectedTab); // Set the filtered domains based on the tab
          setTotalPages(Math.ceil(data.domainLists.length / itemsPerPage));
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterDomainsByTab(domainLists, selectedTab);
    setCurrentPage(1);
  }, [selectedTab, domainLists]);


   // Get paginated data
   const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDomains.slice(startIndex, endIndex);
  };

  // Content based on selected tab
  const renderTabContent = () => {
    const router = useRouter();
    const paginatedDomains = getPaginatedData();

    if (selectedTab === "Dashboard") {
      return <p className="p-6">Welcome to the Dashboard</p>;
    } else if (selectedTab === "Domains" || selectedTab === "Archived") {
      return (
        <div className="px-6 py-2">
          <div className="px-5 py-6 ">
            <Search onSearch={handleSearch} />
          </div>

          <div className="w-full px-5">
            <table className="w-full">
              <thead className="bg-[#a5a5a532] font-semibold">
                <tr className="border-b border-[#a5a5a545] text-center">
                  <td className="px-2 py-4">Domain Name</td>
                  <td className="px-2 py-4">Customer Name</td>
                  <td className="px-2 py-4">Email</td>
                  <td className="px-2 py-4">Domain Expiry Date</td>
                  <td className="px-2 py-4">Hosting Expiry Date</td>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td
                      className="text-center px-2 text-red_color py-4"
                      colSpan="6"
                    >
                      {error}
                    </td>
                  </tr>
                ) : (
                  paginatedDomains.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-[#a5a5a545] hover:bg-[#a5a5a532] cursor-pointer"
                      onClick={() =>
                        router.push(`/home/domainDetails/${item._id}`)
                      }
                    >
                      <td className="text-center px-2 py-4">
                        <span className="font-semibold">{item.domainName}</span>
                      </td>
                      <td className="text-center px-2 py-4">
                        {item.companyName}
                      </td>
                      <td className="text-center px-2 py-4">{item.email}</td>
                      <td className="text-center px-2 py-4">
                        {formatDate(item.domainExpiryDate)}
                      </td>
                      <td className="text-center px-2 py-4">
                        {formatDate(item.hostingExpiryDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      );
    } else if (selectedTab === "Email Settings") {
      return <p className="p-6">Email settings content goes here</p>;
    } else if (selectedTab === "About") {
      return <p className="p-6">About page content goes here</p>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="">
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>

      {/* Main content */}
      <div className="flex-1 p-2">
        <h2 className="text-3xl font-semibold text-center ">{selectedTab}</h2>

        {loading ? (
          <div className="h-screen -mt-10 grid place-items-center">
            <p className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              Loading...
            </p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default HomePage;
