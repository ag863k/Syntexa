import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import AuthService from '../services/auth.service';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { copyToClipboard } from '../utils/clipboard';
import { shareNote } from '../services/problem.service';

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState(AuthService.getCurrentUser());

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteLanguage, setNoteLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);

  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [editNote, setEditNote] = useState(null);

  const [shareLoading, setShareLoading] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);
  const [shareError, setShareError] = useState(null);

  // Fetch problem details when 'id' changes
  useEffect(() => {
    setLoading(true);
    ProblemService.getProblemById(id)
      .then((response) => {
        setProblem(response);
        setError(null);
      })
      .catch((err) => {
        setError(err.toString());
        setProblem(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Reset form & data when user or id changes
  useEffect(() => {
    setEditNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteLanguage('javascript');
    setExpandedNoteId(null);
    setProblem(null);
    setError(null);
    setLoading(true);

    ProblemService.getProblemById(id)
      .then((response) => {
        setProblem(response);
        setError(null);
      })
      .catch((err) => {
        setError(err.toString());
        setProblem(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser, id]);

  const refresh = () => {
    setLoading(true);
    ProblemService.getProblemById(id)
      .then((resp) => setProblem(resp))
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) {
      alert("Title and content cannot be empty.");
      return;
    }
    setSubmitting(true);
    ProblemService.addNoteToProblem(id, {
      approachTitle: noteTitle,
      content: noteContent,
      language: noteLanguage,
    })
      .then(() => {
        refresh();
        setNoteTitle('');
        setNoteContent('');
        setNoteLanguage('javascript');
      })
      .catch((err) => {
        alert("Failed to add note: " + (err.response?.data?.message || err.toString()));
      })
      .finally(() => setSubmitting(false));
  };

  const handleUpdateNote = (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) {
      alert("Title and content cannot be empty.");
      return;
    }
    setSubmitting(true);
    ProblemService.updateNote(id, editNote.id, {
      approachTitle: noteTitle,
      content: noteContent,
      language: noteLanguage,
    })
      .then(() => {
        setEditNote(null);
        setNoteTitle('');
        setNoteContent('');
        setNoteLanguage('javascript');
        refresh();
      })
      .catch((err) => {
        alert("Failed to update note: " + (err.response?.data?.message || err.toString()));
      })
      .finally(() => setSubmitting(false));
  };

  const handleDeleteNote = (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note/approach?')) return;
    setSubmitting(true);
    ProblemService.deleteNote(id, noteId)
      .then(() => {
        setExpandedNoteId(null);
        refresh();
      })
      .catch((err) => {
        alert('Failed to delete note: ' + (err.response?.data?.message || err.toString()));
      })
      .finally(() => setSubmitting(false));
  };

  const handleEditNote = (note) => {
    setEditNote(note);
    setNoteTitle(note.approachTitle);
    setNoteContent(note.content);
    setNoteLanguage(note.language || 'javascript');
  };

  const cancelEdit = () => {
    setEditNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteLanguage('javascript');
  };

  // Share handler
  const handleShareNote = (noteId) => {
    setShareLoading(noteId);
    setShareError(null);
    shareNote(id, noteId)
      .then((url) => {
        setShareUrl(window.location.origin + url);
        setShareLoading(null);
      })
      .catch((err) => {
        setShareError(err);
        setShareLoading(null);
      });
  };

  const userNotes = problem?.notes?.filter(
    (note) => note.author?.username === currentUser?.username
  ) || [];

  if (!currentUser) return <div className="text-center text-lg text-gray-400 mt-12">Please log in to view your notes for this problem.</div>;
  if (loading) return <p className="text-center text-cyan-400">Loading Problem Details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!problem) return <p className="text-center text-gray-400">No problem found.</p>;

  const languageOptions = [
    'python','java','cpp','javascript',
    'typescript','go','ruby','php',
    'kotlin','swift','rust','scala',
    'bash','plaintext',
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-2 sm:px-4 md:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 mb-8 text-center break-words">{problem?.title || 'Problem Details'}</h1>
      <div className="mb-6 p-3 sm:p-6 rounded-xl bg-gradient-to-r from-cyan-900 via-gray-900 to-gray-800 border border-cyan-500/40 text-cyan-200 font-semibold shadow-lg text-center flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <span className="break-words">{problem?.description || 'No description available.'}</span>
        <span className="text-xs text-gray-400 mt-2 md:mt-0">ID: {problem?.id}</span>
      </div>
      {/* User notes list */}
      <div className="mb-8">
        {userNotes.length ? (
          userNotes.map((note) => (
            <div key={note.id} className="mb-6 rounded-xl bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-cyan-700/30 shadow-lg flex flex-col gap-2 p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 cursor-pointer" onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}>
                <span className="inline-block px-2 py-1 rounded bg-cyan-900 text-cyan-200 text-xs font-mono mr-2 uppercase">{note.language}</span>
                <span className="font-semibold text-base sm:text-lg text-cyan-100 flex-1 break-words">{note.approachTitle}</span>
                <span className="text-xs text-gray-400 ml-2">{expandedNoteId === note.id ? '▲' : '▼'}</span>
              </div>
              {expandedNoteId === note.id && (
                <div className="p-2 sm:p-4 border-t border-cyan-700/20 bg-gray-950/80 rounded-b-xl flex flex-col gap-2">
                  <p className="mb-2 text-xs text-gray-400">by {note.author.username}</p>
                  <div className="mb-4 rounded-lg overflow-x-auto bg-gray-900/80 p-2">
                    <SyntaxHighlighter language={note.language} style={vscDarkPlus} customStyle={{background: 'transparent', fontSize: '1rem', borderRadius: '0.5rem', padding: '1rem'}}>
                      {note.content}
                    </SyntaxHighlighter>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button className="px-3 py-1 rounded bg-cyan-800 hover:bg-cyan-600 text-white text-xs font-semibold shadow" onClick={(e) => { e.stopPropagation(); copyToClipboard(window.location.href + `#note-${note.id}`); }}>Copy Link</button>
                    <button className="px-3 py-1 rounded bg-cyan-800 hover:bg-cyan-600 text-white text-xs font-semibold shadow" onClick={(e) => { e.stopPropagation(); copyToClipboard(note.content); }}>Copy Code</button>
                    <button className="px-3 py-1 rounded bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold shadow" onClick={(e) => { e.stopPropagation(); handleEditNote(note); }}>Edit</button>
                    <button className="px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-semibold shadow" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>Delete</button>
                    <button className="px-3 py-1 rounded bg-green-700 hover:bg-green-600 text-white text-xs font-semibold shadow" onClick={(e) => { e.stopPropagation(); handleShareNote(note.id); }}>Share</button>
                  </div>
                  {shareLoading === note.id && <div className="text-cyan-400 text-xs mt-2">Generating share link...</div>}
                  {shareUrl && expandedNoteId === note.id && (
                    <div className="mt-2 text-xs text-green-400 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <span>Shareable Link:</span>
                      <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="underline text-cyan-300 break-all">{shareUrl}</a>
                      <button className="ml-2 px-2 py-1 rounded bg-cyan-800 text-white text-xs" onClick={() => copyToClipboard(shareUrl)}>Copy</button>
                    </div>
                  )}
                  {shareError && expandedNoteId === note.id && <div className="text-xs text-red-400 mt-2">{shareError}</div>}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mb-6 text-base sm:text-lg">
            <p>You haven't added any approaches yet.</p>
            {currentUser && <button className="mt-2 px-4 py-2 rounded bg-cyan-800 hover:bg-cyan-600 text-white text-sm font-semibold shadow" onClick={() => document.getElementById('add-note-form').scrollIntoView()}>+ Add Your First Note</button>}
          </div>
        )}
      </div>
      {/* Note form */}
      {currentUser && (
        <div id="add-note-form" className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 shadow-lg border border-cyan-800/30">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-cyan-200">{editNote ? 'Editing Note / Approach' : 'Add Your Note / Approach'}</h3>
          <form onSubmit={editNote ? handleUpdateNote : handleAddNote} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Approach Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              required
              className="rounded px-3 py-2 bg-gray-800 text-white border border-cyan-700/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-base sm:text-lg"
            />
            <textarea
              placeholder="Your Notes / Code"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
              rows={8}
              className="rounded px-3 py-2 bg-gray-800 text-white border border-cyan-700/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-base sm:text-lg"
            />
            <select value={noteLanguage} onChange={(e) => setNoteLanguage(e.target.value)} className="rounded px-3 py-2 bg-gray-800 text-white border border-cyan-700/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-48 text-base sm:text-lg">
              {languageOptions.map((lang) => (
                <option value={lang} key={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
              ))}
            </select>
            <button type="submit" disabled={submitting} className="px-6 py-2 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-semibold shadow mt-2 text-base sm:text-lg">
              {submitting ? (editNote ? 'Saving...' : 'Submitting...') : (editNote ? 'Save Changes' : 'Submit Note')}
            </button>
            {editNote && <button className="mb-4 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold shadow w-fit" onClick={cancelEdit}>Cancel Edit</button>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProblemDetailPage;