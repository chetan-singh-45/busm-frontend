'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import AdminNavigation from '@/app/(admin)/AdminNavigation'
import Loading from '@/app/(app)/Loading'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {user?.role == 1 ? (
                <AdminNavigation user={user}>{children}</AdminNavigation>
            ) : (
                <>
                    <Navigation user={user} />
                    <main>{children}</main>
                </>
            )}
        </div>
    )
}

export default AppLayout

