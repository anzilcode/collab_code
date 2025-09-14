function StatCard({ label, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-gray-400">{label}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
export default StatCard;
