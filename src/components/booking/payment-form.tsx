'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, Building, Wallet, MapPin, Shield, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
  },
  {
    id: 'upi',
    name: 'UPI / Digital Wallets',
    description: 'Google Pay, PhonePe, Paytm',
    icon: Smartphone,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: Building,
  },
  {
    id: 'wallet',
    name: 'Wallets',
    description: 'Paytm, Mobikwik, Amazon Pay',
    icon: Wallet,
  },
  {
    id: 'payathotel',
    name: 'Pay at Hotel',
    description: 'Pay when you check-in',
    icon: MapPin,
  },
];

export function PaymentForm() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const basePrice = 511.46;
  const addOnsPrice = 145.00;
  const discount = 25.00;
  const totalPrice = basePrice + addOnsPrice - discount;

  const handleConfirmPayment = () => {
    // Simulate payment processing
    router.push('/booking/success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <label
                      htmlFor={method.id}
                      className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <method.icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Card Details Form */}
        {selectedMethod === 'card' && (
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coupon Code */}
        <Card>
          <CardHeader>
            <CardTitle>Promo Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Secure Payment</h3>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Final Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Room & Stay</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>${addOnsPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>Discount Applied</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleConfirmPayment}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-3"
              >
                <Lock className="h-4 w-4 mr-2" />
                Confirm & Pay ${totalPrice.toFixed(2)}
              </Button>
              
              <div className="text-xs text-gray-600 text-center space-y-1">
                <p>By clicking "Confirm & Pay", you agree to our Terms & Conditions</p>
                <p>Free cancellation until 24 hours before check-in</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600">
                Call us at <span className="font-medium text-primary">+918800842084</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}