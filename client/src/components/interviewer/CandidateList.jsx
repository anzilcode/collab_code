import { useState } from "react";
import { Mail, Phone, MapPin, Search, X } from "lucide-react";

const CandidateList = ({ candidates, onSelectCandidate }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter candidates based on search query
  const filteredCandidates = candidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(query) ||
      candidate.position.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(query))
    );
  });

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold text-gray-100 tracking-tight">
          Candidates
        </h2>
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-700 rounded-r-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-200" />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="text-sm text-gray-400">
          {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-lg hover:border-gray-600 transition-all duration-200 cursor-pointer group"
            onClick={() => onSelectCandidate(candidate)}
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-400 transition-colors"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  {candidate.position}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{candidate.location}</span>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-900 text-blue-200 rounded-md text-xs font-medium border border-blue-800"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-xs font-medium border border-gray-600">
                  +{candidate.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {searchQuery && filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No candidates found</h3>
          <p className="text-gray-400">
            Try adjusting your search terms or{" "}
            <button
              onClick={clearSearch}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              clear the search
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateList;