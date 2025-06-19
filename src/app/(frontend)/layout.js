'use client'

import FrontendNavigation from '@/app/(frontend)/FrontendNavigation'
import Footer from '@/components/Footer'

const FrontendLayout = ({ children }) => {

    return (
        <>
            <FrontendNavigation />
            <main className="p-6">{children}</main>
            <Footer />
        </>
    )
}

export default FrontendLayout
