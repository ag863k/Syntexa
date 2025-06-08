import React, { useEffect, useState } from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    axios.get('https://syntexa-api.onrender.com/api/v1/notes/mine', {
      headers: { Authorization: 'Bearer ' + currentUser.token }
    })
      .then(res => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch your notes.');
        setLoading(false);
      });
    // Poll for updates every 30 seconds in background
    const interval = setInterval(() => {
      axios.get('https://syntexa-api.onrender.com/api/v1/notes/mine', {
        headers: { Authorization: 'Bearer ' + currentUser.token }
      })
        .then(res => setNotes(res.data))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  function filterAndSortNotes(notes) {
    let filtered = notes.filter(note =>
      note.approachTitle.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id));
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.approachTitle.localeCompare(b.approachTitle));
    }
    return filtered;
  }

  if (!currentUser) return <div className="text-center text-lg text-gray-400 mt-12">Please log in to view your notes.</div>;
  if (loading) return <div className="text-center text-cyan-400 mt-12">Loading your notes...</div>;
  if (error) return <div className="text-center text-red-400 mt-12">{error}</div>;

  const filteredNotes = filterAndSortNotes(notes);

  // Unique problem titles for filter dropdown
  const problemTitles = Array.from(new Set(notes.map(n => n.problem?.title).filter(Boolean)));
  const notesToShow = problemFilter ? filteredNotes.filter(n => n.problem?.title === problemFilter) : filteredNotes;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">My Notes & Approaches</h1>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-lg border border-cyan-700 bg-gray-900 text-white focus:border-cyan-400 shadow-inner"
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="p-3 rounded-lg border border-purple-700 bg-gray-900 text-white focus:border-purple-400 shadow-inner"
        >
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select
          value={problemFilter}
          onChange={e => setProblemFilter(e.target.value)}
          className="p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:border-cyan-400 shadow-inner"
        >
          <option value="">All Problems</option>
          {problemTitles.map(title => <option key={title} value={title}>{title}</option>)}
        </select>
      </div>
      {notesToShow.length === 0 ? (
        <div className="text-center text-gray-400">No notes found.</div>
      ) : (
        <div className="space-y-8">
          {notesToShow.map(note => (
            <div key={note.id} className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-purple-500/20 shadow-lg backdrop-blur-md">
              <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold text-purple-300">{note.approachTitle}</h2>
                <span className="text-xs text-gray-400 mt-2 md:mt-0">{note.problem?.title ? `Problem: ${note.problem.title}` : `Problem ID: ${note.problem?.id}`}</span>
              </div>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{background:'transparent', padding:0, margin:0}} wrapLongLines>
                {note.content}
              </SyntaxHighlighter>
              <div className="mt-2 text-sm text-gray-500">Created by you</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotesPage;
