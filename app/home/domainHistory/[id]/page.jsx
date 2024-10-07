// app/dashboard/domainHistory/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function DomainHistory({ params }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRecords, setExpandedRecords] = useState({});
  const { id } = params;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/domainList/${id}/history`);
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
        } else {
          console.error("Failed to fetch history:", data.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchHistory();
    }
  }, [id]);

  console.log(history);

  const toggleRecordDetails = (index) => {
    setExpandedRecords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (isLoading)
    return (
      <div className="h-screen grid place-items-center">
        <p className="text-xl md:text-2xl font-bold">Loading...</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Domain History</h1>
      {history.length === 0 ? (
        <p>No history available for this domain.</p>
      ) : (
        history.map((record, index) => (
          <div key={index} className="mb-4 border rounded overflow-hidden">
            <div 
              className="bg-gray-100 p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
              onClick={() => toggleRecordDetails(index)}
            >
              <p className="font-semibold">
                Updated at: {new Date(record.changedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {expandedRecords[index] ? 'Click to hide details' : 'Click to show details'}
              </p>
            </div>
            {expandedRecords[index] && (
              <div className="p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Field</th>
                      <th className="border p-2 text-left">Old Value</th>
                      <th className="border p-2 text-left">New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(record.changes).map(([field, { from, to }]) => (
                      <tr key={field} className="border-b">
                        <td className="border p-2 font-medium">{field}</td>
                        <td className="border p-2">{from}</td>
                        <td className="border p-2">{to}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
      
    </div>
  );
}