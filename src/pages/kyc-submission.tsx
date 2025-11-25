const KYCSubmission = () => {
  //Get data from API
  const submissions: any[] = [
    { name: "Nguyen Van A", status: "Approved", date: "2024-11-25" },
  ];

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
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((submission, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{submission.name}</td>
                  <td className="px-4 py-2 border-b">{submission.status}</td>
                  <td className="px-4 py-2 border-b">{submission.date}</td>
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
