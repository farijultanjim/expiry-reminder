"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CreateListPage = () => {
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

  const [emailError, setEmailError] = useState("");

  // State to manage selected currency for each price field
  const [currency, setCurrency] = useState({
    domainSellingPrice: "USD",
    domainBuyingPrice: "USD",
    hostingPrice: "USD",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      validateEmail(value);
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleCurrencyChange = (e) => {
    setCurrency({ ...currency, [e.target.name]: e.target.value });
  };

  // Function to validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/domainList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          domainSellingCurrency: currency.domainSellingPrice, // Updated
          domainBuyingCurrency: currency.domainBuyingPrice, // Updated
          hostingCurrency: currency.hostingPrice,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/home");
      } else {
        alert(result.message || "Failed to create list");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto my-10 px-4">
        <h2 className="text-3xl font-semibold text-center py-4">
          Create New Domain List
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
                className={`mt-1 block w-full border rounded-md p-2 ${
                  emailError ? "border-red-500" : ""
                }`}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <PhoneInput
                country={"us"}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputProps={{
                  name: "phone",
                  required: true,
                  className: "mt-1 block w-full border rounded-md py-2 px-10",
                }}
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

            {/* Domain Selling Price */}
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

            {/* Domain Buying Price */}
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

            {/* Hosting Price */}
            <div className="flex items-center">
              <div className="flex-grow">
                <label className="block text-sm font-medium">
                  Hosting Price
                </label>
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
                Hosting Pckage
              </label>
              <input
                type="text"
                name="hostingUnit"
                value={formData.hostingUnit}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
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
              <label className="block text-sm font-medium">
                Hosting Company
              </label>
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
              disabled={loading || emailError !== ""}
            >
              {loading ? "Creating..." : "Create List"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateListPage;
