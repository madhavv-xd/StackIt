import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronUp, ChevronDown, Bold, Italic, Strikethrough, List, ListOrdered, Link2, Code, Image, AlignLeft, AlignCenter, AlignRight} from 'lucide-react';
import { BASE_URL } from '../config';

interface User {
  id: number;
  username: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  user: User;
  tags: Tag[];
  created_at: string;
  num_answers: number;
  vote_score: number;
}

interface Answer {
  id: number;
  user: User;
  content: string;
  created_at: string;
  is_accepted: boolean;
  vote_score: number;
}

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      if (!id) return;

      try {
        // Fetch question details
        const questionResponse = await fetch(`${BASE_URL}api/questions/${id}/`);
        if (!questionResponse.ok) {
          setError('Question not found');
          return;
        }
        const questionData = await questionResponse.json();
        setQuestion(questionData);

        // Fetch answers
        const answersResponse = await fetch(`${BASE_URL}api/questions/${id}/answers/`);
        if (answersResponse.ok) {
          const answersData = await answersResponse.json();
          setAnswers(answersData);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        setError('Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAnswers();
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !id) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/auth');
      return;
    }

    setSubmittingAnswer(true);
    try {
      const response = await fetch(`${BASE_URL}api/questions/${id}/answers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: answerText
        })
      });

      if (response.ok) {
        const newAnswer = await response.json();
        setAnswers([...answers, newAnswer]);
        setAnswerText('');
      } else {
        setError('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Network error while submitting answer');
    } finally {
      setSubmittingAnswer(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Question not found'}</p>
          <button 
            onClick={() => navigate('/home')} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

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
              onClick={handleSubmitAnswer}
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