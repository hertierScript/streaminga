// import { Button } from '@/components/ui/button';
// import AuthLayout from '@/layouts/auth-layout';
// import { dashboard } from '@/routes';
// import { logoutStore } from '@/routes';
// import { Head, Link } from '@inertiajs/react';
// import { ChevronLeft, LogOut } from 'lucide-react';

// export default function Logout() {
//     return (
//         <AuthLayout
//             title="Log out"
//             description="Are you sure you want to log out?"
//         >
//             <Head title="Log out" />

//             <div className="w-full">
//                 <Link href={dashboard()}>
//                     <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white">
//                         <ChevronLeft className="mr-2 h-4 w-4" />
//                         Back to Dashboard
//                     </Button>
//                 </Link>
//             </div>

//             <div className="flex flex-col gap-6">
//                 <div className="text-center">
//                     <LogOut className="mx-auto h-12 w-12 text-muted-foreground" />
//                     <h2 className="mt-4 text-lg font-semibold">Confirm Logout</h2>
//                     <p className="text-muted-foreground">
//                         You will be logged out of your account. You can log back in at any time.
//                     </p>
//                 </div>

//                 <div className="flex gap-4">
//                     <Link href={dashboard()} className="flex-1">
//                         <Button variant="outline" className="w-full">
//                             Cancel
//                         </Button>
//                     </Link>
//                     <Link
//                         href={logoutStore().url}
//                         method={logoutStore().method}
//                         as="button"
//                         className="flex-1"
//                     >
//                         <Button variant="destructive" className="w-full">
//                             Log out
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         </AuthLayout>
//     );
// }