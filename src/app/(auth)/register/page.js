'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const submitForm = event => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 sm:p-8 shadow-xl">
                {/* Heading */}
                <h2 className="text-lg sm:text-xl font-bold text-[#0a0a35] text-center">
                    Create a Free Account to Start Your Watchlist
                </h2>
                <p className="text-sm text-center text-gray-600 mt-1 mb-6">
                    Spot Opportunities as they arise!
                </p>

                <form onSubmit={submitForm} className="space-y-4">
                    {/* Name */}
                    <div>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nickname"
                            value={name}
                            className="w-full rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500"
                            onChange={event => setName(event.target.value)}
                            required
                        />
                        <InputError messages={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            className="w-full rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            className="w-full rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500"
                            onChange={event => setPassword(event.target.value)}
                            required
                        />
                        <InputError messages={errors.password} className="mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Input
                            id="passwordConfirmation"
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordConfirmation}
                            className="w-full rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500"
                            onChange={event => setPasswordConfirmation(event.target.value)}
                            required
                        />
                        <InputError messages={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full text-sm"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Footer Links */}
                <p className="text-sm text-center mt-5 text-gray-700">
                    Already have an account?{' '}
                    <Link href="/login" className="text-green-600 font-medium hover:underline">
                        Sign In
                    </Link>
                </p>

                <p className="text-xs text-center text-gray-500 mt-2">
                    By signing up you agree to our{' '}
                    <Link href="/terms" className="underline">
                        Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}

export default Page
