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

const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    }, [router.reset, errors])

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
  <div className="flex items-center justify-center py-16">
  <div className="bg-[#0a0839] text-white rounded-xl shadow-lg px-6 py-8 w-[360px]">
    <h2 className="text-xl font-bold text-center text-green-500 mb-6">Login to Trend Notifier</h2>

                <AuthSessionStatus className="mb-4" status={status} />

                <form onSubmit={submitForm}>
                    {/* Email Address */}
                    <div>
                        <Label htmlFor="email" className="text-[#0a0839]">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                            placeholder="Enter your email"
                        />
                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <Label htmlFor="password" className="text-[#0a0839]">Password</Label>

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                className="block mt-1 w-full pr-10"
                                onChange={event => setPassword(event.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-green-600 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <InputError messages={errors.password} className="mt-2" />
                    </div>

                    {/* Remember Me */}
                    <div className="block mt-4">
                        <label htmlFor="remember_me" className="inline-flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                name="remember"
                                className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-400"
                                onChange={event => setShouldRemember(event.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Remember me
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end mt-6 space-x-4">
                        <Link href="/register" className="text-sm text-gray-600 underline hover:text-green-600">
                            Register
                        </Link>
                        <Link href="/forgot-password" className="text-sm text-gray-600 underline hover:text-green-600">
                            Forgot your password?
                        </Link>
                        <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md">
                            Login
                        </Button>
                    </div>
                </form>
            </div>
    </div>
    )
}

export default Login
