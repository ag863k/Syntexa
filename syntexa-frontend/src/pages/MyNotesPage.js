import React, { useEffect, useState } from 'react';
import AuthService from '../services/auth.service';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { copyToClipboard } from '../utils/clipboard';
import ProblemService, { shareNote } from '../services/problem.service';
import { Link } from 'react-router-dom';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
];

const MyNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [problemFilter, setProblemFilter] = useState('');
  const [shareLoading, setShareLoading] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);
  const [shareError, setShareError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const currentUser = AuthService.getCurrentUser();

  // Enhanced loading with retry mechanism
  const loadNotes = async (isRetry = false) => {
    if (!currentUser) {
      setLoading(false);
      setError('You must be logged in to view your notes. Please log in.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Add retry delay for subsequent attempts
      if (isRetry && retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
      
      const response = await ProblemService.getMyNotes();
      console.log('My notes response:', response);
      setNotes(Array.isArray(response) ? response : []);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      const errorMessage = err?.response?.data?.message || err?.message || err || 'Failed to load notes';
      setError(errorMessage);
      
      // Auto-retry for network errors (up to 3 times)
      if (retryCount < 3 && (errorMessage.includes('Network Error') || errorMessage.includes('timeout'))) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadNotes(true), 2000);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Defensive timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Request timed out. Please try again.');
      }
    }, 15000);

    loadNotes();
    
    return () => clearTimeout(timeout);
  }, [currentUser]);

  function filterAndSortNotes(notes) {
    let filtered = notes.filter(note =>
      note.approachTitle?.toLowerCase().includes(search.toLowerCase()) ||
      note.content?.toLowerCase().includes(search.toLowerCase()) ||
      note.problemTitle?.toLowerCase().includes(search.toLowerCase())
    );

    switch (sort) {
      case 'oldest':
        return filtered.sort((a, b) => a.id - b.id);
      case 'title':
        return filtered.sort((a, b) => (a.approachTitle || '').localeCompare(b.approachTitle || ''));
      case 'newest':
      default:
        return filtered.sort((a, b) => b.id - a.id);
    }
  }

  const handleShareNote = async (noteId, problemId) => {
    setShareLoading(noteId);
    setShareError(null);
    setShareUrl(null);
    
    try {
      const shareToken = await shareNote(noteId, problemId);
      const url = `${window.location.origin}/shared/${shareToken}`;
      setShareUrl(url);
      copyToClipboard(url);
    } catch (err) {
      console.error('Share error:', err);
      setShareError(err.message || err.toString());
    } finally {
      setShareLoading(null);
    }
  };

  // Show login prompt if not logged in
  if (!currentUser || error === 'You must be logged in to view your notes. Please log in.') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-4">Access Your Notes</h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">Please log in to view and manage your coding notes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 rounded-xl text-white font-semibold shadow-lg transition-all text-center"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-3 border border-purple-500 text-purple-300 hover:bg-purple-800/20 rounded-xl font-semibold transition-all text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error && error !== 'You must be logged in to view your notes. Please log in.') {
    return (
      <div className="text-center mt-8">
        <div className="max-w-md mx-auto bg-red-900/20 border border-red-500/50 rounded-xl p-6">
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Notes</h3>
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredNotes = filterAndSortNotes(notes);
  const problemTitles = Array.from(new Set(notes.map(n => n.problemTitle).filter(Boolean)));
  const notesToShow = problemFilter ? filteredNotes.filter(n => n.problemTitle === problemFilter) : filteredNotes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
          My Coding Notes
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} in your collection
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 bg-gray-900/80 rounded-xl p-4 sm:p-6 border border-purple-500/20">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md lg:max-w-lg">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-sm sm:text-base"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={problemFilter}
              onChange={e => setProblemFilter(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-purple-400 text-sm sm:text-base min-w-0"
            >
              <option value="">All Problems</option>
              {problemTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
            
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-purple-400 text-sm sm:text-base min-w-0"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create Note Button */}
      <div className="mb-6 text-center">
        <Link 
          to="/problems/new" 
          className="inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 rounded-xl text-white font-semibold shadow-lg transition-all transform hover:scale-105 text-sm sm:text-base"
        >
          <span className="mr-2">+</span>
          Create New Note
        </Link>
      </div>

      {/* Notes Grid */}
      {notesToShow.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-600">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Notes Found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {search || problemFilter ? 'Try adjusting your filters' : 'Start by creating your first coding note!'}
            </p>
            {!search && !problemFilter && (
              <Link 
                to="/problems/new" 
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-colors"
              >
                Create Your First Note
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {notesToShow.map(note => (
            <div 
              key={note.id} 
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-4 sm:p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all shadow-xl backdrop-blur-sm"
            >
              {/* Note Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white truncate pr-2 flex-1">
                    {note.approachTitle || 'Untitled Note'}
                  </h3>
                  {note.isStarter && (
                    <span className="px-2 py-1 bg-green-600/20 border border-green-500/50 rounded-md text-green-400 text-xs font-semibold whitespace-nowrap flex-shrink-0">
                      Starter
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-purple-300 truncate">
                  Problem: {note.problemTitle || 'Unknown'}
                </p>
                {note.language && (
                  <p className="text-xs text-gray-400 mt-1">
                    Language: {note.language}
                  </p>
                )}
              </div>

              {/* Note Content Preview */}
              <div className="mb-4">
                <div className="bg-gray-950/50 rounded-lg p-3 max-h-32 overflow-hidden">
                  <SyntaxHighlighter
                    language={note.language || 'text'}
                    style={vscDarkPlus}
                    customStyle={{
                      background: 'transparent',
                      padding: 0,
                      margin: 0,
                      fontSize: '11px',
                      lineHeight: '1.4'
                    }}
                    showLineNumbers={false}
                  >
                    {note.content?.substring(0, 200) + (note.content?.length > 200 ? '...' : '') || 'No content'}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Note Actions */}
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/problems/${note.problemId}`}
                  className="flex-1 min-w-0 px-3 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded-lg text-cyan-300 hover:bg-cyan-600/30 transition-colors text-center text-xs sm:text-sm font-medium"
                >
                  View Full
                </Link>
                <button
                  onClick={() => handleShareNote(note.id, note.problemId)}
                  disabled={shareLoading === note.id}
                  className="px-3 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 flex-shrink-0"
                >
                  {shareLoading === note.id ? '...' : 'Share'}
                </button>
              </div>

              {/* Share Success/Error */}
              {shareUrl && (
                <div className="mt-3 p-2 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <p className="text-green-400 text-xs">Link copied to clipboard!</p>
                </div>
              )}
              {shareError && (
                <div className="mt-3 p-2 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-xs break-words">{shareError}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotesPage;
