import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { BASE_URL } from '../config';

interface Question {
  id: number;
  title: string;
  description: string;
  user: {
    id: number;
    username: string;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
  created_at: string;
  num_answers: number;
  vote_score: number;
}

const QAHomepage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Answers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const filterOptions = [
    "Newest",
    "Unanswered", 
    "Active",
    "Bountied",
    "Hot",
    "Week",
    "Month",
  ];

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${BASE_URL}api/questions/`);
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          setError('Failed to fetch questions');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Network error while fetching questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionClick = (questionId: number) => {
    navigate(`/question/${questionId}`);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 relative">
      <div className="bg-gray-900 text-white p-4 border-b border-gray-700 flex justify-center items-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Ask New Question Button */}
            <button 
              onClick={() => navigate('/ask')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ask New question
            </button>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 border border-gray-500 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-800 hover:border-gray-400 transition-colors"
              >
                  <span className="font-medium">{selectedFilter}</span>
                  {/* <span className="text-gray-500">Unanswered</span> */}
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">more</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </button>

              {/* Dropdown Menu */}
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedFilter(option);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedFilter === option
                          ? "bg-gray-700 text-blue-400"
                          : "text-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[90%] justify-center gap-8">
        {/* Promo Panel */}
        <div className="mx-auto px-4 py-8 flex-shrink-0 w-[20rem]">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-xl">💎</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                Pro account is more powerful. Get 30% off
              </h3>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Get Pro
              </button>
            </div>
          </div>
        </div>

        {/* Questions Panel */}
        <div className="p-6 mt-3 flex-grow w-[65rem]">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Tabs */}
            <div className="flex space-x-8 mb-6 border-b">
              {["Answers", "Questions", "Experts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-medium transition-colors ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="border-b pb-6 last:border-b-0 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    {question.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 font-bold">
                        - {question.user.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        {timeAgo(question.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{question.num_answers} answers</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="text-green-600 font-semibold">↑{question.vote_score}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 cursor-pointer"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAHomepage;
