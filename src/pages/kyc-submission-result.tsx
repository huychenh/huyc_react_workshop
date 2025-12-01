import { useLocation } from "react-router-dom";

const KYCSubmissionResult = () => {
  const { state } = useLocation();
  const submission = state?.submission;

  if (!submission) {
    return (
      <div className="text-center text-red-500 text-lg py-10">
        Submission not found.
      </div>
    );
  }

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">KYC Submission Result</h2>

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
            <tr key={submission.id} className="hover:bg-gray-50">
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KYCSubmissionResult;
