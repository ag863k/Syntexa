import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import AuthService from '../services/auth.service';

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState(AuthService.getCurrentUser());

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await ProblemService.getProblemById(id);
        setProblem(response.data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) {
      alert('Title and content cannot be empty.');
      return;
    }
    setSubmitting(true);
    const noteData = {
      approachTitle: noteTitle,
      content: noteContent,
    };
    try {
      // Attempt adding the note to the problem
      await ProblemService.addNoteToProblem(id, noteData);
      // Refresh the problem data with the newly added note
      const response = await ProblemService.getProblemById(id);
      setProblem(response.data);
      // Clear the fields once done
      setNoteTitle('');
      setNoteContent('');
    } catch (err) {
      alert(
        'Failed to add note: ' +
          (err.response?.data?.message || err.toString())
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <p className="text-center text-cyan-400">
        Loading Problem Details...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500">
        Error: Could not load the problem.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 p-8 rounded-xl shadow-lg border border-cyan-500/20">
        <h1 className="text-4xl font-bold text-white">{problem.title}</h1>
        <p className="text-lg text-gray-300 mt-4">{problem.description}</p>
      </div>

      <div className="my-8 border-t border-gray-700"></div>

      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
        Collaborative Notes
      </h2>

      <div className="space-y-6">
        {problem.notes && problem.notes.length > 0 ? (
          problem.notes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-800 p-6 rounded-lg border border-gray-700/50"
            >
              <h3 className="text-xl font-semibold text-cyan-400">
                {note.approachTitle}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                by {note.author ? note.author.username : 'Unknown'}
              </p>
              <pre className="text-gray-300 bg-gray-900 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                <code>{note.content}</code>
              </pre>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No notes have been added for this problem yet. Be the first!
          </p>
        )}
      </div>

      {currentUser && (
        <div className="mt-12 bg-slate-800/50 p-8 rounded-xl border border-cyan-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Add Your Note / Approach
          </h3>
          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label
                htmlFor="approachTitle"
                className="text-sm font-bold text-gray-400 block mb-2"
              >
                Approach Title
              </label>
              <input
                type="text"
                id="approachTitle"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g., Two Pointer Solution"
                className="w-full p-3 text-white bg-gray-700/50 rounded-md border border-gray-600 focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="text-sm font-bold text-gray-400 block mb-2"
              >
                Your Notes / Code
              </label>
              <textarea
                id="content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Explain your approach here..."
                rows="10"
                className="w-full p-3 text-white bg-gray-700/50 rounded-md border border-gray-600 focus:border-cyan-400 font-mono"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="py-2 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-md text-white font-bold"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Note'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProblemDetailPage;
