import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProblemService from '../services/problem.service';
import AuthService from '../services/auth.service';
import { copyToClipboard } from '../utils/clipboard';

const ProblemsListPage = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProblemTitle, setNewProblemTitle] = useState('');
    const [newProblemDescription, setNewProblemDescription] = useState('');
    const [profile, setProfile] = useState(null);
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        fetchProblems();
        const interval = setInterval(fetchProblems, 30000); // auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentUser) {
            ProblemService.getCurrentUserProfile().then(setProfile);
        }
    }, [currentUser]);

    const fetchProblems = () => {
        ProblemService.getAllProblems().then(
            (data) => { // Fix: use data directly
                setProblems(data);
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

    // Professional user profile at top
    const userProfileBanner = profile ? (
        <div className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-900 via-gray-900 to-gray-800 border border-cyan-500/40 text-cyan-200 font-semibold shadow-lg text-center flex flex-col md:flex-row md:items-center md:justify-between">
            <span>Logged in as <span className="font-bold">{profile.username}</span> (ID: {profile.id})</span>
            <span className="text-xs text-gray-400 mt-2 md:mt-0">Email: {profile.email}</span>
        </div>
    ) : null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 min-h-[85vh] rounded-2xl shadow-2xl border border-gray-800/60 backdrop-blur-md" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.25)'}}>
            {userProfileBanner}
            <div className="flex justify-between items-center my-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_4px_24px_rgba(80,0,120,0.5)]">
                    Coding Notes Hub
                </h1>
                {currentUser && (
                    <button onClick={() => setShowCreateForm(!showCreateForm)} className="py-2 px-4 bg-gradient-to-r from-purple-700 via-gray-900 to-gray-800 hover:from-purple-800 hover:to-gray-900 rounded-xl text-white font-bold transition-all shadow-lg border border-purple-700/40 ml-4">
                        {showCreateForm ? 'Cancel' : '+ Add New Problem'}
                    </button>
                )}
            </div>
            {showCreateForm && (
                <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-6 rounded-xl mb-8 border border-purple-500/20 shadow-xl backdrop-blur-md">
                    <form onSubmit={handleCreateProblem} className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Create a New Problem</h2>
                        <div>
                            <label htmlFor="title" className="text-sm font-bold text-gray-400 block mb-2">Title</label>
                            <input type="text" value={newProblemTitle} onChange={(e) => setNewProblemTitle(e.target.value)}
                                className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring focus:ring-cyan-400 shadow-inner" required />
                        </div>
                        <div>
                            <label htmlFor="description" className="text-sm font-bold text-gray-400 block mb-2">Description</label>
                            <textarea value={newProblemDescription} onChange={(e) => setNewProblemDescription(e.target.value)}
                                rows="3" className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring focus:ring-cyan-400 shadow-inner" required></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="py-2 px-6 bg-cyan-700 hover:bg-cyan-600 rounded-xl text-white font-semibold shadow-lg border border-cyan-700/40">
                                Create Problem
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem) => (
                    <div key={problem.id} className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-xl border border-purple-500/20 flex flex-col justify-between hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md" style={{boxShadow:'0 4px 16px 0 rgba(80,0,120,0.15)'}}>
                        <div>
                            <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(80,0,120,0.2)]">{problem.title}</h2>
                            <p className="text-gray-400 mt-2 line-clamp-3">
                                {problem.description || "No description available."}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Link to={`/problems/${problem.id}`} className="mt-4 block">
                                <button className="w-full text-center py-2 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-700 via-gray-900 to-gray-800 hover:from-purple-800 hover:to-gray-900 transition-all duration-300 shadow-lg border border-purple-700/40">
                                    View & Add Notes ({problem.notes ? problem.notes.length : 0})
                                </button>
                            </Link>
                            <button onClick={() => copyToClipboard(window.location.origin + `/problems/${problem.id}`)} className="px-3 py-1 rounded bg-gray-800 text-cyan-300 border border-cyan-700 hover:bg-cyan-900/40 transition">Copy Problem Link</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblemsListPage;