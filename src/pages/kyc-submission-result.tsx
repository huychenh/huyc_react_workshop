import { useEffect, useState } from "react";
import type { SubmissionInfo } from "../types/submission-info";
import { API_URL_GET_KYC_SUBMISSION_BY_ID, API_URL_GET_KYC_SUBMISSIONS } from "../constant/url";
import { useParams } from "react-router-dom";

const KYCSubmissionResult = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  // Normalize API data to SubmissionInfo
  const normalizeSubmission = (item: any): SubmissionInfo => {
    const today = new Date().toISOString().split("T")[0];

    return {
      id: item.id,
      name: `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),
      status: item.kyc_status ?? "Pending",
      date: item.createdAt ? item.createdAt.split("T")[0] : today,
    };
  };

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const url = id
          ? API_URL_GET_KYC_SUBMISSION_BY_ID(Number(id))
          : API_URL_GET_KYC_SUBMISSIONS;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load submissions");

        const data = await res.json();

        const normalized: SubmissionInfo[] = id
          ? [normalizeSubmission(data)] // fetch single submission
          : Array.isArray(data.users)   // fetch all submissions
            ? data.users.map((item: any) => normalizeSubmission(item))
            : [];

        setSubmissions(normalized);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  // Status CSS class
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

  // Loading / Error / Empty states
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!submissions.length) return <div>No submissions found.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">KYC Submissions Result</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Date</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{submission.name}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${getStatusClass(
                      submission.status
                    )}`}
                  >
                    {submission.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{submission.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KYCSubmissionResult;
