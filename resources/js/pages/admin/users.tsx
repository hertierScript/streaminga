import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Users, UserCheck, Shield } from 'lucide-react';

export default function AdminUsers() {
    return (
        <>
            <Head title="User Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">User Management</h1>
                    <p className="text-gray-400 mb-8">Manage different types of user accounts</p>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Link href="/admin/end-users">
                            <Card className="border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors cursor-pointer">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl">End Users</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-400 mb-4">Manage regular user accounts with subscription details</p>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Manage End Users
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/admin-users">
                            <Card className="border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors cursor-pointer">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl">Admin Users</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-400 mb-4">Manage administrator accounts and permissions</p>
                                    <Button className="w-full bg-red-600 hover:bg-red-700">
                                        Manage Admins
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl">User Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="space-y-2 mb-4">
                                    <div className="text-2xl font-bold">1,234</div>
                                    <div className="text-sm text-gray-400">Total End Users</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="text-sm text-gray-400">Active Admins</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}