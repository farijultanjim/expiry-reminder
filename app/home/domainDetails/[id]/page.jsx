// app/dashboard/domainDetails/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/Components/Loader";

const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
};

export default function DomainDetails({ params }) {
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteDomainId, setDeleteDomainId] = useState(null);

  const [renewalPeriod, setRenewalPeriod] = useState("1");
  const [isRenewalDropdownOpen, setIsRenewalDropdownOpen] = useState(false);

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchDomainDetails = async () => {
      try {
        const response = await fetch(`/api/domainList/domainDetails/${id}`);
        const data = await response.json();
        if (data.success) {
          setDomain(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch domain details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDomainDetails();
    }
  }, [id]);

  // const sendRenewalEmail = async () => {
  //   if (!domain || !domain.email) {
  //     alert("No email available for this domain");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // First, update the domain expiry date
  //     const newExpiryDate = new Date(domain.domainExpiryDate);
  //     newExpiryDate.setFullYear(
  //       newExpiryDate.getFullYear() + parseInt(renewalPeriod)
  //     );

  //     const updateResponse = await fetch(`/api/domainList/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ domainExpiryDate: newExpiryDate }),
  //     });

  //     const updateData = await updateResponse.json();

  //     if (!updateData.success) {
  //       throw new Error("Failed to update domain expiry date");
  //     }

  //     // Then, send the renewal email
  //     const emailResponse = await fetch("/api/sendRenewalEmail", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: domain.email,
  //         renewalPeriod: renewalPeriod,
  //         newExpiryDate: newExpiryDate.toISOString(),
  //       }),
  //     });

  //     const emailData = await emailResponse.json();

  //     if (emailData.success) {
  //       alert(
  //         `Domain renewed for ${renewalPeriod} year(s) and email sent successfully`
  //       );
  //       // Update the local state to reflect the new expiry date
  //       setDomain({ ...domain, domainExpiryDate: newExpiryDate.toISOString() });
  //     } else {
  //       throw new Error("Failed to send email");
  //     }
  //   } catch (error) {
  //     console.error("Error in renewal process:", error);
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //     setIsRenewalDropdownOpen(false);
  //   }
  // };

  const sendRenewalEmail = async (selectedPeriod) => {
    if (!domain || !domain.email) {
      alert("No email available for this domain");
      return;
    }

    try {
      setLoading(true);

      // Calculate the new expiry date based on the selected period
      const newExpiryDate = new Date(domain.domainExpiryDate);
      newExpiryDate.setFullYear(
        newExpiryDate.getFullYear() + parseInt(selectedPeriod)
      );

      const updateResponse = await fetch(`/api/domainList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domainExpiryDate: newExpiryDate }),
      });

      const updateData = await updateResponse.json();

      if (!updateData.success) {
        throw new Error("Failed to update domain expiry date");
      }

      // Send the renewal email with the correct period and new expiry date
      const emailResponse = await fetch("/api/sendRenewalEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: domain.email,
          renewalPeriod: selectedPeriod,
          newExpiryDate: newExpiryDate.toISOString(),
        }),
      });

      const emailData = await emailResponse.json();

      if (emailData.success) {
        alert(
          `Domain renewed for ${selectedPeriod} year(s) and email sent successfully`
        );
        // Update the local state to reflect the new expiry date
        setDomain({ ...domain, domainExpiryDate: newExpiryDate.toISOString() });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error in renewal process:", error);
      alert(error.message);
    } finally {
      setLoading(false);
      setIsRenewalDropdownOpen(false);
    }
  };

  const handleDeleteClick = (domainId) => {
    setDeleteDomainId(domainId);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowModal(false);

    try {
      setLoading(true);
      const response = await fetch(`/api/domainList?id=${deleteDomainId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        router.push("/");
        alert("Domain deleted successfully!");
      } else {
        alert("Failed to delete domain: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting domain:", error);
      alert("An error occurred while deleting the domain.");
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveClick = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/domainList?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isArchived: !domain.isArchived }),
      });

      const result = await response.json();
      if (result.success) {
        setDomain(result.data);
      } else {
        alert("Failed to update archive status: " + result.message);
      }
    } catch (error) {
      alert("An error occurred while updating the archive status.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen -mt-10 grid place-items-center">
        <p className="text-xl md:text-2xl font-bold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className=" text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Domain Details</h1>
      {domain && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <div className="bg-red-600 text-white px-4 py-2 font-bold text-sm md:text-base">
              {domain.domainName}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="col-span-1">
                <table className="w-full text-sm md:text-base">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">Customer Name</td>
                      <td className="py-2">{domain.companyName}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">Email</td>
                      <td className="py-2 break-all">{domain.email}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">Phone</td>
                      <td className="py-2">{domain.phone}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">
                        Domain Purchase Date
                      </td>
                      <td className="py-2">
                        {formatDate(domain.domainPurchaseDate)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">Domain Expiry Date</td>
                      <td className="py-2">
                        {formatDate(domain.domainExpiryDate)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">
                        Domain Selling Price
                      </td>
                      <td className="py-2">
                        {domain.domainSellingPrice}{" "}
                        {domain.domainSellingCurrency}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">
                        Domain Buying Price
                      </td>
                      <td className="py-2">
                        {domain.domainBuyingPrice} {domain.domainBuyingCurrency}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-span-1">
                <table className="w-full text-sm md:text-base">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">Hosting Package</td>
                      <td className="py-2">{domain.hostingUnit}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">Hosting Price</td>
                      <td className="py-2">
                        {domain.hostingPrice} {domain.hostingCurrency}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">
                        Hosting Purchase Date
                      </td>
                      <td className="py-2">
                        {formatDate(domain.hostingPurchaseDate)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">
                        Hosting Expiry Date
                      </td>
                      <td className="py-2">
                        {formatDate(domain.hostingExpiryDate)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">Hosting Company</td>
                      <td className="py-2">{domain.hostingCompany}</td>
                    </tr>
                  </tbody>
                </table>

                <div>
                  <div className="pt-2 font-semibold">Note</div>
                  <div className="pr-3 text-justify">{domain?.note}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <div className="relative">
              <button
                onClick={() => setIsRenewalDropdownOpen(!isRenewalDropdownOpen)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Renew Domain
              </button>
              {isRenewalDropdownOpen && (
                <div className="absolute right-0 -top-44 mt-2 rounded-md shadow-xl bg-blue-300 ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div>
                      <p className="p-2 text-xs text-center text-blue-900">This will send a email to the customer</p>
                      {["1", "2", "5"].map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setRenewalPeriod(year);
                            sendRenewalEmail(year);
                          }}
                          className=" p-2 text-sm text-gray-700 hover:bg-blue-200 hover:text-gray-900 w-full text-center"
                          role="menuitem"
                        >
                          Renew for {year} year{year !== "1" ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href={`/home/domainHistory/${id}`}>
              <button className="bg-green-300 px-4 py-2 rounded ">
                History
              </button>
            </Link>
            <Link href={`/home/editDomainDetails/${id}`}>
              <button className="bg-blue-400 px-4 py-2 rounded ">Edit</button>
            </Link>

            <button
              className="bg-red-400 px-4 py-2 rounded disabled:cursor-not-allowed disabled:bg-red-300"
              disabled={loading}
              onClick={() => handleDeleteClick(id)}
            >
              {loading ? <Loader /> : "Delete"}
            </button>

            <button
              onClick={handleArchiveClick}
              className="bg-yellow-400 px-4 py-2 rounded disabled:cursor-not-allowed disabled:bg-yellow-300"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : domain.isArchived
                ? "Unarchive"
                : "Archive"}
            </button>
          </div>
        </>
      )}

      <DeleteConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}

// ---------------------------------------- //
const DeleteConfirmationModal = ({ show, onClose, onDelete }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-md shadow-md w-1/3">
        <h3 className="text-lg font-semibold">
          Are you sure you want to delete this from the list?
        </h3>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-3 py-1 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 px-3 py-1 rounded-md text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
