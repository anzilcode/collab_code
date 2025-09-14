function InterviewCard({ role, date, status }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{role}</h3>
        <p className="text-gray-400">{date}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          status === "Scheduled"
            ? "bg-blue-600"
            : status === "Completed"
            ? "bg-green-600"
            : status === "Rejected"
            ? "bg-red-600"
            : "bg-gray-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

export default InterviewCard