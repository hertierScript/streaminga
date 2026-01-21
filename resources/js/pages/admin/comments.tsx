import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Comment } from '@/types';
import {
    Search,
    MessageSquare,
    Reply,
    Trash2,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Filter,
    Calendar,
    User,
    Check,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import axios from 'axios';

export default function AdminComments() {
    const { user, loading: authLoading } = useAuth();
    const { url } = usePage();

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
    const [movieTypeTab, setMovieTypeTab] = useState<'all' | 'izisobanuye' | 'izidasobanuye'>('all');


    useEffect(() => {
        fetchComments();
    }, [currentPage, searchTerm, activeTab, movieTypeTab, dateFilter, sortBy, sortOrder]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                per_page: itemsPerPage.toString(),
                search: searchTerm,
                status_filter: activeTab,
                movie_type_filter: movieTypeTab,
                date_filter: dateFilter,
                sort_by: sortBy,
                sort_order: sortOrder,
            });
            const response = await axios.get(`/admin/api/comments?${params}`);
            setComments(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter comments for tabs
    const filteredComments = comments;

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
        setCurrentPage(1); // Reset to first page when sorting
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleReply = async (commentId: number) => {
        if (replyingTo === commentId) {
            // Submit reply
            if (replyText.trim()) {
                try {
                    await axios.post(`/admin/api/comments/${commentId}/reply`, {
                        message: replyText,
                    });
                    setReplyText('');
                    fetchComments();
                } catch (error) {
                    console.error('Error posting reply:', error);
                }
            }
            setReplyingTo(null);
        } else {
            setReplyingTo(commentId);
            setReplyText('');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            try {
                await axios.delete(`/admin/api/comments/${commentId}`);
                fetchComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleApproveComment = async (commentId: number) => {
        try {
            await axios.patch(`/admin/api/comments/${commentId}/status`, {
                status: 'approved',
            });
            fetchComments();
        } catch (error) {
            console.error('Error approving comment:', error);
        }
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Reset to page 1 when filters change
    const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
        setter(value);
        setCurrentPage(1);
    };


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            'approved': 'bg-green-600 hover:bg-green-700',
            'pending': 'bg-yellow-600 hover:bg-yellow-700'
        };
        return variants[status as keyof typeof variants] || 'bg-gray-600 hover:bg-gray-700';
    };


    return (
        <>
            <Head title="Comments Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Comments Management</h1>
                            <p className="text-gray-400 mt-2 text-sm sm:text-base">Monitor and manage user comments and interactions</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            All Comments
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'pending'
                                    ? 'bg-yellow-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setActiveTab('approved')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'approved'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Approved
                        </button>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search comments, users, or movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <Select value={dateFilter} onValueChange={handleFilterChange(setDateFilter)}>
                                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Date Range" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    <SelectItem value="all" className="text-white hover:bg-gray-700">All Time</SelectItem>
                                    <SelectItem value="week" className="text-white hover:bg-gray-700">This Week</SelectItem>
                                    <SelectItem value="month" className="text-white hover:bg-gray-700">This Month</SelectItem>
                                    <SelectItem value="year" className="text-white hover:bg-gray-700">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Movie Type Tabs */}
                    <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setMovieTypeTab('all')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                movieTypeTab === 'all'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            All Comments
                        </button>
                        <button
                            onClick={() => setMovieTypeTab('izisobanuye')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                movieTypeTab === 'izisobanuye'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Izisobanuye
                        </button>
                        <button
                            onClick={() => setMovieTypeTab('izidasobanuye')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                movieTypeTab === 'izidasobanuye'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Izidasobanuye
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-2">
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">Loading comments...</p>
                        </div>
                    ) : (
                        filteredComments.map((comment) => (
                        <Card key={comment.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-2 sm:p-3">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-medium text-white">{comment.name}</span>
                                                <span className="text-gray-400 hidden sm:inline">•</span>
                                                <span className="text-sm font-medium text-blue-400">{comment.movie?.title || `Movie ID: ${comment.movie_id}`}</span>
                                                <span className="text-gray-400 hidden sm:inline">•</span>
                                                <span className="text-sm text-gray-400">{formatDate(comment.created_at)}</span>
                                            </div>
                                            <p className="text-gray-300 mb-1 break-words">{comment.message}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleReply(comment.id)}
                                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white flex-1 sm:flex-none"
                                        >
                                            <Reply className="h-4 w-4 mr-1" />
                                            <span className="hidden sm:inline">Reply</span>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white flex-1 sm:flex-none"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="ml-14 space-y-1 mb-2">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="bg-gray-700 rounded-lg p-3">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-medium text-blue-400">{reply.name}</span>
                                                    <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
                                                </div>
                                                <p className="text-sm text-gray-300">{reply.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reply Form */}
                                {replyingTo === comment.id && (
                                    <div className="ml-14 mt-2">
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <textarea
                                                placeholder="Type your reply..."
                                                value={replyText}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                                                className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                                                rows={3}
                                            />
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleReply(comment.id)}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Send Reply
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setReplyingTo(null)}
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        ))
                    )}

                    {!loading && filteredComments.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No comments found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                        <div className="text-sm text-gray-400 text-center sm:text-left">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} comments
                        </div>
                        <div className="flex items-center justify-center sm:justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Previous</span>
                            </Button>

                            {/* Page Numbers */}
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                    if (pageNum > totalPages) return null;
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className={
                                                currentPage === pageNum
                                                    ? "bg-red-600 text-white"
                                                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                                            }
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="h-4 w-4 sm:ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-blue-400" />
                                <div>
                                    <div className="text-2xl font-bold">{totalItems}</div>
                                    <div className="text-sm text-gray-400">
                                        {activeTab === 'all' ? 'Total Comments' :
                                         activeTab === 'pending' ? 'Pending Comments' :
                                         'Approved Comments'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {activeTab === 'all' && (
                        <>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <div className="text-2xl font-bold">
                                                {comments.filter(c => c.status === 'approved').length}
                                            </div>
                                            <div className="text-sm text-gray-400">Approved</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div>
                                            <div className="text-2xl font-bold">
                                                {comments.filter(c => c.status === 'pending').length}
                                            </div>
                                            <div className="text-sm text-gray-400">Pending</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab !== 'all' && (
                        <>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <Reply className="h-5 w-5 text-green-400" />
                                        <div>
                                            <div className="text-2xl font-bold">
                                                {comments.filter(c => c.replies && c.replies.length > 0).length}
                                            </div>
                                            <div className="text-sm text-gray-400">With Replies</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-purple-400" />
                                        <div>
                                            <div className="text-2xl font-bold">
                                                {new Set(comments.map(c => c.name)).size}
                                            </div>
                                            <div className="text-sm text-gray-400">Unique Users</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}