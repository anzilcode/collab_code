import { useState, useEffect } from 'react';
import { Plus, Trash2, MessageSquare, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestionData, setNewQuestionData] = useState({
    question: '',
    title: '',
    difficulty: 'Easy',
    category: '',
    timeEstimate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = "http://localhost:4000/api/questions";
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError('');
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const addQuestion = async () => {
    if (!newQuestionData.question.trim() || !newQuestionData.title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await axios.post(
        API_URL,
        newQuestionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions([res.data, ...questions]);
      setNewQuestionData({
        question: '',
        title: '',
        difficulty: 'Easy',
        category: '',
        timeEstimate: '',
      });
    } catch (err) {
      console.error('Error adding question:', err);
      setError('Failed to add question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      setError('');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addQuestion();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
        <p className="text-gray-400 ml-4">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview Questions</h1>
          <p className="text-gray-400 mt-1">Manage your question bank to streamline recruitment</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MessageSquare className="w-4 h-4" />
          {questions.length} questions
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Add Question Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Plus className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Add New Question</h2>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={newQuestionData.title}
            onChange={(e) => setNewQuestionData({ ...newQuestionData, title: e.target.value })}
            placeholder="Question title..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            value={newQuestionData.question}
            onChange={(e) => setNewQuestionData({ ...newQuestionData, question: e.target.value })}
            onKeyPress={handleKeyPress}
            rows={3}
            placeholder="Enter your interview question here..."
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={newQuestionData.difficulty}
              onChange={(e) => setNewQuestionData({ ...newQuestionData, difficulty: e.target.value })}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <input
              type="text"
              value={newQuestionData.category}
              onChange={(e) => setNewQuestionData({ ...newQuestionData, category: e.target.value })}
              placeholder="Category..."
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newQuestionData.timeEstimate}
              onChange={(e) => setNewQuestionData({ ...newQuestionData, timeEstimate: e.target.value })}
              placeholder="Time Estimate..."
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={addQuestion}
              disabled={!newQuestionData.question.trim() || !newQuestionData.title.trim() || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Question
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Question Bank</h3>
            <p className="text-sm text-gray-400 mt-1">Click the trash icon to delete a question</p>
          </div>
          <div className="divide-y divide-gray-700">
            {questions.map((q, idx) => (
              <div
                key={q._id}
                className="group p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-gray-100 font-medium">{q.title}</p>
                        <p className="text-gray-300 text-sm mt-1">{q.question}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span>Difficulty: {q.difficulty}</span>
                          <span>Category: {q.category || 'N/A'}</span>
                          <span>Time: {q.timeEstimate || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    title="Delete question"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No questions yet</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Get started by adding your first interview question above. Build a comprehensive question bank to streamline your recruitment process.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
