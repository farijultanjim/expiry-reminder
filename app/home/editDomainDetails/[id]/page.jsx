"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditDomainDetailsPage = ({ params }) => {
  const [formData, setFormData] = useState({
    domainName: "",
    companyName: "",
    email: "",
    phone: "",
    domainPurchaseDate: "",
    domainExpiryDate: "",
    domainSellingPrice: "",
    domainBuyingPrice: "",
    hostingUnit: "",
    hostingPrice: "",
    hostingPurchaseDate: "",
    hostingExpiryDate: "",
    hostingCompany: "",
    note: "",
  });

  const [currency, setCurrency] = useState({
    domainSellingPrice: "USD",
    domainBuyingPrice: "USD",
    hostingPrice: "USD",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = params;

  // Helper function to format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchDomainDetails = async () => {
      try {
        const response = await fetch(`/api/domainList/${id}`);
        const data = await response.json();
        if (data.success) {
          // Format dates for input fields
          const formattedData = {
            ...data.domainList,
            domainPurchaseDate: formatDateForInput(
              data.domainList.domainPurchaseDate
            ),
            domainExpiryDate: formatDateForInput(
              data.domainList.domainExpiryDate
            ),
            hostingPurchaseDate: formatDateForInput(
              data.domainList.hostingPurchaseDate
            ),
            hostingExpiryDate: formatDateForInput(
              data.domainList.hostingExpiryDate
            ),
          };
          setFormData(formattedData);
          setCurrency({
            domainSellingPrice: data.domainList.domainSellingCurrency,
            domainBuyingPrice: data.domainList.domainBuyingCurrency,
            hostingPrice: data.domainList.hostingCurrency,
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch domain details");
      } finally {
        setLoading(false);
      }
    };

    fetchDomainDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (e) => {
    setCurrency({ ...currency, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/domainList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          domainSellingCurrency: currency.domainSellingPrice,
          domainBuyingCurrency: currency.domainBuyingPrice,
          hostingCurrency: currency.hostingPrice,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Domain details updated successfully!");
        router.push("/home");
      } else {
        alert(result.message || "Failed to update domain details");
      }
    } catch (error) {
      console.error("Error updating domain details:", error);
      alert("Failed to update domain details");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen grid place-items-center">
        <p className="text-xl md:text-2xl font-bold">Loading...</p>
      </div>
    );
  if (error)
    return <div className="grid place-items-center">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h2 className="text-3xl font-semibold text-center py-4">
        Edit Domain Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Domain Name</label>
            <input
              type="text"
              name="domainName"
              value={formData.domainName}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Domain Purchase Date
            </label>
            <input
              type="date"
              name="domainPurchaseDate"
              value={formData.domainPurchaseDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Domain Expiry Date
            </label>
            <input
              type="date"
              name="domainExpiryDate"
              value={formData.domainExpiryDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="flex items-center">
            <div className="flex-grow">
              <label className="block text-sm font-medium">
                Domain Selling Price
              </label>
              <input
                type="number"
                name="domainSellingPrice"
                value={formData.domainSellingPrice}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="ml-2">
              <label className="block text-sm font-medium">Currency</label>
              <select
                name="domainSellingCurrency"
                value={currency.domainSellingPrice}
                onChange={(e) =>
                  setCurrency({
                    ...currency,
                    domainSellingPrice: e.target.value,
                  })
                }
                required
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-grow">
              <label className="block text-sm font-medium">
                Domain Buying Price
              </label>
              <input
                type="number"
                name="domainBuyingPrice"
                value={formData.domainBuyingPrice}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="ml-2">
              <label className="block text-sm font-medium">Currency</label>
              <select
                name="domainBuyingCurrency"
                value={currency.domainBuyingPrice}
                onChange={(e) =>
                  setCurrency({
                    ...currency,
                    domainBuyingPrice: e.target.value,
                  })
                }
                required
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Hosting Package</label>
            <input
              type="text"
              name="hostingUnit"
              value={formData.hostingUnit}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="flex items-center">
            <div className="flex-grow">
              <label className="block text-sm font-medium">Hosting Price</label>
              <input
                type="number"
                name="hostingPrice"
                value={formData.hostingPrice}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="ml-2">
              <label className="block text-sm font-medium">Currency</label>
              <select
                name="hostingPrice"
                value={currency.hostingPrice}
                onChange={handleCurrencyChange}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Hosting Purchase Date
            </label>
            <input
              type="date"
              name="hostingPurchaseDate"
              value={formData.hostingPurchaseDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Hosting Expiry Date
            </label>
            <input
              type="date"
              name="hostingExpiryDate"
              value={formData.hostingExpiryDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hosting Company</label>
            <input
              type="text"
              name="hostingCompany"
              value={formData.hostingCompany}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              rows="4"
              placeholder="Enter additional notes or information here"
            ></textarea>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Domain Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDomainDetailsPage;
