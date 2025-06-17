import { useForm, Head } from '@inertiajs/react';
import Header from '@/components/landingpage/header';
import Footer from '@/components/landingpage/footer';
import React, { useMemo } from 'react';

export default function ContactUs() {
    const { data, setData, post, processing, errors } = useForm({
        firstName: '',
        lastName: '',
        contactNumber: '',
        emailAddress: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'contactNumber') {
            // Only allow numbers
            if (!/^\d*$/.test(value)) return;
        }

        if (name === 'message') {
            // Limit to 300 characters
            if (value.length > 300) return;
        }

        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                setData({
                    firstName: '',
                    lastName: '',
                    contactNumber: '',
                    emailAddress: '',
                    message: ''
                });
            }
        });
    };

    const characterCount = data.message.length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Contact Us" />
            <Header />
            
            <main className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">GET IN TOUCH</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-8 lg:p-12">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                        GOT QUESTIONS AND INQUIRIES?
                                    </h2>
                                    <p className="text-gray-600">
                                        Communicate with us by filling out the form below
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={data.firstName}
                                                onChange={handleInputChange}
                                                placeholder="First Name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                                                required
                                            />
                                            {errors.firstName && <span className="text-red-600 text-sm">{errors.firstName}</span>}
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={data.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Last Name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                                                required
                                            />
                                            {errors.lastName && <span className="text-red-600 text-sm">{errors.lastName}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                                Contact Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="contactNumber"
                                                name="contactNumber"
                                                value={data.contactNumber}
                                                onChange={handleInputChange}
                                                placeholder="Contact Number"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                                                required
                                            />
                                            {errors.contactNumber && <span className="text-red-600 text-sm">{errors.contactNumber}</span>}
                                        </div>
                                        <div>
                                            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="emailAddress"
                                                name="emailAddress"
                                                value={data.emailAddress}
                                                onChange={handleInputChange}
                                                placeholder="Email Address"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                                                required
                                            />
                                            {errors.emailAddress && <span className="text-red-600 text-sm">{errors.emailAddress}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={data.message}
                                            onChange={handleInputChange}
                                            placeholder="Your Message"
                                            rows={6}
                                            maxLength={300}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors resize-vertical"
                                            required
                                        />
                                        <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                                            <span>{characterCount}/300 characters</span>
                                            {errors.message && <span className="text-red-600">{errors.message}</span>}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 outline-none"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Form'}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-teal-600 p-8 lg:p-12 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="rounded-lg p-8 backdrop-blur-sm">
                                        <div className="w-80 h-80 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                                            <img 
                                                src="/assets/LogoWhite.jfif" 
                                                alt="Brand Icon" 
                                                className="w-64 h-64 object-contain"
                                            />
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
