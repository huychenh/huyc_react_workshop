import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SubmissionInfo } from "../types/submission-info";
import { ADMIN_URL, API_URL_GET_KYC_SUBMISSIONS } from "../constant/url";
import { getLoggedInUser } from "../constant/auth";

const KYCSubmission = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loggedUser = getLoggedInUser();
  const loggedUserId = loggedUser?.id ?? 0;
  const loggedUserRole = loggedUser?.role ?? "";

  // Inline confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    index: number | null;
    action: "Approved" | "Rejected" | "";
  }>({ index: null, action: "" });

  const normalizeSubmission = (item: any): SubmissionInfo => {
    return {
      id: item.id,
      name: `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),
      status: item.kyc_status ?? "Pending",
      date: item.createdAt ? item.createdAt.split("T")[0] : "2024-01-01",
      userId: item.userId ?? item.id,
    };
  };

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const res = await fetch(API_URL_GET_KYC_SUBMISSIONS);
        if (!res.ok) throw new Error("Failed to load submissions");

        const data = await res.json();

        const normalized: SubmissionInfo[] = Array.isArray(data.users)
          ? data.users.map((item: any) => normalizeSubmission(item))
          : [];

        if (loggedUserRole === "officer") {
          setSubmissions(normalized);
        } else {
          setSubmissions([]);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [loggedUserId, loggedUserRole]);

  // Status CSS
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle Approve / Reject
  const handleStatusChange = (
    index: number,
    newStatus: "Approved" | "Rejected"
  ) => {
    const updated = [...submissions];
    updated[index].status = newStatus;
    setSubmissions(updated);
    setConfirmAction({ index: null, action: "" });
  };

  // UI States
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!submissions.length) {
    return (
      <div className="text-center text-red-500 text-lg py-10">
        Submission not found.
      </div>
    );
  }

  const goToResult = () => `${ADMIN_URL.SUBMISSION_RESULTS}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">KYC Submissions</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* Name link */}
                <td className="px-4 py-2 border-b">
                  <Link
                    to={goToResult()}
                    state={{ submission }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {submission.name}
                  </Link>
                </td>

                {/* Status */}
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${getStatusClass(
                      submission.status
                    )}`}
                  >
                    {submission.status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-2 border-b">{submission.date}</td>

                {/* Actions */}
                <td className="px-4 py-2 border-b space-x-2">
                  {confirmAction.index === index ? (
                    <>
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={() =>
                          handleStatusChange(
                            index,
                            confirmAction.action as "Approved" | "Rejected"
                          )
                        }
                      >
                        Yes
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-300 rounded"
                        onClick={() =>
                          setConfirmAction({ index: null, action: "" })
                        }
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-3 py-1 border border-green-500 text-green-500 rounded hover:bg-green-50"
                        onClick={() =>
                          setConfirmAction({ index, action: "Approved" })
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                        onClick={() =>
                          setConfirmAction({ index, action: "Rejected" })
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KYCSubmission;
