import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Weekly',
        price: '$4.99',
        period: 'week',
        features: ['Access to all movies', 'HD streaming', 'Cancel anytime'],
        popular: false,
    },
    {
        name: 'Monthly',
        price: '$14.99',
        period: 'month',
        features: [
            'Access to all movies',
            'HD & 4K streaming',
            'Download for offline',
            'Cancel anytime',
        ],
        popular: true,
    },
    {
        name: 'Yearly',
        price: '$99.99',
        period: 'year',
        features: [
            'Access to all movies',
            'HD & 4K streaming',
            'Download for offline',
            'Priority support',
            'Cancel anytime',
        ],
        popular: false,
    },
];

export default function Subscription() {
    return (
        <>
            <Head title="Choose Your Plan" />

            <div className="min-h-screen bg-gray-900 px-4 py-16 text-white">
                <div className="mx-auto max-w-6xl text-center">
                    <h1 className="mb-4 text-5xl font-bold">
                        Choose Your Plan
                    </h1>
                    <p className="mb-12 text-xl text-gray-400">
                        Stream unlimited movies and TV shows on your favorite
                        devices.
                    </p>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`relative border-gray-700 bg-gray-800 transition-all duration-300 hover:scale-105 hover:border-red-500 ${
                                    plan.popular
                                        ? 'border-red-500 ring-2 ring-red-500'
                                        : ''
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                                        <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-semibold text-white">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <CardHeader className="pb-8 text-center">
                                    <CardTitle className="mb-2 text-2xl font-bold">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mb-1 text-4xl font-bold text-red-500">
                                        {plan.price}
                                    </div>
                                    <div className="text-gray-400">
                                        per {plan.period}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <ul className="mb-8 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-center"
                                            >
                                                <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                                                <span className="text-gray-300">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full py-3 text-lg font-semibold ${
                                            plan.popular
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    >
                                        Subscribe
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="mb-4 text-gray-400">
                            All plans include a 7-day free trial. Cancel
                            anytime.
                        </p>
                        <p className="text-sm text-gray-500">
                            By subscribing, you agree to our Terms of Service
                            and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
