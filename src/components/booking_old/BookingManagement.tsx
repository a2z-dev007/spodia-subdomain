"use client"

import {useEffect} from "react"
import {useAppSelector, useAppDispatch} from "@/lib/hooks"
import {loadBookings, cancelBooking} from "@/lib/features/booking/bookingSlice"
import {Button} from "@/components/ui/button"
import {Calendar, MapPin, Users, Phone, Mail, Download} from "lucide-react"

const BookingManagement = () => {
    const dispatch = useAppDispatch()
    const {bookings, isLoading} = useAppSelector((state) => state?.booking ?? { bookings: [], isLoading: false })

    useEffect(() => {
        dispatch(loadBookings())
    }, [dispatch])

    const handleCancelBooking = (bookingId: string) => {
        if (confirm("Are you sure you want to cancel this booking?")) {
            dispatch(cancelBooking(bookingId))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                <p className="text-gray-600">Manage your hotel reservations</p>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                    <div className="text-gray-400 mb-4">
                        <Calendar className="w-16 h-16 mx-auto"/>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring our hotels!</p>
                    <Button
                        onClick={() => (window.location.href = "/hotels")}
                        className="bg-[#FF9530] hover:bg-[#e8851c] text-white"
                    >
                        Browse Hotels
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{booking.hotelDetails.hotelName}</h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                                    </div>
                                    <p className="text-gray-600 mb-1">Booking Reference: {booking.bookingReference}</p>
                                    <p className="text-sm text-gray-500">Booked
                                        on {new Date(booking.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">${booking.hotelDetails.totalPrice}</p>
                                    <p className="text-sm text-gray-600">Total paid</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-1"/>
                                    <div>
                                        <p className="font-medium text-gray-900">Check-in</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.hotelDetails.checkIn).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-1"/>
                                    <div>
                                        <p className="font-medium text-gray-900">Check-out</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.hotelDetails.checkOut).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Users className="w-5 h-5 text-gray-400 mt-1"/>
                                    <div>
                                        <p className="font-medium text-gray-900">Guests</p>
                                        <p className="text-sm text-gray-600">{booking.hotelDetails.guests} guests</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-1"/>
                                    <div>
                                        <p className="font-medium text-gray-900">Room</p>
                                        <p className="text-sm text-gray-600">{booking.hotelDetails.roomName}</p>
                                    </div>
                                </div>
                            </div>

                            {booking.guestDetails.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Guest Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {booking.guestDetails.map((guest, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                <p className="font-medium text-gray-900">
                                                    {guest.firstName} {guest.lastName}
                                                    {guest.isMainGuest &&
                                                        <span className="text-[#FF9530] text-sm ml-2">(Main)</span>}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                    <div className="flex items-center">
                                                        <Mail className="w-3 h-3 mr-1"/>
                                                        <span>{guest.email}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Phone className="w-3 h-3 mr-1"/>
                                                        <span>{guest.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center space-x-4">
                                    <Button variant="outline"
                                            className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                        <Download className="w-4 h-4 mr-2"/>
                                        Download Receipt
                                    </Button>
                                    {booking.status === "confirmed" && (
                                        <Button variant="outline"
                                                className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                            Modify Booking
                                        </Button>
                                    )}
                                </div>
                                {booking.status === "confirmed" && (
                                    <Button
                                        onClick={() => handleCancelBooking(booking.id)}
                                        variant="outline"
                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        Cancel Booking
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BookingManagement
