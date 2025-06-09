import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import AuthService from '../services/auth.service';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { copyToClipboard } from '../utils/clipboard';

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

  const userNotes = problem?.notes?.filter(
    (note) => note.author?.username === currentUser?.username
  ) || [];

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
    <div /* your styling wrapper here */>
      {/* Problem title + description */}
      <div>
        <h1>{problem.title}</h1>
        <button onClick={() => copyToClipboard(window.location.href)}>Copy Link</button>
        <p>{problem.description}</p>
      </div>

      {/* User notes list */}
      {userNotes.length ? (
        userNotes.map((note) => (
          <div key={note.id} onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}>
            <div>
              <span>{note.language}</span>
              <span>{note.approachTitle}</span>
            </div>
            {expandedNoteId === note.id && (
              <div>
                <p>by {note.author.username}</p>
                <SyntaxHighlighter language={note.language} style={vscDarkPlus}>
                  {note.content}
                </SyntaxHighlighter>
                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(window.location.href + `#note-${note.id}`); }}>Copy Link</button>
                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(note.content); }}>Copy Code</button>
                <button onClick={(e) => { e.stopPropagation(); handleEditNote(note); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>
          <p>You haven't added any approaches yet.</p>
          {currentUser && <button onClick={() => document.getElementById('add-note-form').scrollIntoView()}>+ Add Your First Note</button>}
        </div>
      )}

      {/* Note form */}
      {currentUser && (
        <div id="add-note-form">
          <h3>{editNote ? 'Editing Note / Approach' : 'Add Your Note / Approach'}</h3>
          {editNote && <button onClick={cancelEdit}>Cancel Edit</button>}
          <form onSubmit={editNote ? handleUpdateNote : handleAddNote}>
            <input
              type="text"
              placeholder="Approach Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Notes / Code"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
              rows={8}
            />
            <select value={noteLanguage} onChange={(e) => setNoteLanguage(e.target.value)}>
              {languageOptions.map((lang) => (
                <option value={lang} key={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
              ))}
            </select>
            <button type="submit" disabled={submitting}>
              {submitting ? (editNote ? 'Saving...' : 'Submitting...') : (editNote ? 'Save Changes' : 'Submit Note')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProblemDetailPage;