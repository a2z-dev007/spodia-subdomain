'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Coffee, Clock, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const addOns = [
  {
    id: 'airport-pickup',
    name: 'Airport Pickup',
    description: 'Private car transfer from Dubai International Airport to hotel',
    price: 45.00,
    icon: Plane,
  },
  {
    id: 'breakfast',
    name: 'Breakfast Package',
    description: 'Daily buffet breakfast for all guests (3 days)',
    price: 75.00,
    icon: Coffee,
  },
  {
    id: 'late-checkout',
    name: 'Late Checkout',
    description: 'Extend your checkout time until 6:00 PM',
    price: 25.00,
    icon: Clock,
  },
  {
    id: 'car-rental',
    name: 'Car Rental',
    description: 'Compact car rental for 3 days with insurance',
    price: 120.00,
    icon: Car,
  },
];

export function AddOnsSelection() {
  const router = useRouter();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const getTotalAddOnsPrice = () => {
    return selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn ? addOn.price : 0);
    }, 0);
  };

  const basePrice = 511.46;
  const totalPrice = basePrice + getTotalAddOnsPrice();

  const handleContinue = () => {
    router.push('/booking/payment');
  };

  const handleSkip = () => {
    router.push('/booking/payment');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Enhance Your Stay</CardTitle>
            <p className="text-gray-600">Add optional services to make your trip even better</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {addOns.map((addOn) => (
              <div
                key={addOn.id}
                className={`border rounded-xl p-6 transition-all ${
                  selectedAddOns.includes(addOn.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <addOn.icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {addOn.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {addOn.description}
                      </p>
                      <div className="text-xl font-bold text-primary">
                        ${addOn.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={selectedAddOns.includes(addOn.id)}
                    onCheckedChange={() => toggleAddOn(addOn.id)}
                  />
                </div>
              </div>
            ))}
            
            {selectedAddOns.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No add-ons selected. You can skip this step if you prefer.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Updated Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Room & Stay</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              
              {selectedAddOns.map(addOnId => {
                const addOn = addOns.find(a => a.id === addOnId);
                if (!addOn) return null;
                
                return (
                  <div key={addOnId} className="flex justify-between text-sm">
                    <span>{addOn.name}</span>
                    <span>${addOn.price.toFixed(2)}</span>
                  </div>
                );
              })}
              
              {selectedAddOns.length > 0 && (
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Add-ons Total</span>
                    <span>${getTotalAddOnsPrice().toFixed(2)}</span>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Continue to Payment
            </Button>
            
            <Button 
              onClick={handleSkip}
              variant="outline" 
              className="w-full"
            >
              Skip Add-Ons
            </Button>
            
            <div className="text-xs text-gray-600 text-center">
              You can modify or cancel add-ons later
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}