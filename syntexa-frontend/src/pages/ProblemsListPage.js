import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import AuthService from '../services/auth.service';

const ProblemsListPage = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProblemTitle, setNewProblemTitle] = useState('');
    const [newProblemDescription, setNewProblemDescription] = useState('');
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = () => {
        ProblemService.getAllProblems().then(
            (response) => {
                setProblems(response.data);
                setLoading(false);
            },
            (error) => {
                const resMessage = (error.response?.data?.message) || error.message || error.toString();
                setError(resMessage);
                setLoading(false);
            }
        );
    };

    const handleCreateProblem = (e) => {
        e.preventDefault();
        ProblemService.createProblem({ title: newProblemTitle, description: newProblemDescription }).then(
            () => {
                fetchProblems(); // Refresh the list
                setShowCreateForm(false);
                setNewProblemTitle('');
                setNewProblemDescription('');
            },
            (error) => {
                alert("Failed to create problem: " + (error.response?.data?.message || error.toString()));
            }
        );
    };

    if (loading) return <p className="text-center text-cyan-400 mt-8 text-xl">Loading Problems...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center my-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Coding Notes Hub
                </h1>
                {currentUser && (
                    <button onClick={() => setShowCreateForm(!showCreateForm)} className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-md text-white font-bold transition-all">
                        {showCreateForm ? 'Cancel' : '+ Add New Problem'}
                    </button>
                )}
            </div>

            {showCreateForm && (
                <div className="bg-slate-800/50 p-6 rounded-xl mb-8 border border-cyan-500/20">
                    <form onSubmit={handleCreateProblem} className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Create a New Problem</h2>
                        <div>
                            <label htmlFor="title" className="text-sm font-bold text-gray-400 block mb-2">Title</label>
                            <input type="text" value={newProblemTitle} onChange={(e) => setNewProblemTitle(e.target.value)}
                                className="w-full p-3 text-white bg-gray-700/50 rounded-md border border-gray-600 focus:border-cyan-400 focus:ring focus:ring-cyan-400" required />
                        </div>
                        <div>
                            <label htmlFor="description" className="text-sm font-bold text-gray-400 block mb-2">Description</label>
                            <textarea value={newProblemDescription} onChange={(e) => setNewProblemDescription(e.target.value)}
                                rows="3" className="w-full p-3 text-white bg-gray-700/50 rounded-md border border-gray-600 focus:border-cyan-400 focus:ring focus:ring-cyan-400" required></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="py-2 px-6 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-semibold">
                                Create Problem
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.length > 0 ? (
                    problems.map((problem) => (
                        <div key={problem.id} className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
                                <p className="text-gray-400 mt-2 line-clamp-3">
                                    {problem.description || "No description available."}
                                </p>
                            </div>
                            <Link to={`/problems/${problem.id}`} className="mt-4 block">
                                <button className="w-full text-center py-2 px-4 rounded-md font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-all duration-300">
                                    View Notes ({problem.notes ? problem.notes.length : 0})
                                </button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-400">No problems have been added yet. Log in to add one!</p>
                )}
            </div>
        </div>
    );
};

export default ProblemsListPage;