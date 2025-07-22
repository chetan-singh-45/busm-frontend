'use client'

import FrontendNavigation from '@/app/(frontend)/FrontendNavigation'
import Footer from '@/components/Footer'
import FrontendLoading from './loading'
import { Suspense } from "react";

const FrontendLayout = ({ children }) => {

    return (
        <>
        <Suspense fallback={<FrontendLoading />}>
            <FrontendNavigation />
        </Suspense>
            <main className="p-6">{children}</main>
            <Footer />
        </>
    )
}

export default FrontendLayout
