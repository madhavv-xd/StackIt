import { useState } from 'react';
import { MessageCircle, Users, Trophy, Bell, ArrowRight, Star, Code, Lightbulb, Heart, Zap, Target, BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-800 text-white border-b border-slate-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              StackIt
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#community" className="hover:text-purple-400 transition-colors">Community</a>
            <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105">
              Get Started
            </button>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="w-4 h-0.5 bg-white mb-1"></span>
              <span className="w-4 h-0.5 bg-white mb-1"></span>
              <span className="w-4 h-0.5 bg-white"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Ask, Learn, 
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}Grow Together
                </span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Join the most collaborative Q&A platform for developers, learners, and curious minds. 
                Share knowledge, get instant answers, and build your expertise in a vibrant community.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Asking</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-slate-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2">
                <span>Explore Questions</span>
                <BookOpen className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10K+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>50K+ Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>95% Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-sm border border-slate-700">
              <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">How to optimize React performance?</h3>
                    <p className="text-sm text-slate-400">React, Performance, Optimization</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>5 answers</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>23 votes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>156 views</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Rich Text Editor",
      description: "Format your questions and answers with bold, italic, lists, code blocks, and more. Express yourself clearly with our intuitive editor."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Community",
      description: "Join thousands of developers, learners, and experts sharing knowledge. Get help from real people who care about your growth."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Voting & Recognition",
      description: "Upvote helpful answers and get recognized for your contributions. Build reputation and showcase your expertise."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Stay updated with real-time notifications when someone answers your questions or mentions you in discussions."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Tagging System",
      description: "Organize questions with relevant tags. Find exactly what you're looking for and discover new topics of interest."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Get instant answers from our active community. Most questions receive helpful responses within minutes."
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Features That <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Empower</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to ask better questions, give better answers, and build meaningful connections with fellow learners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Community Section Component
const CommunitySection = () => {
  const stats = [
    { number: "10K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "50K+", label: "Questions Asked", icon: <MessageCircle className="w-6 h-6" /> },
    { number: "95%", label: "Questions Answered", icon: <Trophy className="w-6 h-6" /> },
    { number: "24/7", label: "Community Support", icon: <Heart className="w-6 h-6" /> }
  ];

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Join Our <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Thriving Community</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Connect with developers, students, and experts from around the world. Share knowledge, learn together, and grow your network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">{stat.number}</h3>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Ready to Start Your Journey?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Whether you're a beginner seeking guidance or an expert ready to share knowledge, StackIt is your platform for collaborative learning and growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-full text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105">
                  Join Community
                </button>
                <button className="border border-slate-300 px-8 py-4 rounded-full text-slate-700 font-semibold hover:bg-slate-100 transition-all">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                    <div className="flex-1 bg-white rounded-full h-3"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 bg-white rounded-full h-3"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-white rounded-full h-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                StackIt
              </h3>
            </div>
            <p className="text-slate-400 mb-4">
              The collaborative Q&A platform for developers, learners, and curious minds.
            </p>
            <div className="flex space-x-4">
              <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Ask Question</a></li>
              <li><a href="#" className="hover:text-white">Browse Questions</a></li>
              <li><a href="#" className="hover:text-white">Top Contributors</a></li>
              <li><a href="#" className="hover:text-white">Tags</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Guidelines</a></li>
              <li><a href="#" className="hover:text-white">Code of Conduct</a></li>
              <li><a href="#" className="hover:text-white">Moderation</a></li>
              <li><a href="#" className="hover:text-white">Events</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 mt-8 text-center text-slate-400">
          <p>&copy; 2024 StackIt. All rights reserved. Built with ❤️ for the developer community.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const StackItLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default StackItLanding;