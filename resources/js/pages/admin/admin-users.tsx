import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Search, ChevronLeft, ChevronRight, Edit, Save, X, Upload, Calendar, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Mock data for admin users
const adminUsers = [
    {
        id: 1,
        name: 'Admin User 1',
        email: 'admin1@example.com',
        role: 'admin',
        joinedDate: '2023-01-15',
        lastLogin: '2024-01-25',
        avatar: '/Images/avatar1.jpg',
        password: '••••••••',
        isEditing: false
    },
    {
        id: 2,
        name: 'Super Admin',
        email: 'superadmin@example.com',
        role: 'super_admin',
        joinedDate: '2022-12-01',
        lastLogin: '2024-01-24',
        avatar: '/Images/avatar2.jpg',
        password: '••••••••',
        isEditing: false
    },
    {
        id: 3,
        name: 'Content Manager',
        email: 'content@example.com',
        role: 'admin',
        joinedDate: '2023-06-10',
        lastLogin: '2024-01-23',
        avatar: '/Images/avatar3.jpg',
        password: '••••••••',
        isEditing: false
    },
    // Add more mock admin users...
    ...Array.from({ length: 7 }, (_, i) => ({
        id: i + 4,
        name: `Admin User ${i + 4}`,
        email: `admin${i + 4}@example.com`,
        role: 'admin',
        joinedDate: `2023-${(i % 12) + 1}`.padStart(7, '0'),
        lastLogin: `2024-01-${(25 - i) % 28 + 1}`.padStart(10, '0'),
        avatar: `/Images/avatar${(i % 5) + 1}.jpg`,
        password: '••••••••',
        isEditing: false
    }))
];

export default function AdminUsers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [users, setUsers] = useState(adminUsers);

    const filteredUsers = users
        .filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue: any = a[sortBy as keyof typeof a];
            let bValue: any = b[sortBy as keyof typeof b];

            if (sortBy === 'joinedDate' || sortBy === 'lastLogin') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleEdit = (userId: number) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isEditing: true } : user
        ));
    };

    const handleSave = (userId: number) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isEditing: false } : user
        ));
        // Here you would typically save to the database
    };

    const handleCancel = (userId: number) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isEditing: false } : user
        ));
    };

    const handleFieldChange = (userId: number, field: string, value: string) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, [field]: value } : user
        ));
    };

    return (
        <>
            <Head title="Active Users Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Active Users</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage administrator accounts and permissions</p>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avatar</th>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('role')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Role</span>
                                            {getSortIcon('role')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('joinedDate')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Joined Date</span>
                                            {getSortIcon('joinedDate')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('lastLogin')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Last Login</span>
                                            {getSortIcon('lastLogin')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Password</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isEditing ? (
                                                <div className="flex items-center space-x-2">
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <Button variant="outline" size="sm" className="border-gray-600">
                                                        <Upload className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isEditing ? (
                                                <Input
                                                    value={user.name}
                                                    onChange={(e) => handleFieldChange(user.id, 'name', e.target.value)}
                                                    className="bg-gray-700 border-gray-600 text-white"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium">{user.name}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isEditing ? (
                                                <Input
                                                    value={user.email}
                                                    onChange={(e) => handleFieldChange(user.id, 'email', e.target.value)}
                                                    className="bg-gray-700 border-gray-600 text-white"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-300">{user.email}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isEditing ? (
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(value) => handleFieldChange(user.id, 'role', value)}
                                                >
                                                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-700 border-gray-600">
                                                        <SelectItem value="admin" className="text-white hover:bg-gray-600">Admin</SelectItem>
                                                        <SelectItem value="super_admin" className="text-white hover:bg-gray-600">Super Admin</SelectItem>
                                                        <SelectItem value="moderator" className="text-white hover:bg-gray-600">Moderator</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isEditing ? (
                                                <Input
                                                    type="date"
                                                    value={user.joinedDate}
                                                    onChange={(e) => handleFieldChange(user.id, 'joinedDate', e.target.value)}
                                                    className="bg-gray-700 border-gray-600 text-white"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-300">{user.joinedDate}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {user.lastLogin}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isEditing ? (
                                                <Input
                                                    type="password"
                                                    placeholder="New password"
                                                    className="bg-gray-700 border-gray-600 text-white"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-400">{user.password}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            {user.isEditing ? (
                                                <div className="flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSave(user.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCancel(user.id)}
                                                        className="border-gray-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(user.id)}
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-700 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
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