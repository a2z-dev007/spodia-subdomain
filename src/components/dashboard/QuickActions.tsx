import {Button} from "@/components/ui/button"
import {Search, Heart, Gift, MessageCircle, CreditCard, Settings} from "lucide-react"

const QuickActions = () => {
    const actions = [
        {
            icon: Search,
            label: "Search Hotels",
            description: "Find your next perfect stay",
            color: "bg-blue-500",
            href: "/hotels",
        },
        {
            icon: Heart,
            label: "Wishlist",
            description: "View saved properties",
            color: "bg-red-500",
            href: "/wishlist",
        },
        {
            icon: Gift,
            label: "Rewards",
            description: "Check your loyalty points",
            color: "bg-purple-500",
            href: "/rewards",
        },
        {
            icon: MessageCircle,
            label: "Support",
            description: "Get help with your booking",
            color: "bg-green-500",
            href: "/contact",
        },
        {
            icon: CreditCard,
            label: "Payment Methods",
            description: "Manage your cards",
            color: "bg-yellow-500",
            href: "/payment-methods",
        },
        {
            icon: Settings,
            label: "Settings",
            description: "Update your preferences",
            color: "bg-gray-500",
            href: "/settings",
        },
    ]

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow"
                        asChild
                    >
                        <a href={action.href}>
                            <div className={`p-2 rounded-lg ${action.color} text-white mb-2`}>
                                <action.icon className="w-5 h-5"/>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900">{action.label}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                        </a>
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default QuickActions
