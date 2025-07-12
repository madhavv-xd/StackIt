import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Questions
          </button>
          
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <span>Question</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700">{question.title.substring(0, 30)}...</span>
          </nav>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {question.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span>Asked by <strong>{question.user.username}</strong></span>
                <span>{timeAgo(question.created_at)}</span>
                <span>{answers.length} answers</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-green-600">
                <ChevronUp className="w-5 h-5" />
              </button>
              <span className="text-lg font-semibold text-gray-700">{question.vote_score}</span>
              <button className="p-2 text-gray-400 hover:text-red-600">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2 mb-4">
            {question.tags.map((tag) => (
              <span key={tag.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                {tag.name}
              </span>
            ))}
          </div>
          
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Answers Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>
          
          {answers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No answers yet. Be the first to help!
            </p>
          ) : (
            <div className="space-y-6">
              {answers.map((answer) => (
                <div key={answer.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <span className="text-lg font-semibold text-gray-700">{answer.vote_score}</span>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <ChevronDown className="w-5 h-5" />
                      </button>
                      {answer.is_accepted && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div 
                        className="prose max-w-none text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: answer.content }}
                      />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Answered by <strong>{answer.user.username}</strong></span>
                        <span>{timeAgo(answer.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="mt-4">
            <button
              onClick={handleSubmitAnswer}
              disabled={!answerText.trim() || submittingAnswer}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingAnswer ? 'Submitting...' : 'Post Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
