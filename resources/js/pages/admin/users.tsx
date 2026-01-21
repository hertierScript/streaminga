import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Search, ChevronLeft, ChevronRight, Edit, Save, X, Upload, Eye, ArrowUpDown, ArrowUp, ArrowDown, Users, Crown, Trash2, UserCheck, Check } from 'lucide-react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    created_at: string;
    email_verified_at?: string;
    updated_at: string;
    subscription_status: 'none' | 'active' | 'expired';
    subscription_start_date?: string;
    subscription_expiry_date?: string;
}

export default function AdminUsers() {
    const [activeTab, setActiveTab] = useState<'end-users' | 'admin-users'>('end-users');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: '',
        password: ''
    });
    const [userStats, setUserStats] = useState({
        total_users: 0,
        admin_users: 0,
        regular_users: 0,
        verified_users: 0,
        active_subscriptions: 0,
        expired_subscriptions: 0
    });

    useEffect(() => {
        fetchUsers();
        fetchUserStats();
    }, [currentPage, searchTerm, activeTab, sortBy, sortOrder]);

    const fetchUserStats = async () => {
        try {
            const response = await axios.get('/admin/api/user-stats', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            setUserStats(response.data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                per_page: '10',
                search: searchTerm,
                role_filter: activeTab === 'admin-users' ? 'admin' : 'all',
                user_type: activeTab,
                sort_by: sortBy,
                sort_order: sortOrder,
            });

            const response = await axios.get(`/admin/api/users?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            setUsers(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role || '',
            password: ''
        });
    };

    const handleSave = async () => {
        if (!editingUser) return;

        try {
            const data: any = {
                name: editForm.name,
                email: editForm.email,
                role: editForm.role,
            };

            if (editForm.password) {
                data.password = editForm.password;
            }

            await axios.put(`/admin/api/users/${editingUser.id}`, data, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancel = () => {
        setEditingUser(null);
        setEditForm({ name: '', email: '', role: '', password: '' });
    };

    const handleDelete = async (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/admin/api/users/${userId}`, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };


    return (
        <>
            <Head title="User Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
                    <p className="text-gray-400 mt-2">Manage different types of user accounts</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('end-users')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'end-users'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                    >
                        End Users
                    </button>
                    <button
                        onClick={() => setActiveTab('admin-users')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'admin-users'
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                    >
                        Admin Users
                    </button>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-400" />
                                <div>
                                    <div className="text-2xl font-bold">{userStats.total_users}</div>
                                    <div className="text-sm text-gray-400">Total Users</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Crown className="h-5 w-5 text-red-400" />
                                <div>
                                    <div className="text-2xl font-bold">{userStats.admin_users}</div>
                                    <div className="text-sm text-gray-400">Admin Users</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <UserCheck className="h-5 w-5 text-green-400" />
                                <div>
                                    <div className="text-2xl font-bold">{userStats.regular_users}</div>
                                    <div className="text-sm text-gray-400">Regular Users</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Check className="h-5 w-5 text-purple-400" />
                                <div>
                                    <div className="text-2xl font-bold">{userStats.verified_users}</div>
                                    <div className="text-sm text-gray-400">Verified Users</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <UserCheck className="h-5 w-5 text-green-400" />
                                <div>
                                    <div className="text-2xl font-bold">{userStats.active_subscriptions}</div>
                                    <div className="text-sm text-gray-400">Active Subscriptions</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <X className="h-5 w-5 text-red-400" />
                                <div>
                                    <div className="text-2xl font-bold">{userStats.expired_subscriptions}</div>
                                    <div className="text-sm text-gray-400">Expired Subscriptions</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 bg-gray-800 border-gray-700 text-white"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    {activeTab === 'admin-users' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avatar</th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Name</span>
                                            {getSortIcon('name')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('email')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Email</span>
                                            {getSortIcon('email')}
                                        </button>
                                    </th>
                                    {activeTab === 'end-users' && (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subscription Start</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subscription Expiry</th>
                                        </>
                                    )}
                                    {activeTab === 'admin-users' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('role')}
                                                className="flex items-center space-x-1 hover:text-white"
                                            >
                                                <span>Role</span>
                                                {getSortIcon('role')}
                                            </button>
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('created_at')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Joined Date</span>
                                            {getSortIcon('created_at')}
                                        </button>
                                    </th>
                                    {activeTab === 'admin-users' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('updated_at')}
                                                className="flex items-center space-x-1 hover:text-white"
                                            >
                                                <span>Last Updated</span>
                                                {getSortIcon('updated_at')}
                                            </button>
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Password</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={activeTab === 'admin-users' ? 6 : 7} className="px-6 py-8 text-center text-gray-400">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === 'admin-users' ? 6 : 7} className="px-6 py-8 text-center text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-700">
                                            {activeTab === 'admin-users' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                                        <Crown className="h-5 w-5 text-white" />
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser?.id === user.id ? (
                                                    <Input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                        className="bg-gray-700 border-gray-600 text-white"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-medium">{user.name}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser?.id === user.id ? (
                                                    <Input
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                        className="bg-gray-700 border-gray-600 text-white"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-300">{user.email}</span>
                                                )}
                                            </td>
                                            {activeTab === 'end-users' && (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            user.subscription_status === 'active' ? 'bg-green-100 text-green-800' :
                                                            user.subscription_status === 'expired' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {user.subscription_status === 'active' ? 'Active Subscription' :
                                                             user.subscription_status === 'expired' ? 'Expired Subscription' :
                                                             'No Subscription'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {user.subscription_start_date ? formatDate(user.subscription_start_date) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {user.subscription_expiry_date ? formatDate(user.subscription_expiry_date) : 'N/A'}
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === 'admin-users' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingUser?.id === user.id ? (
                                                        <Select
                                                            value={editForm.role}
                                                            onValueChange={(value) => setEditForm({...editForm, role: value})}
                                                        >
                                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-gray-700 border-gray-600">
                                                                <SelectItem value="admin" className="text-white hover:bg-gray-600">Admin</SelectItem>
                                                                <SelectItem value="super_admin" className="text-white hover:bg-gray-600">Super Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                                                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {user.role ? user.role.replace('_', ' ') : 'User'}
                                                        </span>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {formatDate(user.created_at)}
                                            </td>
                                            {activeTab === 'admin-users' && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {formatDate(user.updated_at)}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser?.id === user.id ? (
                                                    <Input
                                                        type="password"
                                                        placeholder="New password (leave empty to keep current)"
                                                        value={editForm.password}
                                                        onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                                                        className="bg-gray-700 border-gray-600 text-white"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-400">••••••••</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                {activeTab === 'admin-users' ? (
                                                    editingUser?.id === user.id ? (
                                                        <div className="flex space-x-1">
                                                            <Button
                                                                size="sm"
                                                                onClick={handleSave}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                <Save className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleCancel}
                                                                className="border-gray-600"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex space-x-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(user)}
                                                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                                            >
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(user.id)}
                                                                className="border-red-600 text-red-400 hover:bg-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-700 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} users
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}