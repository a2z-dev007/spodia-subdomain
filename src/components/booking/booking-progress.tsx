interface BookingProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: 'Select Room' },
  { number: 2, title: 'Guest Info' },
  { number: 3, title: 'Add-Ons' },
  { number: 4, title: 'Payment' },
];

export function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step.number <= currentStep ? 'text-primary font-medium' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  step.number < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}