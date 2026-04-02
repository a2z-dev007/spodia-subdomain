'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function GuestInfoForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    idType: '',
    idNumber: '',
    specialRequests: '',
    bookingForOther: false,
    saveInfo: false,
    agreeTerms: false,
    gstDetails: false,
    companyName: '',
    gstin: '',
    companyAddress: '',
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (formData.agreeTerms) {
      router.push('/booking/add-ons');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
            <p className="text-gray-600">Please provide your details for the booking</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="ae">United Arab Emirates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ID Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Identification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idType">ID Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('idType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="license">Driver's License</SelectItem>
                      <SelectItem value="aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="national">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    placeholder="Enter ID number"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Special Requests</h3>
              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requests or preferences..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            {/* GST Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gstDetails"
                  checked={formData.gstDetails}
                  onCheckedChange={(checked) => handleInputChange('gstDetails', checked as boolean)}
                />
                <Label htmlFor="gstDetails">I need GST invoice</Label>
              </div>
              
              {formData.gstDetails && (
                <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Company Name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gstin">GSTIN *</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value)}
                      placeholder="GST Identification Number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Company Address *</Label>
                    <Textarea
                      id="companyAddress"
                      value={formData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      placeholder="Complete company address"
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bookingForOther"
                  checked={formData.bookingForOther}
                  onCheckedChange={(checked) => handleInputChange('bookingForOther', checked as boolean)}
                />
                <Label htmlFor="bookingForOther">I'm booking for someone else</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveInfo"
                  checked={formData.saveInfo}
                  onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
                />
                <Label htmlFor="saveInfo">Save my information for faster booking next time</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                />
                <Label htmlFor="agreeTerms">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a> *
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Deluxe Ocean View Room</span>
                <span>$444.75</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 room × 3 nights</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & fees</span>
                <span>$66.71</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>$511.46</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!formData.agreeTerms}
            >
              Continue to Add-Ons
            </Button>
            
            <div className="text-xs text-gray-600 text-center">
              You won't be charged yet
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}