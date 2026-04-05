"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown, Menu, X, User, Settings, LogOut, Calendar, Hotel, Clock, UtensilsCrossed, Sparkles, PartyPopper, Building2, Info, Phone, HelpCircle, Briefcase, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import { MdEmail } from "react-icons/md"
import UserAvatar from "@/components/ui/UserAvatar"
import { IMAGES } from "@/assets/images"
import { LINKS, CONTACT_INFO } from "@/utils/const"

interface HeaderProps {
    // These props are kept for backward compatibility but ignored for the new full-width fixed style
    withScrollEffect?: boolean
    isFloating?: boolean
}

const Header = ({ }: HeaderProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [selectedCurrency, setSelectedCurrency] = useState("INR")
    const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
    const headerRef = useRef<HTMLElement>(null)

    const pathname = usePathname()
    const { user } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
    const dispatch = useAppDispatch()
    const router = useRouter()

    // Scroll handler to hide top menu and update header height
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50
            setIsScrolled(scrolled)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Calculate dynamic header height and set CSS variable
    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
                const height = headerRef.current.offsetHeight
                document.documentElement.style.setProperty('--header-height', `${height}px`)
            }
        }

        updateHeight()
        // Use a small delay to ensure transitions have finished or browser has painted
        const timer = setTimeout(updateHeight, 350)
        
        window.addEventListener("resize", updateHeight)
        return () => {
            window.removeEventListener("resize", updateHeight)
            clearTimeout(timer)
        }
    }, [isScrolled, isMobileMenuOpen])

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isMobileMenuOpen])

    const navItems = [
        { label: "Hotels", href: "/", icon: Hotel },
        { label: "Hourly Stays", href: LINKS.HOURLY_ROOMS, icon: Clock },
        { label: "Restaurants", href: LINKS.RESTAURANTS, icon: UtensilsCrossed },
        { label: "Spas", href: LINKS.SPAS, icon: Sparkles },
        { label: "Events", href: LINKS.EVENT_VENUES, icon: PartyPopper },
    ]

    const topNavItems = [
        { label: "About Us", href: "/about-us", icon: Info },
        { label: "Contact Us", href: "/contact", icon: Phone },
        { label: "FAQs", href: "/faqs", icon: HelpCircle },
        { label: "Career", href: "/career", icon: Briefcase },
    ]

    // Only hide the top utility bar on scroll
    const hideTopUtilityBar = isScrolled

    const currencies = [
        { code: "INR", symbol: "₹", name: "Indian Rupee" },
        { code: "USD", symbol: "$", name: "US Dollar" },
    ]

    const handleLogout = () => {
        dispatch(logout())
        setShowUserMenu(false)
        router.push("/")
    }

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-300 bg-white border-b border-gray-100 shadow-sm"
        >
            {/* Top Menu - Hides on scroll */}
            <div className={`hidden lg:block transition-all duration-500 ease-in-out overflow-hidden px-6 ${
                hideTopUtilityBar
                ? "max-h-0 opacity-0 pointer-events-none" 
                : "max-h-20 opacity-100 pt-3 pb-2"
            }`}>
                <div className="max-w-[1920px] mx-auto flex items-center justify-between text-sm w-full px-0">
                    <div className="flex items-center space-x-4 xl:space-x-8">
                        <span className="flex items-center text-gray-600 font-medium whitespace-nowrap">
                            <span className="mr-1.5">📞</span>
                            {CONTACT_INFO.mobile1}
                        </span>
                        <span className="flex items-center text-gray-600 font-medium">
                            <span className="mr-2">
                                <MdEmail />
                            </span>
                            {CONTACT_INFO.email2}
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 xl:space-x-6">
                        <nav className="flex items-center space-x-2 xl:space-x-6">
                            {topNavItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center space-x-1 text-gray-600 hover:text-[#FF9530] transition-colors text-sm font-medium whitespace-nowrap"
                                    >
                                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                        <div
                            className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors">
                            <Globe className="w-4 h-4" />
                            <span className="font-medium">EN</span>
                            <ChevronDown className="w-3 h-3" />
                        </div>
                        <Popover open={showCurrencyMenu} onOpenChange={setShowCurrencyMenu}>
                            <PopoverTrigger asChild>
                                <div
                                    className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors">
                                    <span className="font-medium">{selectedCurrency}</span>
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-48 p-2 shadow-lg border-0 rounded-xl"
                                align="end"
                            >
                                <div className="space-y-1">
                                    {currencies.map((currency) => (
                                        <button
                                            key={currency.code}
                                            onClick={() => {
                                                setSelectedCurrency(currency.code)
                                                setShowCurrencyMenu(false)
                                            }}
                                            className={`flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors ${selectedCurrency === currency.code
                                                ? "bg-[#FF9530] text-white hover:bg-[#e8851c]"
                                                : "text-gray-700"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{currency.symbol}</span>
                                                <span className="text-sm">{currency.code}</span>
                                            </div>
                                            <span className="text-xs opacity-75">{currency.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div
                className={`px-4 lg:px-6 xl:px-8 transition-all duration-300 py-3 xl:py-4 w-full`}
            >
                <div className="flex items-center justify-between max-w-[1920px] mx-auto gap-4 w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <Image
                            src={IMAGES.logo.src}
                            alt="Spodia Logo"
                            width={60}
                            height={50}
                            className=""
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav
                        className="hidden lg:flex items-center lg:gap-4 xl:gap-8 flex-1 justify-center">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center space-x-1 xl:space-x-1.5 transition-colors text-[14px] xl:text-lg font-semibold relative group whitespace-nowrap ${isActive
                                        ? "text-[#FF9530]"
                                        : "text-gray-700 hover:text-[#FF9530]"
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5 xl:w-5 xl:h-5 flex-shrink-0" />
                                    <span>{item.label}</span>
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-[#FF9530] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                                            }`}
                                    ></span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
                        <Link 
                            href={LINKS.LIST_YOUR_PROPERTY}
                            className="border bg-white/50 text-[#FF9530] border-[#FF9530] hover:bg-[#e8851c] hover:text-white font-semibold rounded-full px-4 py-2 xl:py-2.5 text-sm xl:text-base transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center justify-center"
                        >
                            <Building2 className="w-3.5 h-3.5 xl:w-4 xl:h-4 mr-1.5 xl:mr-2" />
                            <span className="hidden xl:inline">List Your Property</span>
                            <span className="xl:hidden">List Property</span>
                        </Link>
                        {user ? (
                            <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
                                <PopoverTrigger asChild>
                                    <button
                                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <UserAvatar user={user} size="md" showRing />
                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-64 p-0 shadow-lg border-0 rounded-xl"
                                    align="end"
                                >
                                    <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.full_name}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                router.push("/dashboard")
                                                setShowUserMenu(false)
                                            }}
                                            className={`flex items-center space-x-3 w-full p-3 text-left rounded-lg transition-colors ${pathname === "/dashboard"
                                                ? "bg-[#FF9530] text-white"
                                                : "hover:bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            <User className={`w-4 h-4 ${pathname === "/dashboard" ? "text-white" : "text-gray-600"
                                                }`} />
                                            <span className="font-medium">Dashboard</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push("/my-bookings")
                                                setShowUserMenu(false)
                                            }}
                                            className={`flex items-center space-x-3 w-full p-3 text-left rounded-lg transition-colors ${pathname === "/my-bookings" || pathname.startsWith("/booking-details")
                                                ? "bg-[#FF9530] text-white"
                                                : "hover:bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            <Calendar className={`w-4 h-4 ${pathname === "/my-bookings" || pathname.startsWith("/booking-details") ? "text-white" : "text-gray-600"
                                                }`} />
                                            <span className="font-medium">My Bookings</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push("/profile")
                                                setShowUserMenu(false)
                                            }}
                                            className={`flex items-center space-x-3 w-full p-3 text-left rounded-lg transition-colors ${pathname === "/profile"
                                                ? "bg-[#FF9530] text-white"
                                                : "hover:bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            <Settings className={`w-4 h-4 ${pathname === "/profile" ? "text-white" : "text-gray-600"
                                                }`} />
                                            <span className="font-medium">Profile Settings</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 w-full p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Link
                                href={LINKS.LOGIN}
                                className="gradient-btn hover:opacity-95 text-white font-semibold shadow-lg rounded-full px-8 py-2 xl:py-2.5 text-sm xl:text-base transition-all duration-300 hover:scale-105 flex items-center justify-center"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Menu - Side Drawer */}
                <>
                    {/* Backdrop */}
                    <div
                        className={`lg:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 z-[9998]' : 'opacity-0 pointer-events-none -z-10'
                            }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Side Drawer */}
                    <div
                        className={`lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <div className="flex flex-col h-full overflow-y-auto overscroll-contain">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                                <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <nav className="flex-1 px-4 py-6">
                                {user ? (
                                    <div className="space-y-3">
                                        <div
                                            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                            <UserAvatar user={user} size="lg" showRing />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{user.full_name}</p>
                                                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                router.push("/dashboard")
                                                setIsMobileMenuOpen(false)
                                            }}
                                            variant={pathname === "/dashboard" ? "default" : "outline"}
                                            className={`w-full font-semibold rounded-xl py-4 text-base transition-all duration-200 ${pathname === "/dashboard"
                                                ? "bg-[#FF9530] hover:bg-[#e8851c] text-white border-[#FF9530]"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <User className="w-5 h-5 mr-2" />
                                            Dashboard
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                router.push("/my-bookings")
                                                setIsMobileMenuOpen(false)
                                            }}
                                            variant={pathname === "/my-bookings" || pathname.startsWith("/booking-details") ? "default" : "outline"}
                                            className={`w-full font-semibold rounded-xl py-4 text-base transition-all duration-200 ${pathname === "/my-bookings" || pathname.startsWith("/booking-details")
                                                ? "bg-[#FF9530] hover:bg-[#e8851c] text-white border-[#FF9530]"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <Calendar className="w-5 h-5 mr-2" />
                                            My Bookings
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                router.push("/profile")
                                                setIsMobileMenuOpen(false)
                                            }}
                                            variant={pathname === "/profile" ? "default" : "outline"}
                                            className={`w-full font-semibold rounded-xl py-4 text-base transition-all duration-200 ${pathname === "/profile"
                                                ? "bg-[#FF9530] hover:bg-[#e8851c] text-white border-[#FF9530]"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <Settings className="w-5 h-5 mr-2" />
                                            Profile Settings
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleLogout()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            variant="outline"
                                            className="w-full border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl py-4 text-base transition-all duration-200"
                                        >
                                            <LogOut className="w-5 h-5 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            router.push("/login")
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full gradient-btn hover:opacity-95 text-white font-semibold shadow-lg rounded-full px-6 py-2.5 transition-all duration-300 hover:scale-105"
                                    >
                                        Login
                                    </Button>
                                )}
                                <div className="space-y-1 mb-6 mt-6">
                                    {navItems.map((item) => {
                                        const isActive =
                                            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                                        const Icon = item.icon
                                        return (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                className={`flex items-center space-x-3 text-lg font-semibold py-4 px-4 rounded-xl transition-all duration-200 ${isActive
                                                    ? "text-[#FF9530] bg-orange-50 border-l-4 border-[#FF9530]"
                                                    : "text-gray-700 hover:text-[#FF9530] hover:bg-gray-50"
                                                    }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <Icon className="w-5 h-5 flex-shrink-0" />
                                                <span>{item.label}</span>
                                            </Link>
                                        )
                                    })}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <Link
                                    href={LINKS.LIST_YOUR_PROPERTY}
                                        className="w-full border bg-white/50 text-[#FF9530] border-[#FF9530] hover:bg-[#e8851c] hover:text-white font-semibold rounded-full px-6 py-2.5 transition-all duration-300 hover:scale-105 flex items-center  justify-center"
                                    >
                                        <Building2 className="w-5 h-5 mr-2" />
                                        List Your Property
                                    </Link>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mb-6">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
                                        Quick Links
                                    </p>
                                    <div className="space-y-1">
                                        {topNavItems.map((item) => {
                                            const Icon = item.icon
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    className="flex items-center space-x-3 text-gray-600 hover:text-[#FF9530] hover:bg-gray-50 font-medium py-3 px-4 rounded-lg text-base transition-all duration-200"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 pb-24">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
                                        Get in Touch
                                    </p>
                                    <div className="space-y-3">
                                        <a
                                            href={`tel:${CONTACT_INFO.mobile1}`}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div
                                                className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-lg">📞</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Call Us</p>
                                                <p className="text-sm text-gray-600">{CONTACT_INFO.mobile1}</p>
                                            </div>
                                        </a>
                                        <a
                                            href={`mailto:${CONTACT_INFO.email2}`}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div
                                                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-lg">✉️</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Email Us</p>
                                                <p className="text-sm text-gray-600">{CONTACT_INFO.email2}</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </>
            </div>
        </header>
    )
}

export default Header