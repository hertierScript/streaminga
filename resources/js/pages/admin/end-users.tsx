import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Search, ChevronLeft, ChevronRight, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Mock data for end users
const endUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        subscription: 'Monthly',
        joinedDate: '2024-01-15',
        expiryDate: '2024-02-15',
        password: '••••••••'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        subscription: 'Yearly',
        joinedDate: '2023-12-01',
        expiryDate: '2024-12-01',
        password: '••••••••'
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        subscription: 'Weekly',
        joinedDate: '2024-01-20',
        expiryDate: '2024-01-27',
        password: '••••••••'
    },
    {
        id: 4,
        name: 'Alice Brown',
        email: 'alice@example.com',
        subscription: 'Monthly',
        joinedDate: '2024-01-10',
        expiryDate: '2024-02-10',
        password: '••••••••'
    },
    {
        id: 5,
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        subscription: 'Yearly',
        joinedDate: '2023-11-15',
        expiryDate: '2024-11-15',
        password: '••••••••'
    },
    // Add more mock users...
    ...Array.from({ length: 15 }, (_, i) => ({
        id: i + 6,
        name: `User ${i + 6}`,
        email: `user${i + 6}@example.com`,
        subscription: ['Weekly', 'Monthly', 'Yearly'][i % 3],
        joinedDate: `2024-01-${(i % 28) + 1}`.padStart(10, '0'),
        expiryDate: `2024-02-${(i % 28) + 1}`.padStart(10, '0'),
        password: '••••••••'
    }))
];

export default function AdminEndUsers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const filteredUsers = endUsers
        .filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue: any = a[sortBy as keyof typeof a];
            let bValue: any = b[sortBy as keyof typeof b];

            if (sortBy === 'joinedDate' || sortBy === 'expiryDate') {
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

    return (
        <>
            <Head title="End Users Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">End Users Management</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage regular user accounts and subscriptions</p>
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
                                            onClick={() => handleSort('subscription')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Subscription</span>
                                            {getSortIcon('subscription')}
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
                                            onClick={() => handleSort('expiryDate')}
                                            className="flex items-center space-x-1 hover:text-white"
                                        >
                                            <span>Expiry Date</span>
                                            {getSortIcon('expiryDate')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Password</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.subscription === 'Yearly' ? 'bg-green-100 text-green-800' :
                                                user.subscription === 'Monthly' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {user.subscription}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.joinedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.expiryDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.password}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
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