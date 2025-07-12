import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, X, HelpCircle, Lightbulb, Users, MessageCircle, Plus } from 'lucide-react';
import RichTextEditorExample from '../components/TextEditor';
import { BASE_URL } from '../config';

interface TagType {
  id: number;
  name: string;
}

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Popular tags for suggestions
  const popularTags = [
    'javascript', 'react', 'python', 'css', 'html', 'node.js', 'typescript',
    'database', 'sql', 'mongodb', 'express', 'api', 'frontend', 'backend',
    'performance', 'debugging', 'algorithms', 'data-structures'
  ];

  // Fetch available tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${BASE_URL}api/tags/`);
        if (response.ok) {
          const tagsData = await response.json();
          setAvailableTags(tagsData);
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.trim());
    }
  };

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || tags.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please login to post a question');
        navigate('/auth');
        return;
      }

      const response = await fetch(`${BASE_URL}api/questions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description,
          tag_names: tags
        })
      });

      if (response.ok) {
        const questionData = await response.json();
        navigate(`/question/${questionData.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create question');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToQuestions = () => {
    navigate('/home');
  };

  const filteredSuggestions = [
    ...availableTags.filter(tag => 
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) && 
      !tags.includes(tag.name)
    ).map(tag => tag.name),
    ...popularTags.filter(tag => 
      tag.toLowerCase().includes(tagInput.toLowerCase()) && 
      !tags.includes(tag) &&
      !availableTags.some(availableTag => availableTag.name === tag)
    )
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-800 text-white border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToQuestions}
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Questions</span>
              </button>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  StackIt
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Ask a Question
            </h1>
            <p className="text-lg text-slate-600">
              Share your knowledge or ask the community for help. Be specific and provide context for the best answers.
            </p>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-800 mb-2">Tips for a Great Question</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Be specific and clear about your problem</li>
                  <li>• Include relevant code, error messages, or examples</li>
                  <li>• Add appropriate tags to help others find your question</li>
                  <li>• Search existing questions before posting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Question Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              {/* Title Field */}
              <div>
                <label className="block text-lg font-semibold text-slate-800 mb-3">
                  Question Title
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How to optimize React component performance?"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-slate-500">
                    Be specific and imagine you're asking a question to another person
                  </p>
                  <span className="text-sm text-slate-400">
                    {title.length}/200
                  </span>
                </div>
              </div>

              {/* Description Field - Placeholder for your text editor */}
              <div>
                <label className="block text-lg font-semibold text-slate-800 mb-3">
                  Description
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <RichTextEditorExample 
                  value={description}
                  onChange={handleDescriptionChange} 
                  placeholder="Describe your question in detail..."
                />

                <p className="text-sm text-slate-500 mt-2">
                  Include all the information someone would need to answer your question
                </p>
              </div>

              {/* Tags Field */}
              <div>
                <label className="block text-lg font-semibold text-slate-800 mb-3">
                  Tags
                  <span className="text-red-500 ml-1">*</span>
                </label>
                
                {/* Current Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowTagSuggestions(e.target.value.length > 0);
                    }}
                    onKeyPress={handleTagInputKeyPress}
                    onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
                    placeholder="Add tags (press Enter to add)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={tags.length >= 5}
                  />
                  
                  {/* Tag Suggestions */}
                  {showTagSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                      {filteredSuggestions.slice(0, 8).map((tag, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center space-x-2"
                        >
                          <Tag className="w-4 h-4 text-slate-400" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-slate-500">
                    Add up to 5 tags to describe what your question is about
                  </p>
                  <span className="text-sm text-slate-400">
                    {tags.length}/5 tags
                  </span>
                </div>

                {/* Popular Tags */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Popular tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.slice(0, 8).map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors flex items-center space-x-1"
                        disabled={tags.includes(tag) || tags.length >= 5}
                      >
                        <Plus className="w-3 h-3" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Posting...</span>
                  ) : (
                    <>
                      <span>Post Question</span>
                      <MessageCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Community Stats */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-center space-x-8 text-center">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">10K+ Ready to Help</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Avg. Response Time: 5 min</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AskQuestionPage;