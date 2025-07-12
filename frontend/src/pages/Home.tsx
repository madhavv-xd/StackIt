import { useState } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  MessageSquare,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const QAHomepage = () => {
  const [activeTab, setActiveTab] = useState("Answers");
  const [sortBy, setSortBy] = useState("By rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const navigate=useNavigate();
  const filterOptions = [
    "Newest",
    "Unanswered",
    "Active",
    "Bountied",
    "Hot",
    "Week",
    "Month",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      console.log("Searching for:", searchQuery);
    }
  };

  // Sample data
  const questions = [
    {
      id: 1,
      title:
        "How to join 2 columns in a data set to make a separate column in SQL",
      description:
        "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine...",
      tags: ["sql", "database"],
      answers: 5,
      views: 234,
      user: "John Doe",
      timeAgo: "5 ans",
    },
    {
      id: 2,
      title: "Is it possible to survive in a black hole?",
      description:
        "Understanding the physics behind black holes and what happens to matter and energy...",
      tags: ["astronomy", "astrophysics", "black-hole"],
      answers: 24,
      views: 1523,
      user: "Christina Sorokina",
      timeAgo: "3 ans",
      upvotes: 815,
    },
    {
      id: 3,
      title: "Best practices for React component optimization",
      description:
        "What are the most effective ways to optimize React components for better performance...",
      tags: ["react", "performance"],
      answers: 8,
      views: 456,
      user: "Alex Smith",
      timeAgo: "2 ans",
    },
  ];

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   console.log("Searching for:", searchQuery);
  // };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuestions.length / 10);          // for pagination

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 relative">
      <div className="bg-gray-900 text-white p-4 border-b border-gray-700 flex justify-center items-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Ask New Question Button */}
            <button onClick={()=> navigate("/add-new-ques")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
                </div>w
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

            {/* Search Bar
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            </div> */}
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
                  className="border-b pb-6 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    {question.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 font-bold">
                        - {question.user}
                      </span>
                      <span className="text-sm text-gray-500">
                        {question.timeAgo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{question.answers} answers</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{question.views} views</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 cursor-pointer"
                      >
                        {tag}
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
