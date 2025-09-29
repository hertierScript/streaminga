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
    Plus,
    Edit,
    Trash2,
    Play,
    Film,
    Star,
    Calendar,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Globe
} from 'lucide-react';

// Mock movies data for management
const moviesData = [
    {
        id: 1,
        title: 'Inception',
        poster: 'https://via.placeholder.com/300x450?text=Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        language: 'English',
        translator: 'Christopher Nolan',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '2010-07-16',
        rating: 8.8,
        status: 'Published',
        addedDate: '2024-01-15'
    },
    {
        id: 2,
        title: 'The Dark Knight',
        poster: 'https://via.placeholder.com/300x450?text=Dark+Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        language: 'English',
        translator: 'Christopher Nolan',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '2008-07-18',
        rating: 9.0,
        status: 'Published',
        addedDate: '2024-01-14'
    },
    {
        id: 3,
        title: 'Pulp Fiction',
        poster: 'https://via.placeholder.com/300x450?text=Pulp+Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        language: 'English',
        translator: 'Quentin Tarantino',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '1994-10-14',
        rating: 8.9,
        status: 'Published',
        addedDate: '2024-01-13'
    },
    {
        id: 4,
        title: 'The Shawshank Redemption',
        poster: 'https://via.placeholder.com/300x450?text=Shawshank',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        language: 'English',
        translator: 'Frank Darabont',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '1994-09-23',
        rating: 9.3,
        status: 'Published',
        addedDate: '2024-01-12'
    },
    {
        id: 5,
        title: 'Forrest Gump',
        poster: 'https://via.placeholder.com/300x450?text=Forrest+Gump',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
        language: 'English',
        translator: 'Robert Zemeckis',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '1994-07-06',
        rating: 8.8,
        status: 'Published',
        addedDate: '2024-01-11'
    },
    {
        id: 6,
        title: 'The Matrix',
        poster: 'https://via.placeholder.com/300x450?text=Matrix',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        language: 'English',
        translator: 'Lana Wachowski',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '1999-03-31',
        rating: 8.7,
        status: 'Published',
        addedDate: '2024-01-10'
    },
    {
        id: 7,
        title: 'Interstellar',
        poster: 'https://via.placeholder.com/300x450?text=Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        language: 'English',
        translator: 'Christopher Nolan',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '2014-11-07',
        rating: 8.6,
        status: 'Published',
        addedDate: '2024-01-09'
    },
    {
        id: 8,
        title: 'The Godfather',
        poster: 'https://via.placeholder.com/300x450?text=Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        language: 'English',
        translator: 'Francis Ford Coppola',
        interpreter: 'Rocky',
        trailerLink: '#',
        watchLink: '#',
        releaseDate: '1972-03-24',
        rating: 9.2,
        status: 'Published',
        addedDate: '2024-01-08'
    }
];

export default function AdminMovies() {
    const [searchTerm, setSearchTerm] = useState('');
    const [languageFilter, setLanguageFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Filter and sort movies
    const filteredMovies = moviesData
        .filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                movie.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLanguage = languageFilter === 'all' || movie.language === languageFilter;
            const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
            return matchesSearch && matchesLanguage && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any = a[sortBy as keyof typeof a];
            let bValue: any = b[sortBy as keyof typeof b];

            if (sortBy === 'releaseDate' || sortBy === 'addedDate') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            } else if (sortBy === 'rating') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
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
            setSortOrder('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleAddMovie = () => {
        alert('Add New Movie modal would open here');
    };

    const handleEditMovie = (movieId: number) => {
        alert(`Edit movie with ID: ${movieId}`);
    };

    const handleDeleteMovie = (movieId: number) => {
        if (confirm('Are you sure you want to delete this movie?')) {
            alert(`Delete movie with ID: ${movieId}`);
        }
    };

    const recentlyAddedMovies = moviesData
        .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
        .slice(0, 3);

    const languages = Array.from(new Set(moviesData.map(movie => movie.language)));
    const statuses = Array.from(new Set(moviesData.map(movie => movie.status)));

    return (
        <>
            <Head title="Translated Movies Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Translated Movies Management</h1>
                            <p className="text-gray-400 mt-2">Manage your translated movie catalog and content</p>
                        </div>
                        <Button onClick={handleAddMovie} className="bg-red-600 hover:bg-red-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Movie
                        </Button>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-800 border-gray-700 text-white"
                            />
                        </div>

                        <Select value={languageFilter} onValueChange={setLanguageFilter}>
                            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                                <Globe className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="all" className="text-white hover:bg-gray-700">All Languages</SelectItem>
                                {languages.map(lang => (
                                    <SelectItem key={lang} value={lang} className="text-white hover:bg-gray-700">{lang}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="all" className="text-white hover:bg-gray-700">All Status</SelectItem>
                                {statuses.map(status => (
                                    <SelectItem key={status} value={status} className="text-white hover:bg-gray-700">{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Options */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-gray-400 mr-2">Sort by:</span>
                        {[
                            { key: 'title', label: 'Title' },
                            { key: 'releaseDate', label: 'Release Date' },
                            { key: 'rating', label: 'Rating' }
                        ].map(({ key, label }) => (
                            <Button
                                key={key}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSort(key)}
                                className={`border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center space-x-1 ${
                                    sortBy === key ? 'bg-gray-700' : ''
                                }`}
                            >
                                <span>{label}</span>
                                {getSortIcon(key)}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Recently Added Movies */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Recently Added Movies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentlyAddedMovies.map((movie) => (
                            <Card key={movie.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                                <div className="aspect-[2/3] relative">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-green-600">New</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">{movie.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                            {movie.rating}
                                        </span>
                                        <span className="text-gray-400">{movie.releaseDate}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* All Movies Table */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">All Movies ({filteredMovies.length})</h2>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <button
                                                    onClick={() => handleSort('title')}
                                                    className="flex items-center space-x-1 hover:text-white"
                                                >
                                                    <span>Title</span>
                                                    {getSortIcon('title')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Language
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Interpreter
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <button
                                                    onClick={() => handleSort('releaseDate')}
                                                    className="flex items-center space-x-1 hover:text-white"
                                                >
                                                    <span>Release Date</span>
                                                    {getSortIcon('releaseDate')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <button
                                                    onClick={() => handleSort('rating')}
                                                    className="flex items-center space-x-1 hover:text-white"
                                                >
                                                    <span>Rating</span>
                                                    {getSortIcon('rating')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredMovies.map((movie) => (
                                            <tr key={movie.id} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={movie.poster}
                                                            alt={movie.title}
                                                            className="h-12 w-8 object-cover rounded mr-3"
                                                            loading="lazy"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium">{movie.title}</div>
                                                            <div className="text-sm text-gray-400">{movie.translator}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-300 max-w-xs truncate">
                                                        {movie.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {movie.language}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {movie.interpreter}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {movie.releaseDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm">
                                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                        <span className="font-medium">{movie.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={
                                                        movie.status === 'Published' ? 'bg-green-600 hover:bg-green-700' :
                                                        movie.status === 'Draft' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
                                                    }>
                                                        {movie.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditMovie(movie.id)}
                                                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteMovie(movie.id)}
                                                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                                                        >
                                                            <Play className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            <Film className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredMovies.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">No movies found matching your criteria.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}