function JoinRoomModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-96">
        <h2 className="text-2xl font-semibold mb-4">Join Interview Room</h2>
        <input
          type="text"
          placeholder="Enter Room Code"
          className="w-full border border-gray-700 bg-gray-900 p-2 rounded-lg mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600">
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinRoomModal;
