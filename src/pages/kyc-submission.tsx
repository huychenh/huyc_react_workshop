const KYCSubmission = () => {
  const submissions: any[] = [
    { name: "Nguyen Van A", status: "Approved", date: "2024-11-25" },
    { name: "Nguyen Van B", status: "Pending", date: "2024-12-25" },
    { name: "Nguyen Van C", status: "Active", date: "2025-01-01" },
    { name: "Nguyen Van D", status: "Inactive", date: "2022-02-02" },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">KYC Submission</h2>
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
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((submission, index) => (
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

                  {/* Actions buttons */}
                  <td className="px-4 py-2 border-b space-x-2">
                    <button className="px-3 py-1 border border-green-500 text-green-500 rounded hover:bg-green-50">
                      Approve
                    </button>
                    <button className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50">
                      Reject
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled
          >
            Previous
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCSubmission;
