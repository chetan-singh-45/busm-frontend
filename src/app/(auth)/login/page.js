'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import { Eye, EyeOff } from 'lucide-react'
import ChaseLoader from '@/components/ChaseLoader';

const Login = () => {
    const router = useRouter()

    const { login, user } = useAuth({
        middleware: 'guest',
        // redirectIfAuthenticated: '/notifier', // Removed for manual redirect
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    }, [router.reset, errors])

    useEffect(() => {
        if (user) {
            setIsSubmitting(false)
            setIsRedirecting(true)

            const pendingWatchlist = localStorage.getItem('pendingWatchlist')
            const hasPending = pendingWatchlist && JSON.parse(pendingWatchlist)?.length > 0

            setTimeout(() => {

                // Normal role-based redirection
                if (user.role == 1) {
                    router.push('/admin_dashboard')
                } else if (user.role == 2 && hasPending) {
                    router.push('/watchlist')
                } else {
                    router.push('/notifier')

                }
            }, 1000)
        }
    }, [user])

    const submitForm = async event => {
        event.preventDefault()
        setIsSubmitting(true)

        await login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })

    }
    if (isRedirecting) return <ChaseLoader message="Loading..." />;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-center text-[#0A1045] mb-1">
                    Login to Trend Notifier
                </h2>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Access your alerts and watchlist
                </p>

                <AuthSessionStatus className="mb-4" status={status} />

                <form onSubmit={submitForm} className="space-y-5">
                    <div>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                            placeholder="Email address"
                            className="w-full rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500"
                        />
                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="w-full rounded-full px-4 py-2 border border-gray-300 pr-10 focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <InputError messages={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                        <input
                            type="checkbox"
                            id="remember_me"
                            checked={shouldRemember}
                            onChange={e => setShouldRemember(e.target.checked)}
                            className="rounded border-gray-300 text-green-600 mr-2"
                        />
                        <label htmlFor="remember_me">Remember me</label>
                    </div>

                    <Button
                        loading={isSubmitting}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full text-sm"
                    >
                        {isSubmitting ? 'Logging in' : 'Login'}
                    </Button>


                </form>

                <div className="text-center mt-5 text-sm space-y-1">
                    <p>
                        Don’t have an account?{' '}
                        <Link href="/register" className="text-green-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                    <p>
                        <Link href="/forgot-password" className="text-gray-500 hover:underline">
                            Forgot your password?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
