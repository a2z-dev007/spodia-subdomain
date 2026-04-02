import { CheckCircle, Download, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Mock booking confirmation data
const bookingData = {
  bookingId: 'SPD-2024-001234',
  qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PC9zdmc+',
  hotel: {
    name: 'Fairmont Resort, Dubai Marina',
    address: 'Dubai Marina Walk, Dubai Marina, Dubai, UAE',
    phone: '+971 4 123 4567',
    email: 'reservations@fairmont-dubai.com',
  },
  guest: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
  },
  stay: {
    checkIn: '15 Jan 2024',
    checkOut: '18 Jan 2024',
    nights: 3,
    room: 'Deluxe Ocean View Room',
    guests: '2 Adults',
  },
  payment: {
    total: 631.46,
    method: 'Credit Card ending in 1234',
    transactionId: 'TXN-789012345',
  },
  addOns: [
    'Airport Pickup - $45.00',
    'Breakfast Package - $75.00',
    'Late Checkout - $25.00',
  ],
};

export function BookingSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 pt-44">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for choosing Spodia. Your reservation is confirmed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Booking Details</span>
                  <span className="text-sm font-normal text-gray-500">
                    ID: {bookingData.bookingId}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hotel Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{bookingData.hotel.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{bookingData.hotel.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{bookingData.hotel.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{bookingData.hotel.email}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stay Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Stay Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{bookingData.stay.checkIn} - {bookingData.stay.checkOut}</span>
                      </div>
                      <p className="text-gray-600">{bookingData.stay.nights} nights</p>
                      <p className="text-gray-600">{bookingData.stay.room}</p>
                      <p className="text-gray-600">{bookingData.stay.guests}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Guest Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{bookingData.guest.name}</p>
                      <p>{bookingData.guest.email}</p>
                      <p>{bookingData.guest.phone}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Add-ons */}
                {bookingData.addOns.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Add-ons Included</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {bookingData.addOns.map((addOn, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{addOn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Amount Paid</span>
                    <span className="font-bold text-lg">${bookingData.payment.total}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Payment Method: {bookingData.payment.method}</p>
                    <p>Transaction ID: {bookingData.payment.transactionId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code and Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Mobile Check-in</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={bookingData.qrCode}
                    alt="QR Code"
                    className="w-24 h-24"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Show this QR code at the hotel for quick check-in
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>

                <Button variant="outline" className="w-full">
                  View Booking Details
                </Button>

                <Button variant="outline" className="w-full">
                  Book Another Stay
                </Button>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2">
                <p>• Check-in time: 3:00 PM</p>
                <p>• Check-out time: 12:00 PM</p>
                <p>• Free cancellation until 24 hours before check-in</p>
                <p>• Please carry a valid ID for check-in</p>
                <p>• Confirmation email sent to {bookingData.guest.email}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Need help with your booking?
          </p>
          <p className="text-primary font-medium">
            Call us at +918800842084 or email support@spodia.com
          </p>
        </div>
      </div>
    </div>
  );
}