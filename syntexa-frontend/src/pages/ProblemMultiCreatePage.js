import React, { useState } from 'react';
import ProblemService from '../services/problem.service';
import { useNavigate } from 'react-router-dom';

const emptyRow = () => ({ title: '', description: '', note: '', language: 'javascript' });

const ProblemMultiCreatePage = () => {
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (idx, field, value) => {
    setRows(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const addRow = () => setRows(rows => [...rows, emptyRow()]);
  const removeRow = idx => setRows(rows => rows.length > 1 ? rows.filter((_, i) => i !== idx) : rows);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      for (const row of rows) {
        if (!row.title || !row.note) continue;
        const problem = await ProblemService.createProblem({ title: row.title, description: row.description });
        await ProblemService.addNoteToProblem(problem.id, {
          approachTitle: 'My Approach',
          content: row.note,
          language: row.language,
        });
      }
      setSuccess(true);
      setTimeout(() => navigate('/mynotes'), 1200);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-purple-500/20 mt-8">
      <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">Add Multiple Problems & Notes</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {rows.map((row, idx) => (
          <div key={idx} className="flex flex-col gap-2 border-b border-gray-700 pb-4 mb-4">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Problem Title"
                value={row.title}
                onChange={e => handleChange(idx, 'title', e.target.value)}
                required
                className="flex-1 p-2 rounded-lg border border-cyan-700 bg-gray-800 text-white focus:border-cyan-400"
              />
              <button type="button" onClick={() => removeRow(idx)} className="ml-2 px-2 py-1 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-semibold shadow">Remove</button>
            </div>
            <textarea
              placeholder="Problem Description (optional)"
              value={row.description}
              onChange={e => handleChange(idx, 'description', e.target.value)}
              className="p-2 rounded-lg border border-cyan-700 bg-gray-800 text-white focus:border-cyan-400 min-h-[60px]"
            />
            <textarea
              placeholder="Your Note / Solution"
              value={row.note}
              onChange={e => handleChange(idx, 'note', e.target.value)}
              required
              className="p-2 rounded-lg border border-purple-700 bg-gray-800 text-white focus:border-purple-400 min-h-[80px]"
            />
            <select
              value={row.language}
              onChange={e => handleChange(idx, 'language', e.target.value)}
              className="p-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-cyan-400 w-40"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c++">C++</option>
              <option value="c#">C#</option>
              <option value="go">Go</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addRow} className="px-4 py-2 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-semibold shadow w-fit mx-auto">+ Add Another</button>
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg mt-2 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create All Problems & Notes'}
        </button>
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        {success && <div className="text-green-400 text-center mt-2">Created! Redirecting...</div>}
      </form>
    </div>
  );
};

export default ProblemMultiCreatePage;
