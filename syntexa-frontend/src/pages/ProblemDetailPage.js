import React, { useState, useEffect, useCallback } from 'react';
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

    // State for the new note form
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Edit/delete state
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editNoteTitle, setEditNoteTitle] = useState('');
    const [editNoteContent, setEditNoteContent] = useState('');
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchProblem = useCallback(() => {
        ProblemService.getProblemById(id).then(
            (response) => {
                setProblem(response.data);
                setLoading(false);
            },
            (error) => {
                setError(error.toString());
                setLoading(false);
            }
        );
    }, [id]);

    useEffect(() => {
        fetchProblem();
    }, [fetchProblem]);

    const handleAddNote = (e) => {
        e.preventDefault();
        if (!noteTitle || !noteContent) {
            alert("Title and content cannot be empty.");
            return;
        }
        setSubmitting(true);
        const noteData = {
            approachTitle: noteTitle,
            content: noteContent
        };
        ProblemService.addNoteToProblem(id, noteData).then(
            () => {
                fetchProblem(); // Refresh the data to show the new note
                setNoteTitle('');
                setNoteContent('');
                setSubmitting(false);
            },
            (error) => {
                alert("Failed to add note: " + (error.response?.data?.message || error.toString()));
                setSubmitting(false);
            }
        );
    };

    // Edit note handler
    const handleEditNote = (note) => {
        setEditingNoteId(note.id);
        setEditNoteTitle(note.approachTitle);
        setEditNoteContent(note.content);
    };
    const handleEditNoteSubmit = (e) => {
        e.preventDefault();
        setEditSubmitting(true);
        ProblemService.updateNote(id, editingNoteId, {
            approachTitle: editNoteTitle,
            content: editNoteContent
        }).then(() => {
            setEditingNoteId(null);
            setEditSubmitting(false);
            fetchProblem();
        }, (error) => {
            alert('Failed to update note: ' + (error.response?.data?.message || error.toString()));
            setEditSubmitting(false);
        });
    };
    const handleDeleteNote = (noteId) => {
        ProblemService.deleteNote(id, noteId).then(() => {
            setDeleteConfirmId(null);
            fetchProblem();
        }, (error) => {
            alert('Failed to delete note: ' + (error.response?.data?.message || error.toString()));
        });
    };

    // Only show notes/approaches for the current user
    const userNotes = problem && problem.notes ? problem.notes.filter(note => note.author && currentUser && note.author.username === currentUser.username) : [];

    if (loading) return <p className="text-center text-cyan-400">Loading Problem Details...</p>;
    if (error) return <p className="text-center text-red-500">Error: Could not load the problem.</p>;
    if (!problem) return <p className="text-center text-gray-400">No problem found.</p>;

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 min-h-[85vh] rounded-2xl shadow-2xl border border-gray-800/60 backdrop-blur-md" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.25)'}}>
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-8 rounded-xl shadow-xl border border-purple-500/20">
                <h1 className="text-4xl font-bold text-white drop-shadow-[0_4px_24px_rgba(80,0,120,0.5)]">{problem.title}</h1>
                <p className="text-lg text-gray-300 mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">{problem.description}</p>
            </div>

            <div className="my-8 border-t border-gray-700"></div>
            
            <h2 className="text-3xl font-bold text-purple-400 mb-6">My Approaches</h2>
            <div className="space-y-6">
                {userNotes.length > 0 ? userNotes.slice(0, 50).map(note => (
                    <div key={note.id} className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-gray-700/50 shadow-lg backdrop-blur-md relative group">
                        {editingNoteId === note.id ? (
                            <form onSubmit={handleEditNoteSubmit} className="space-y-3">
                                <input type="text" value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-400" />
                                <textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} rows="6" className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-400 font-mono" />
                                <div className="flex gap-2 justify-end">
                                    <button type="button" onClick={() => setEditingNoteId(null)} className="px-3 py-1 rounded bg-gray-700 text-gray-300 border border-gray-600">Cancel</button>
                                    <button type="submit" className="px-3 py-1 rounded bg-cyan-700 text-white border border-cyan-700" disabled={editSubmitting}>{editSubmitting ? 'Saving...' : 'Save'}</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-purple-400">{note.approachTitle}</h3>
                                <p className="text-sm text-gray-500 mb-4">by {note.author ? note.author.username : 'Unknown'}</p>
                                <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{background:'transparent', padding:0, margin:0}} wrapLongLines>
                                    {note.content}
                                </SyntaxHighlighter>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => copyToClipboard(window.location.href + `#note-${note.id}`)} className="px-3 py-1 rounded bg-gray-800 text-cyan-300 border border-cyan-700 hover:bg-cyan-900/40 transition">Copy Link</button>
                                    <button onClick={() => copyToClipboard(note.content)} className="px-3 py-1 rounded bg-gray-800 text-cyan-300 border border-cyan-700 hover:bg-cyan-900/40 transition">Copy Code</button>
                                    {currentUser && note.author && currentUser.username === note.author.username && (
                                        <>
                                            <button onClick={() => handleEditNote(note)} className="px-3 py-1 rounded bg-gray-800 text-purple-300 border border-purple-700 hover:bg-purple-900/40 transition">Edit</button>
                                            <button onClick={() => setDeleteConfirmId(note.id)} className="px-3 py-1 rounded bg-gray-800 text-red-300 border border-red-700 hover:bg-red-900/40 transition">Delete</button>
                                        </>
                                    )}
                                </div>
                                {deleteConfirmId === note.id && (
                                    <div className="mt-2 p-3 bg-gray-900 border border-red-700 rounded shadow-xl">
                                        <p className="text-red-400 mb-2">Are you sure you want to delete this approach?</p>
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 rounded bg-gray-700 text-gray-300 border border-gray-600">Cancel</button>
                                            <button onClick={() => handleDeleteNote(note.id)} className="px-3 py-1 rounded bg-red-700 text-white border border-red-700">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )) : (
                    <p className="text-center text-gray-500">You haven't added any approaches for this problem yet.</p>
                )}
            </div>

            {/* Community Hub Section */}
            <h2 className="text-3xl font-bold text-cyan-400 mt-12 mb-6">Community Hub</h2>
            {currentUser && (
                <div className="mb-8 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-cyan-500/20 shadow-xl backdrop-blur-md">
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">Post a Community Coding Snippet</h3>
                    <form onSubmit={handleAddNote} className="space-y-4">
                        <div>
                            <label htmlFor="approachTitle" className="text-sm font-bold text-gray-400 block mb-2">Snippet Title</label>
                            <input
                                type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="e.g., Fastest Solution"
                                className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-cyan-700 focus:border-cyan-400 shadow-inner" required
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="text-sm font-bold text-gray-400 block mb-2">Code Snippet</label>
                            <textarea
                                value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Paste your code here..." rows="8"
                                className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-cyan-700 focus:border-cyan-400 font-mono shadow-inner" required
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="py-2 px-6 bg-gradient-to-r from-cyan-700 via-gray-900 to-gray-800 hover:from-cyan-800 hover:to-gray-900 rounded-xl text-white font-bold shadow-lg border border-cyan-700/40" disabled={submitting}>
                                {submitting ? 'Posting...' : 'Post to Community'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="space-y-6">
                {problem && problem.notes && problem.notes.filter(note => !currentUser || !note.author || note.author.username !== currentUser.username).length > 0 ? (
                    problem.notes.filter(note => !currentUser || !note.author || note.author.username !== currentUser.username).slice(0, 50).map(note => (
                        <div key={note.id} className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-cyan-700/50 shadow-lg backdrop-blur-md relative group">
                            <h3 className="text-xl font-semibold text-cyan-400">{note.approachTitle}</h3>
                            <p className="text-sm text-gray-500 mb-4">by {note.author ? note.author.username : 'Unknown'} (ID: {note.author ? note.author.id : 'N/A'})</p>
                            <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{background:'transparent', padding:0, margin:0}} wrapLongLines>
                                {note.content}
                            </SyntaxHighlighter>
                            {currentUser && note.author && currentUser.username === note.author.username && (
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => handleEditNote(note)} className="px-3 py-1 rounded bg-gray-800 text-purple-300 border border-purple-700 hover:bg-purple-900/40 transition">Edit</button>
                                    <button onClick={() => setDeleteConfirmId(note.id)} className="px-3 py-1 rounded bg-gray-800 text-red-300 border border-red-700 hover:bg-red-900/40 transition">Delete</button>
                                </div>
                            )}
                            {deleteConfirmId === note.id && (
                                <div className="mt-2 p-3 bg-gray-900 border border-red-700 rounded shadow-xl">
                                    <p className="text-red-400 mb-2">Are you sure you want to delete this community snippet?</p>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 rounded bg-gray-700 text-gray-300 border border-gray-600">Cancel</button>
                                        <button onClick={() => handleDeleteNote(note.id)} className="px-3 py-1 rounded bg-red-700 text-white border border-red-700">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No community approaches yet. Be the first to contribute!</p>
                )}
            </div>

            {/* Always show the add note form for logged-in users */}
            {currentUser && (
                <div className="mt-12 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 p-8 rounded-xl border border-purple-500/20 shadow-xl backdrop-blur-md">
                    <h3 className="text-2xl font-bold text-white mb-4">Add Your Note / Approach</h3>
                    <form onSubmit={handleAddNote} className="space-y-4">
                        <div>
                            <label htmlFor="approachTitle" className="text-sm font-bold text-gray-400 block mb-2">Approach Title</label>
                            <input
                                type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="e.g., Two Pointer Solution"
                                className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-cyan-400 shadow-inner" required
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="text-sm font-bold text-gray-400 block mb-2">Your Notes / Code</label>
                            <textarea
                                value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Explain your approach or paste code here..." rows="10"
                                className="w-full p-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 focus:border-cyan-400 font-mono shadow-inner" required
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="py-2 px-6 bg-gradient-to-r from-cyan-700 via-gray-900 to-gray-800 hover:from-cyan-800 hover:to-gray-900 rounded-xl text-white font-bold shadow-lg border border-cyan-700/40" disabled={submitting}>
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