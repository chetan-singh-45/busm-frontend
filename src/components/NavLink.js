import Link from 'next/link'

const NavLink = ({ active = false, children, ...props }) => (
    <Link
        {...props}
        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
            active
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-[#0a0839] hover:text-green-500 hover:border-green-300'
        }`}
    >
        {children}
    </Link>
)

export default NavLink
