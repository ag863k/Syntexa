import React, { useState } from 'react';
import ProblemService from '../services/problem.service';
import { useNavigate } from 'react-router-dom';

const ProblemCreatePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const problem = await ProblemService.createProblem({ title, description });
      await ProblemService.addNoteToProblem(problem.id, {
        approachTitle: 'My Approach',
        content: note,
        language,
      });
      setSuccess(true);
      setTimeout(() => navigate('/mynotes'), 1200);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-purple-500/20 mt-8">
      <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">Create a Problem & Note</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Problem Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="p-3 rounded-lg border border-cyan-700 bg-gray-800 text-white focus:border-cyan-400"
        />
        <textarea
          placeholder="Problem Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="p-3 rounded-lg border border-cyan-700 bg-gray-800 text-white focus:border-cyan-400 min-h-[80px]"
        />
        <textarea
          placeholder="Your Note / Solution"
          value={note}
          onChange={e => setNote(e.target.value)}
          required
          className="p-3 rounded-lg border border-purple-700 bg-gray-800 text-white focus:border-purple-400 min-h-[120px]"
        />
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-cyan-400"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
          <option value="c#">C#</option>
          <option value="go">Go</option>
          <option value="typescript">TypeScript</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg mt-2 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Problem & Note'}
        </button>
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        {success && <div className="text-green-400 text-center mt-2">Created! Redirecting...</div>}
      </form>
    </div>
  );
};

export default ProblemCreatePage;
