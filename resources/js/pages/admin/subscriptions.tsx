import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Download,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Filter,
    Users,
    Calendar,
    DollarSign,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Mock subscription data
const subscriptionsData = [
    { id: 1, userName: 'John Doe', plan: 'Monthly', startDate: '2024-01-15', endDate: '2024-02-15', status: 'Active' },
    { id: 2, userName: 'Jane Smith', plan: 'Yearly', startDate: '2023-12-01', endDate: '2024-12-01', status: 'Active' },
    { id: 3, userName: 'Bob Johnson', plan: 'Weekly', startDate: '2024-01-20', endDate: '2024-01-27', status: 'Expired' },
    { id: 4, userName: 'Alice Brown', plan: 'Monthly', startDate: '2024-01-10', endDate: '2024-02-10', status: 'Active' },
    { id: 5, userName: 'Charlie Wilson', plan: 'Yearly', startDate: '2023-11-15', endDate: '2024-11-15', status: 'Canceled' },
    { id: 6, userName: 'Diana Davis', plan: 'Weekly', startDate: '2024-01-18', endDate: '2024-01-25', status: 'Suspended' },
    { id: 7, userName: 'Edward Miller', plan: 'Monthly', startDate: '2024-01-05', endDate: '2024-02-05', status: 'Active' },
    { id: 8, userName: 'Fiona Garcia', plan: 'Yearly', startDate: '2023-10-20', endDate: '2024-10-20', status: 'Expired' },
    { id: 9, userName: 'George Taylor', plan: 'Weekly', startDate: '2024-01-22', endDate: '2024-01-29', status: 'Active' },
    { id: 10, userName: 'Helen Martinez', plan: 'Monthly', startDate: '2024-01-12', endDate: '2024-02-12', status: 'Active' },
    // Add more mock data...
    ...Array.from({ length: 20 }, (_, i) => ({
        id: i + 11,
        userName: `User ${i + 11}`,
        plan: ['Weekly', 'Monthly', 'Yearly'][i % 3],
        startDate: `2024-01-${(i % 28) + 1}`.padStart(10, '0'),
        endDate: `2024-02-${(i % 28) + 1}`.padStart(10, '0'),
        status: ['Active', 'Expired', 'Canceled', 'Suspended'][i % 4]
    }))
];

const ITEMS_PER_PAGE = 10;

export default function AdminSubscriptions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('startDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and sort subscriptions
    const filteredSubscriptions = subscriptionsData
        .filter(sub => {
            const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || sub.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any = a[sortBy as keyof typeof a];
            let bValue: any = b[sortBy as keyof typeof b];

            if (sortBy === 'startDate' || sortBy === 'endDate') {
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

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleExport = () => {
        // Simulate export functionality
        console.log('Exporting filtered subscriptions:', filteredSubscriptions);
        alert(`Exporting ${filteredSubscriptions.length} subscriptions to CSV...`);
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            'Active': 'bg-green-600 hover:bg-green-700',
            'Expired': 'bg-red-600 hover:bg-red-700',
            'Canceled': 'bg-gray-600 hover:bg-gray-700',
            'Suspended': 'bg-yellow-600 hover:bg-yellow-700'
        };
        return variants[status as keyof typeof variants] || 'bg-gray-600 hover:bg-gray-700';
    };

    return (
        <>
            <Head title="Subscription Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Subscription Management</h1>
                    <p className="text-gray-400 mt-2">Manage and monitor all user subscriptions</p>
                </div>

                {/* Filters and Search */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search by user name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 bg-gray-800 border-gray-700 text-white"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="all" className="text-white hover:bg-gray-700">All Statuses</SelectItem>
                            <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                            <SelectItem value="expired" className="text-white hover:bg-gray-700">Expired</SelectItem>
                            <SelectItem value="canceled" className="text-white hover:bg-gray-700">Canceled</SelectItem>
                            <SelectItem value="suspended" className="text-white hover:bg-gray-700">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>


                {/* Summary Cards */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-400" />
                                <div>
                                    <div className="text-2xl font-bold">{filteredSubscriptions.length}</div>
                                    <div className="text-sm text-gray-400">Filtered Results</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-green-400" />
                                <div>
                                    <div className="text-2xl font-bold">
                                        {filteredSubscriptions.filter(s => s.status === 'Active').length}
                                    </div>
                                    <div className="text-sm text-gray-400">Active Subscriptions</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-yellow-400" />
                                <div>
                                    <div className="text-2xl font-bold">
                                        ${filteredSubscriptions.filter(s => s.status === 'Active').length * 15}
                                    </div>
                                    <div className="text-sm text-gray-400">Est. Monthly Revenue</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="text-sm text-gray-400">Total Subscriptions</div>
                            <div className="text-2xl font-bold">{subscriptionsData.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscriptions Table */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('userName')}
                                                className="flex items-center space-x-1 hover:text-white"
                                            >
                                                <span>User Name</span>
                                                {getSortIcon('userName')}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('plan')}
                                                className="flex items-center space-x-1 hover:text-white"
                                            >
                                                <span>Plan</span>
                                                {getSortIcon('plan')}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('startDate')}
                                                className="flex items-center space-x-1 hover:text-white"
                                            >
                                                <span>Start Date</span>
                                                {getSortIcon('startDate')}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            <button
                                                onClick={() => handleSort('endDate')}
                                                className="flex items-center space-x-1 hover:text-white"
                                            >
                                                <span>End Date</span>
                                                {getSortIcon('endDate')}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {paginatedSubscriptions.map((subscription) => (
                                        <tr key={subscription.id} className="hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {subscription.userName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Badge variant="secondary" className={`${
                                                    subscription.plan === 'Yearly' ? 'bg-blue-100 text-blue-800' :
                                                    subscription.plan === 'Monthly' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {subscription.plan}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {subscription.startDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {subscription.endDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Badge className={getStatusBadge(subscription.status)}>
                                                    {subscription.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredSubscriptions.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No subscriptions found matching your criteria.</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 bg-gray-700">
                                <div className="text-sm text-gray-400">
                                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredSubscriptions.length)} of {filteredSubscriptions.length} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                            if (pageNumber > totalPages) return null;
                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={currentPage === pageNumber
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "border-gray-600 text-gray-300 hover:bg-gray-600"
                                                    }
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}