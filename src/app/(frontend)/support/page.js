'use client';

import { useState, useEffect } from 'react';
import HeadingSection from '@/components/HeadingSection';
import { useAuth } from '@/hooks/auth';
import { useTickets } from '@/hooks/tickets';

export default function RaiseTicketForm() {

    const { user } = useAuth();
    const { tickets, storeTickets } = useTickets();
    const [ email, setEmail ] = useState('')
    const [loading, setLoading] = useState(true);

    const [ticketNumber, setTicketNumber] = useState(null);
    const [submitted, setSubmitted] = useState(false);
 
    const [formData, setFormData] = useState({
        name: '',
        query: '',
    });

    useEffect(() => {
      if (user?.email) setEmail(user.email);
    }, [user?.email]);
    

    
    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
    };
    
    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        storeTickets(formData)
        setSubmitted(true);
    };

    return (
        <>
            <div className="min-h-screen">
                {/* Page Header */}
                <HeadingSection title="Support Pannel" />
                {/* Main Content Container */}
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <div className="bg-white shadow-md rounded-lg p-8 sm:p-10">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Raise a Support Ticket</h2>

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={email}
                                        onChange={handleChange}
                                        // readOnly={!!userEmail}
                                        className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-100 text-gray-600"
                                    />
                                </div>

                                {/* Query Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Query</label>
                                    <textarea
                                        name="query"
                                        required
                                        value={formData.query}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-full font-semibold transition duration-200"
                                >
                                    Submit Ticket
                                </button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-green-600 mb-2">Ticket Raised!</h3>
                                <p className="text-gray-500">Our support team will reach out to your chat or email shortly.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}
