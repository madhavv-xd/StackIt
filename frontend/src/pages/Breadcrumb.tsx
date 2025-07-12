import React, { useState } from 'react';
import { ChevronRight, ChevronUp, ChevronDown, Bell, User, Bold, Italic, Strikethrough, List, ListOrdered, Link2, Image, Code, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function QuestionDetailPage() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const handleLogin = () => {
    setIsSignedIn(true);
  };

  const handleLogout = () => {
    setIsSignedIn(false);
    setShowProfileDropdown(false);
  };

  const handleSubmit = () => {
    if (answerText.trim()) {
      alert('Answer submitted!');
      setAnswerText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-blue-400 mb-6">
          <a href="#" className="hover:text-blue-300">Question</a>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">How to join 2...</span>
        </nav>

        {/* Question */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">
            How to join 2 columns in a data set to make a separate column in SQL
          </h1>
          <div className="flex space-x-2 mb-4">
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">Tags</span>
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">Tags</span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            I do not know the code for it as I am a beginner. As an example what I need to do is like there is a 
            column 1 containing First name and column 2 consists of last name I want a column to combine
          </p>
        </div>

        {/* Side Note */}
        <div className="text-sm text-gray-400 mb-6">
          <p>If not login then not able to do vote (show a quick login/signup popup) No multiple votes allowed</p>
          <p>User can up-vote answer (once per user)</p>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Answers</h2>
          
          {/* Answer 1 */}
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <button className="p-1 hover:bg-gray-700 rounded">
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-sm font-semibold text-gray-300 py-2">0</span>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Answer 1</h3>
                <p className="text-gray-300 mb-2">-The || Operator.</p>
                <p className="text-gray-300 mb-2">-The + Operator.</p>
                <p className="text-gray-300">-The CONCAT Function.</p>
              </div>
            </div>
          </div>

          {/* Answer 2 */}
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <button className="p-1 hover:bg-gray-700 rounded">
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-sm font-semibold text-gray-300 py-2">0</span>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Answer 2</h3>
                <p className="text-gray-300">Details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Answer Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Submit Your Answer</h3>
          
          {/* Toolbar */}
          <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-700 rounded-t-lg">
            <button className="p-2 hover:bg-gray-600 rounded">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded">
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded">
              <Strikethrough className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-600"></div>
            <button className="p-2 hover:bg-gray-600 rounded">
              <List className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded">
              <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-600"></div>
            <button className="p-2 hover:bg-gray-600 rounded">
              <Link2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded">
              <Image className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded">
              <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-600"></div>
            <button className="p-2 hover:bg-gray-600 rounded">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-600 rounded">
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full h-32 p-4 bg-gray-900 border border-gray-600 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Write your answer here..."
          />

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}