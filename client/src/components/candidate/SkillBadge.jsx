import { X } from "lucide-react";

function SkillBadge({ skill, onRemove }) {
  return (
    <span className="flex items-center bg-gray-700 px-3 py-1 rounded-full text-sm">
      {skill}
      <button onClick={onRemove} className="ml-2 text-red-400 hover:text-red-600">
        <X size={14} />
      </button>
    </span>
  );
}

export default SkillBadge;
