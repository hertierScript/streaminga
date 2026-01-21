import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminSidebar } from '@/components/admin-sidebar';
import {
    User,
    Settings as SettingsIcon,
    Film,
    CreditCard,
    Bell,
    Shield,
    Download,
    Users,
    Upload,
    Eye,
    EyeOff,
    Save,
    Trash2,
    Database,
    Palette,
    Globe,
    Clock,
    Star,
    MessageSquare,
    Lock,
    FileText,
    Crown,
    X,
    LoaderCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAnnouncement } from '@/hooks/use-announcement';

export default function AdminSettings() {
    const [activeSection, setActiveSection] = useState('profile');
    const { message, backgroundColor, isEnabled, dismissible, scroll, setAnnouncement, enableAnnouncement, disableAnnouncement, clearAnnouncement } = useAnnouncement();
    const [announcementText, setAnnouncementText] = useState(message);
    const [announcementColor, setAnnouncementColor] = useState(backgroundColor);
    const [announcementDismissible, setAnnouncementDismissible] = useState(dismissible);
    const [announcementScroll, setAnnouncementScroll] = useState(scroll);

    // Hero state
    const [hero, setHero] = useState(null);
    const [heroTitle, setHeroTitle] = useState('');
    const [heroOverview, setHeroOverview] = useState('');
    const [heroGenre, setHeroGenre] = useState('');
    const [heroReleaseYear, setHeroReleaseYear] = useState('');
    const [heroWatchNowUrl, setHeroWatchNowUrl] = useState('');
    const [heroWatchTrailerUrl, setHeroWatchTrailerUrl] = useState('');
    const [heroPosterFile, setHeroPosterFile] = useState<File | null>(null);
    const [heroPosterPreview, setHeroPosterPreview] = useState('');
    const [savingHero, setSavingHero] = useState(false);

    useEffect(() => {
        if (activeSection === 'hero') {
            fetchHero();
        }
    }, [activeSection]);

    const fetchHero = async () => {
        try {
            const response = await fetch('/api/hero');
            if (response.ok) {
                const data = await response.json();
                setHero(data);
                setHeroTitle(data.title || '');
                setHeroOverview(data.overview || '');
                setHeroGenre(data.genre || '');
                setHeroReleaseYear(data.release_year?.toString() || '');
                setHeroWatchNowUrl(data.watch_now_url || '');
                setHeroWatchTrailerUrl(data.watch_trailer_url || '');
                if (data.poster_path) {
                    setHeroPosterPreview('/' + data.poster_path);
                }
            }
        } catch (error) {
            console.error('Error fetching hero:', error);
        }
    };

    const handleHeroPosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroPosterFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setHeroPosterPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveHero = async () => {
        setSavingHero(true);
        try {
            const formData = new FormData();
            formData.append('title', heroTitle);
            formData.append('overview', heroOverview);
            formData.append('genre', heroGenre);
            formData.append('release_year', heroReleaseYear);
            formData.append('watch_now_url', heroWatchNowUrl);
            formData.append('watch_trailer_url', heroWatchTrailerUrl);
            if (heroPosterFile) {
                formData.append('poster_file', heroPosterFile);
            }

            const response = await fetch('/admin/api/hero', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setHero(data);
                alert('Hero updated successfully!');
            } else {
                const errorData = await response.json();
                alert('Error saving hero: ' + (errorData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving hero:', error);
            alert('Error saving hero');
        } finally {
            setSavingHero(false);
        }
    };

    const sections = [
        { id: 'profile', label: 'Profile & Account', icon: User },
        { id: 'system', label: 'System Settings', icon: SettingsIcon },
        { id: 'hero', label: 'Hero Management', icon: Star },
        { id: 'announcements', label: 'Announcements', icon: Bell },
        { id: 'movies', label: 'Movie Management', icon: Film },
        { id: 'subscription', label: 'Subscription Settings', icon: CreditCard },
        { id: 'notifications', label: 'Notification Settings', icon: Bell },
        { id: 'security', label: 'Security Settings', icon: Shield },
        { id: 'export', label: 'Export & Data', icon: Download },
        { id: 'admin', label: 'Admin Management', icon: Crown },
    ];

    return (
        <>
            <Head title="Admin Settings" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">Admin Settings</h1>

                    {/* Navigation Tabs */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-red-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{section.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Profile & Account Settings */}
                    {activeSection === 'profile' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <span>Profile & Account Settings</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="admin-name">Change Name / Username</Label>
                                            <Input
                                                id="admin-name"
                                                placeholder="Enter new name"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="admin-email">Change Email / Contact Info</Label>
                                            <Input
                                                id="admin-email"
                                                type="email"
                                                placeholder="Enter new email"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                placeholder="Enter current password"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                placeholder="Enter new password"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Profile Picture/Avatar Upload</Label>
                                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-400">Drag & drop or click to upload avatar</p>
                                            <Button variant="outline" size="sm" className="mt-4 border-gray-600">
                                                Choose File
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="enable-2fa" />
                                        <Label htmlFor="enable-2fa" className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4" />
                                            <span>Enable Two-Factor Authentication (2FA)</span>
                                        </Label>
                                    </div>

                                    <Button className="bg-red-600 hover:bg-red-700">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Profile Changes
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* System Settings */}
                    {activeSection === 'system' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <SettingsIcon className="h-5 w-5" />
                                        <span>System Settings</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="website-name">Website Name</Label>
                                            <Input
                                                id="website-name"
                                                defaultValue="Streaminga"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Logo Upload</Label>
                                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-400">Upload logo</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label>Theme</Label>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 border-gray-600">
                                                    <SelectValue placeholder="Select theme" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="auto">Auto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Language</Label>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 border-gray-600">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Spanish</SelectItem>
                                                    <SelectItem value="fr">French</SelectItem>
                                                    <SelectItem value="de">German</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Timezone</Label>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 border-gray-600">
                                                    <SelectValue placeholder="Select timezone" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                    <SelectItem value="utc">UTC</SelectItem>
                                                    <SelectItem value="est">Eastern Time</SelectItem>
                                                    <SelectItem value="pst">Pacific Time</SelectItem>
                                                    <SelectItem value="cet">Central European Time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Button className="bg-red-600 hover:bg-red-700">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save System Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Hero Management */}
                    {activeSection === 'hero' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Film className="h-5 w-5" />
                                        <span>Hero Management</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="hero-title">Movie Title *</Label>
                                            <Input
                                                id="hero-title"
                                                value={heroTitle}
                                                onChange={(e) => setHeroTitle(e.target.value)}
                                                placeholder="Enter movie title"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hero-genre">Genre</Label>
                                            <Input
                                                id="hero-genre"
                                                value={heroGenre}
                                                onChange={(e) => setHeroGenre(e.target.value)}
                                                placeholder="e.g., Action, Drama"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="hero-release-year">Release Year</Label>
                                            <Input
                                                id="hero-release-year"
                                                type="number"
                                                value={heroReleaseYear}
                                                onChange={(e) => setHeroReleaseYear(e.target.value)}
                                                placeholder="e.g., 2024"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hero-watch-now-url">Watch Now URL</Label>
                                            <Input
                                                id="hero-watch-now-url"
                                                value={heroWatchNowUrl}
                                                onChange={(e) => setHeroWatchNowUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hero-watch-trailer-url">Watch Trailer URL</Label>
                                        <Input
                                            id="hero-watch-trailer-url"
                                            value={heroWatchTrailerUrl}
                                            onChange={(e) => setHeroWatchTrailerUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hero-overview">Overview</Label>
                                        <textarea
                                            id="hero-overview"
                                            value={heroOverview}
                                            onChange={(e) => setHeroOverview(e.target.value)}
                                            placeholder="Enter movie overview/description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hero-poster">Poster Image</Label>
                                        <div className="flex items-center space-x-4">
                                            <Input
                                                id="hero-poster"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleHeroPosterChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('hero-poster')?.click()}
                                                className="border-gray-600"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Choose Poster
                                            </Button>
                                            {heroPosterPreview && (
                                                <div className="w-20 h-28 bg-gray-100 rounded overflow-hidden">
                                                    <img
                                                        src={heroPosterPreview}
                                                        alt="Poster preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Upload a poster image (JPG, PNG, GIF, WebP). Max 5MB.
                                        </p>
                                    </div>

                                    <Button
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={handleSaveHero}
                                        disabled={savingHero}
                                    >
                                        {savingHero ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Hero
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Announcements Settings */}
                    {activeSection === 'announcements' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Bell className="h-5 w-5" />
                                        <span>Announcement Bar Settings</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="enable-announcement"
                                                checked={isEnabled}
                                                onCheckedChange={(checked) => checked ? enableAnnouncement() : disableAnnouncement()}
                                            />
                                            <Label htmlFor="enable-announcement" className="flex items-center space-x-2">
                                                <Bell className="h-4 w-4" />
                                                <span>Enable Announcement Bar</span>
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="announcement-text">Announcement Text</Label>
                                        <Input
                                            id="announcement-text"
                                            placeholder="Enter your announcement message..."
                                            value={announcementText}
                                            onChange={(e) => setAnnouncementText(e.target.value)}
                                            className="bg-gray-700 border-gray-600"
                                        />
                                        <p className="text-sm text-gray-400">This text will appear in the announcement bar at the top of all pages.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="announcement-color">Background Color</Label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                id="announcement-color"
                                                type="color"
                                                value={announcementColor}
                                                onChange={(e) => setAnnouncementColor(e.target.value)}
                                                className="w-12 h-10 border border-gray-600 rounded cursor-pointer bg-gray-700"
                                            />
                                            <Input
                                                value={announcementColor}
                                                onChange={(e) => setAnnouncementColor(e.target.value)}
                                                placeholder="#3b82f6"
                                                className="bg-gray-700 border-gray-600 font-mono"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-400">Choose any color for the announcement bar background.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Preview</Label>
                                        <div className="border border-gray-600 rounded-lg p-4 bg-gray-900">
                                            <div
                                                className="px-4 py-2 text-center text-sm relative rounded overflow-hidden"
                                                style={{
                                                    backgroundColor: announcementColor,
                                                    color: announcementColor ? (parseInt(announcementColor.replace('#', ''), 16) > 0x7fffff ? 'black' : 'white') : 'white'
                                                }}
                                            >
                                                {announcementScroll ? (
                                                    <div className="whitespace-nowrap">
                                                        <span className="inline-block animate-scroll-right-to-left">
                                                            {announcementText || 'Your announcement text will appear here'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>{announcementText || 'Your announcement text will appear here'}</span>
                                                )}
                                                {announcementDismissible && (
                                                    <button
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/20 rounded-full z-10"
                                                        style={{ color: announcementColor ? (parseInt(announcementColor.replace('#', ''), 16) > 0x7fffff ? 'black' : 'white') : 'white' }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">This is how the announcement bar will appear to users.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Settings</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>Allow users to dismiss</span>
                                                <Checkbox
                                                    id="allow-dismiss"
                                                    checked={announcementDismissible}
                                                    onCheckedChange={(checked) => setAnnouncementDismissible(!!checked)}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Enable scrolling animation</span>
                                                <Checkbox
                                                    id="enable-scroll"
                                                    checked={announcementScroll}
                                                    onCheckedChange={(checked) => setAnnouncementScroll(!!checked)}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Show on all pages</span>
                                                <Checkbox id="show-all-pages" defaultChecked disabled />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">Admins can manually remove announcements when needed.</p>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => {
                                                if (announcementText.trim()) {
                                                    setAnnouncement(announcementText.trim(), announcementColor, announcementDismissible, announcementScroll);
                                                } else {
                                                    clearAnnouncement();
                                                }
                                            }}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Announcement
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-gray-600"
                                            onClick={() => {
                                                setAnnouncementText('');
                                                clearAnnouncement();
                                            }}
                                        >
                                            Clear Announcement
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Movie Management Defaults */}
                    {activeSection === 'movies' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Film className="h-5 w-5" />
                                        <span>Movie Management Defaults</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Default Poster Size</Label>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 border-gray-600">
                                                    <SelectValue placeholder="Select size" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                    <SelectItem value="small">Small</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="large">Large</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Allowed Video Quality</Label>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 border-gray-600">
                                                    <SelectValue placeholder="Select quality" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                    <SelectItem value="480p">480p</SelectItem>
                                                    <SelectItem value="720p">720p</SelectItem>
                                                    <SelectItem value="1080p">1080p</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Default Movie Sorting</Label>
                                        <Select>
                                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                                <SelectValue placeholder="Select sorting" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-700 border-gray-600">
                                                <SelectItem value="newest">Newest First</SelectItem>
                                                <SelectItem value="oldest">Oldest First</SelectItem>
                                                <SelectItem value="most-viewed">Most Viewed</SelectItem>
                                                <SelectItem value="top-rated">Top Rated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="enable-comments" defaultChecked />
                                            <Label htmlFor="enable-comments" className="flex items-center space-x-2">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>Enable Comments on Movies</span>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="enable-ratings" defaultChecked />
                                            <Label htmlFor="enable-ratings" className="flex items-center space-x-2">
                                                <Star className="h-4 w-4" />
                                                <span>Enable Ratings on Movies</span>
                                            </Label>
                                        </div>
                                    </div>

                                    <Button className="bg-red-600 hover:bg-red-700">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Movie Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Subscription Settings */}
                    {activeSection === 'subscription' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <CreditCard className="h-5 w-5" />
                                        <span>Subscription Settings</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label>Weekly Plan Price</Label>
                                            <Input
                                                placeholder="$4.99"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Monthly Plan Price</Label>
                                            <Input
                                                placeholder="$9.99"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Yearly Plan Price</Label>
                                            <Input
                                                placeholder="$99.99"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="auto-renew" />
                                            <Label htmlFor="auto-renew">Enable Auto-Renewal</Label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="free-trial" />
                                            <Label htmlFor="free-trial">Enable Free Trial</Label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Payment Methods</Label>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-3">
                                                <Checkbox id="paypal" defaultChecked />
                                                <Label htmlFor="paypal">PayPal</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Checkbox id="card" defaultChecked />
                                                <Label htmlFor="card">Credit/Debit Card</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Checkbox id="mobile" />
                                                <Label htmlFor="mobile">Mobile Money</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="bg-red-600 hover:bg-red-700">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Subscription Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeSection === 'notifications' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Bell className="h-5 w-5" />
                                        <span>Notification Settings</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Email Notifications</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>New Subscriptions</span>
                                                <Checkbox id="email-new-sub" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Subscription Cancellations</span>
                                                <Checkbox id="email-cancellations" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>New Comments</span>
                                                <Checkbox id="email-comments" defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Admin Notifications</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>System Alerts</span>
                                                <Checkbox id="admin-system-alerts" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>User Reports</span>
                                                <Checkbox id="admin-user-reports" defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">End-User Notifications</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>Payment Reminders</span>
                                                <Checkbox id="user-payment-reminders" defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Content Updates</span>
                                                <Checkbox id="user-content-updates" />
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="bg-red-600 hover:bg-red-700">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Notification Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Shield className="h-5 w-5" />
                                        <span>Security Settings</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Active Sessions</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                <div>
                                                    <p className="font-medium">Current Session</p>
                                                    <p className="text-sm text-gray-400">Chrome on Windows • IP: 192.168.1.1</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="border-gray-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                <div>
                                                    <p className="font-medium">Mobile App</p>
                                                    <p className="text-sm text-gray-400">iOS App • IP: 192.168.1.2</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="border-gray-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="ip-restriction" />
                                            <Label htmlFor="ip-restriction">Enable IP Address Restrictions</Label>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="allowed-countries">Allowed Countries</Label>
                                            <Input
                                                id="allowed-countries"
                                                placeholder="e.g., US, CA, GB"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Password Management</h3>
                                        <Button variant="outline" className="border-gray-600">
                                            <Lock className="h-4 w-4 mr-2" />
                                            Generate Password Reset Link
                                        </Button>
                                    </div>

                                    <Button className="bg-red-600 hover:bg-red-700">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Security Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Export & Data Management */}
                    {activeSection === 'export' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Download className="h-5 w-5" />
                                        <span>Export & Data Management</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Export User Data</h3>
                                            <div className="space-y-2">
                                                <Button variant="outline" className="w-full border-gray-600 justify-start">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Export as CSV
                                                </Button>
                                                <Button variant="outline" className="w-full border-gray-600 justify-start">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Export as Excel
                                                </Button>
                                                <Button variant="outline" className="w-full border-gray-600 justify-start">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Export as PDF
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Export Subscription Data</h3>
                                            <div className="space-y-2">
                                                <Button variant="outline" className="w-full border-gray-600 justify-start">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Export as CSV
                                                </Button>
                                                <Button variant="outline" className="w-full border-gray-600 justify-start">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Export as Excel
                                                </Button>
                                                <Button variant="outline" className="w-full border-gray-600 justify-start">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Export as PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Export Movie Reports</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Button variant="outline" className="border-gray-600">
                                                <Download className="h-4 w-4 mr-2" />
                                                View Analytics
                                            </Button>
                                            <Button variant="outline" className="border-gray-600">
                                                <Download className="h-4 w-4 mr-2" />
                                                Revenue Report
                                            </Button>
                                            <Button variant="outline" className="border-gray-600">
                                                <Download className="h-4 w-4 mr-2" />
                                                User Engagement
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Data Backup</h3>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="auto-backup" />
                                            <Label htmlFor="auto-backup">Enable Automatic Daily Backups</Label>
                                        </div>
                                        <Button variant="outline" className="border-gray-600">
                                            <Database className="h-4 w-4 mr-2" />
                                            Create Manual Backup
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Admin Management */}
                    {activeSection === 'admin' && (
                        <div className="space-y-6">
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Crown className="h-5 w-5" />
                                        <span>Admin Management</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Add New Admin</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Admin name"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                            <Input
                                                placeholder="Admin email"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Role/Permissions</Label>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 border-gray-600">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                    <SelectItem value="full-admin">Full Admin</SelectItem>
                                                    <SelectItem value="content-manager">Content Manager</SelectItem>
                                                    <SelectItem value="support">Support</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button className="bg-red-600 hover:bg-red-700">
                                            <Users className="h-4 w-4 mr-2" />
                                            Add Admin
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Current Admins</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-700">
                                                        <th className="text-left py-2">Name</th>
                                                        <th className="text-left py-2">Email</th>
                                                        <th className="text-left py-2">Role</th>
                                                        <th className="text-left py-2">Status</th>
                                                        <th className="text-left py-2">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b border-gray-700">
                                                        <td className="py-3">John Admin</td>
                                                        <td className="py-3">john@streaminga.com</td>
                                                        <td className="py-3">Full Admin</td>
                                                        <td className="py-3">
                                                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Active</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <Button variant="outline" size="sm" className="border-gray-600 mr-2">
                                                                Edit
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                                                                Suspend
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b border-gray-700">
                                                        <td className="py-3">Sarah Manager</td>
                                                        <td className="py-3">sarah@streaminga.com</td>
                                                        <td className="py-3">Content Manager</td>
                                                        <td className="py-3">
                                                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Active</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <Button variant="outline" size="sm" className="border-gray-600 mr-2">
                                                                Edit
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                                                                Suspend
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-3">Mike Support</td>
                                                        <td className="py-3">mike@streaminga.com</td>
                                                        <td className="py-3">Support</td>
                                                        <td className="py-3">
                                                            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">Suspended</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <Button variant="outline" size="sm" className="border-gray-600 mr-2">
                                                                Edit
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="border-green-600 text-green-400">
                                                                Activate
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}