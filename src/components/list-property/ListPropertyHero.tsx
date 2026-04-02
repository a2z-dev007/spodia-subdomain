'use client'
import { IMAGES } from "@/assets/images"
import { Check, Loader2, ChevronRight, ChevronLeft, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Select from "react-select";
import {
  useCountries,
  useStates,
  useCities,
  useBecomeHost,
} from "@/hooks/useApi";
import { useState, useEffect } from "react"
import Link from "next/link"
import { customSelectStyles } from "../select/selectStyles"
import { toast } from "sonner"

const ListPropertyHero = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country_id: "",
    region_id: "",
    city_id: "",
    email: "",
    mobile: "",
    password: "",
    country_code: "91",
    user_type: "Hotel Owner",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Real-time password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });

  // reCAPTCHA state
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [recaptchaLoading, setRecaptchaLoading] = useState(false)

  // Update password validation in real-time
  useEffect(() => {
    if (formData.password) {
      setPasswordValidation({
        minLength: formData.password.length >= 6,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasLowercase: /[a-z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
      })
    } else {
      setPasswordValidation({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
      })
    }
  }, [formData.password])

  // API hooks
  const { data: countries } = useCountries();
  const { data: states } = useStates(formData.country_id);
  const { data: cities } = useCities(formData.region_id);
  const { mutate: registerHost, isPending, isSuccess, isError, error } = useBecomeHost();

  // Options for react-select
  const countryOptions = countries ? countries?.records?.map((c: any) => ({ value: c.id, label: c.name })) : [];
  const stateOptions =
    states?.records?.map((s: any) => ({ value: s.id, label: s.name })) ?? [];
  const cityOptions =
    cities?.records?.map((ct: any) => ({ value: ct.id, label: ct.name })) ?? [];

  // ✅ Handle Registration Side Effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully registered!", {
        description: "Property listing initiated! Please check your email for next steps."
      });
      setCurrentStep(1);
      setFormData({
        first_name: "",
        last_name: "",
        country_id: "",
        region_id: "",
        city_id: "",
        email: "",
        mobile: "",
        password: "",
        country_code: "91",
        user_type: "Hotel Owner",
      });
      setConfirmPassword("");
      setRecaptchaToken("");
      setRecaptchaVerified(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      const apiError = error as any;
      const responseData = apiError?.response?.data;
      const statusCode = apiError?.response?.status;
      
      let errorMessage = "";
      
      if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else {
        // Fallback to status codes
        switch (statusCode) {
          case 409:
            errorMessage = "Account Already Exists. This email or mobile is already registered.";
            break;
          case 429:
            errorMessage = "Too Many Requests. Please try again later.";
            break;
          case 400:
            errorMessage = "Invalid request. Please check your mobile number and details.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = apiError?.message || "Registration failed. Please try again.";
        }
      }
      
      toast.error(errorMessage);
    }
  }, [isError, error]);

  // ✅ reCAPTCHA integration
  useEffect(() => {
    if (currentStep !== 2) return;

    const initRecaptcha = () => {
      if (typeof window === "undefined" || !(window as any).grecaptcha || !(window as any).grecaptcha.render) {
        setTimeout(initRecaptcha, 100)
        return
      }

      ;(window as any).grecaptcha.ready(() => {
        const container = document.getElementById("recaptcha-list-property")
        
        // If container disappeared or already has content, handle it
        if (!container || container.children.length > 0) return

        try {
          ;(window as any).grecaptcha.render("recaptcha-list-property", {
            sitekey: "6LemmzYqAAAAALr8V77DYbKH3z8RJosQDILW7pQO",
            callback: (token: string) => {
              setRecaptchaToken(token)
              setRecaptchaVerified(true)
              setRecaptchaLoading(false)
            },
            "expired-callback": () => {
              setRecaptchaVerified(false)
              setRecaptchaToken("")
              toast.warning("Captcha expired. Please verify again.")
            },
            "error-callback": () => {
              setRecaptchaVerified(false)
              setRecaptchaToken("")
              toast.error("Captcha error. Please try again.")
            }
          })
        } catch (error) {
          console.error("Failed to render reCAPTCHA:", error)
        }
      })
    }

    initRecaptcha()
  }, [currentStep])

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.first_name.trim()) errors.first_name = "First name is required";
      if (!formData.last_name.trim()) errors.last_name = "Last name is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Invalid email format";
      }
      if (!formData.mobile.trim()) {
        errors.mobile = "Mobile number is required";
      } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.mobile.replace(/\s/g, ""))) {
        errors.mobile = "Invalid mobile number (10-15 digits)";
      }
    }

    if (step === 2) {
      if (!formData.country_id) errors.country_id = "Country is required";
      if (!formData.region_id) errors.region_id = "State is required";
      if (!formData.city_id) errors.city_id = "City is required";
      if (!formData.password) errors.password = "Password is required";
      if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
      
      if (formData.password && formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
      } else if (formData.password && (!passwordValidation.hasUppercase || !passwordValidation.hasLowercase || !passwordValidation.hasNumber)) {
        errors.password = "Password requirements not met.";
      }
      
      if (formData.password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(1)) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setFormErrors({});
    if (!validateStep(2)) return;
    
    if (!recaptchaVerified) {
      toast.warning("Please verify captcha first")
      return
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (!passwordValidation.hasUppercase || !passwordValidation.hasLowercase || !passwordValidation.hasNumber) {
      setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords and Confirm Password do not match.");
      return;
    }
    let payload = {
      ...formData,
      country_id: String(formData.country_id),
      region_id: String(formData.region_id),
      city_id: String(formData.city_id),
      "g-recaptcha-response": recaptchaToken,
      // Only send password, not confirmPassword
    }
    registerHost(payload);
  };

  return (
    <section
      className="listing-hero text-white md:py-20 pb-20  pt-40  bg-no-repeat w-full "
      style={{
        backgroundImage: `url(${IMAGES.listingHeroBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8      md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start ">
          {/* Left Content */}
          <div className="bg-white/15 backdrop-blur-md rounded-[20px] p-6 sm:p-8 text-white glassCard-border">
            <div className="text-orange-400 text-lg sm:text-sm font-medium mb-2">Your Hosting Hub</div>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold mb-4 sm:mb-6">
              List Your Property on Spodia
            </h1>
            <p className="text-base sm:text-lg mb-16  text-gray-200 leading-relaxed">
              Join thousands of owners using Spodia to reach travelers worldwide. Easily manage bookings,
              track performance, and grow your business all in one platform.
            </p>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                "Reach millions of travelers worldwide",
                "Automate bookings & notifications",
                "Get real-time analytics & smart pricing tools",
                "Explore our analytics and pricing tools!",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start sm:items-center">
                  <Check className="h-5 w-5 text-[#111827] mr-2 sm:mr-3 bg-[#D9D9D9] rounded-full p-1 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] sm:rounded-[40px] p-5 sm:p-10 shadow-2xl text-white transition-all duration-300">
            {/* Ultra-Minimal Step Indicator - Mobile Optimized */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 bg-white/5 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10">
              <h2 className="text-sm sm:text-lg font-bold text-white whitespace-nowrap">
                {currentStep === 1 ? "Basic Details" : "Location & Security"}
              </h2>
              
              <div className="flex items-center gap-1.5 sm:gap-2 ml-4">
                <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs sm:text-sm ${currentStep >= 1 ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white/10 text-white/30"}`}>
                  1
                </div>
                <div className={`h-[1px] w-4 sm:w-6 rounded-full transition-colors duration-500 ${currentStep >= 2 ? "bg-orange-500" : "bg-white/10"}`}></div>
                <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs sm:text-sm ${currentStep >= 2 ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white/10 text-white/30"}`}>
                  2
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
              {currentStep === 1 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Step 1 Fields */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/90 mb-2 ml-1">
                      You are <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {[{ label: "Hotel/Accomodation", value: "Hotel Owner" }].map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, user_type: role.value }))}
                          className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${formData.user_type === role.value
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 active:scale-95"
                            : "bg-white/10 hover:bg-white/20 border border-white/10 text-white/70"
                            }`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">First Name <span className="text-red-500">*</span></label>
                      <Input
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                        className={`bg-white/10 px-4 border-white/20 focus:border-orange-500 focus:ring-orange-500 h-11 sm:h-12 rounded-xl py-2 sm:py-3 text-white placeholder:text-white/30 transition-all text-sm ${formErrors.first_name ? "border-red-500/50 bg-red-500/5" : ""}`}
                      />
                      {formErrors.first_name && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.first_name}</p>}
                    </div>

                    <div className="group">
                      <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">Last Name <span className="text-red-500">*</span></label>
                      <Input
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                        className={`bg-white/10 px-4 border-white/20 focus:border-orange-500 focus:ring-orange-500 h-11 sm:h-12 rounded-xl py-2 sm:py-3 text-white placeholder:text-white/30 transition-all text-sm ${formErrors.last_name ? "border-red-500/50 bg-red-500/5" : ""}`}
                      />
                      {formErrors.last_name && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.last_name}</p>}
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">Email Address <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="example@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className={`bg-white/10 px-4 border-white/20 focus:border-orange-500 focus:ring-orange-500 h-11 sm:h-12 rounded-xl py-2 sm:py-3 text-white placeholder:text-white/30 transition-all text-sm ${formErrors.email ? "border-red-500/50 bg-red-500/5" : ""}`}
                    />
                    {formErrors.email && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.email}</p>}
                  </div>

                  <div className="group">
                    <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">Your contact number <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="Enter contact number"
                      value={formData.mobile}
                      maxLength={15}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length <= 15) { setFormData((prev) => ({ ...prev, mobile: val })); }
                      }}
                      className={`bg-white/10 px-4 border-white/20 focus:border-orange-500 focus:ring-orange-500 h-11 sm:h-12 rounded-xl py-2 sm:py-3 text-white placeholder:text-white/30 transition-all text-sm ${formErrors.mobile ? "border-red-500/50 bg-red-500/5" : ""}`}
                    />
                    {formErrors.mobile && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.mobile}</p>}
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full h-12 sm:h-14 gradient-btn text-white rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                  {/* Step 2 Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">Country <span className="text-red-500">*</span></label>
                      <Select
                        instanceId="list-property-country-select"
                        options={countryOptions}
                        value={countryOptions.find((opt: any) => opt.value === formData.country_id)}
                        styles={customSelectStyles}
                        onChange={(val) => setFormData((prev) => ({ ...prev, country_id: val?.value || "", region_id: "", city_id: "", }))}
                        isSearchable
                        placeholder="Select Country"
                        className="text-black"
                      />
                      {formErrors.country_id && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.country_id}</p>}
                    </div>

                    <div className="group">
                      <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">State <span className="text-red-500">*</span></label>
                      <Select
                        instanceId="list-property-state-select"
                        options={stateOptions}
                        value={stateOptions.find((opt: any) => opt.value === formData.region_id)}
                        styles={customSelectStyles}
                        onChange={(val) => setFormData((prev) => ({ ...prev, region_id: val?.value || "", city_id: "", }))}
                        placeholder="Select State"
                        isDisabled={!formData.country_id}
                        className="text-black"
                        isSearchable
                      />
                      {formErrors.region_id && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.region_id}</p>}
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">City <span className="text-red-500">*</span></label>
                    <Select
                      instanceId="list-property-city-select"
                      options={cityOptions}
                      value={cityOptions.find((opt: any) => opt.value === formData.city_id)}
                      styles={customSelectStyles}
                      onChange={(val) => setFormData((prev) => ({ ...prev, city_id: val?.value || "", }))}
                      placeholder="Select City"
                      isDisabled={!formData.region_id}
                      className="text-black"
                      isSearchable
                    />
                    {formErrors.city_id && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.city_id}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Input
                          placeholder="Create Password"
                          value={formData.password}
                          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                          type={showPassword ? "text" : "password"}
                          className={`bg-white/10 px-4 border-white/20 focus:border-orange-500 focus:ring-orange-500 rounded-xl h-11 sm:h-12 py-2 sm:py-3 text-white placeholder:text-white/30 pr-10 transition-all text-sm ${formErrors.password ? "border-red-500/50 bg-red-500/5" : ""}`}
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {formErrors.password && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.password}</p>}
                    </div>

                    <div className="group">
                      <label className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 ml-1 block">Confirm Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Input
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          type={showConfirmPassword ? "text" : "password"}
                          className={`bg-white/10 px-4 border-white/20 focus:border-orange-500 focus:ring-orange-500 rounded-xl h-11 sm:h-12 py-2 sm:py-3 text-white placeholder:text-white/30 pr-10 transition-all text-sm ${formErrors.confirmPassword ? "border-red-500/50 bg-red-500/5" : ""}`}
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && <p className="text-red-400 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.confirmPassword}</p>}
                    </div>
                  </div>

                  {/* ✅ UNIQUE ID FOR CAPTCHA TO PREVENT CONFLICTS */}
                  <div className="pt-2">
                    <div id="recaptcha-list-property" className="min-h-[78px] flex justify-center scale-[0.8] sm:scale-90 origin-center -my-2"></div>
                    {recaptchaLoading && (
                      <div className="flex items-center justify-center gap-2 text-white/70 text-[10px] mt-1">
                        <Loader2 className="animate-spin h-3 w-3" />
                        Validating...
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="flex-1 h-12 border border-white/20 hover:bg-white/10 rounded-full text-white font-semibold transition-all text-sm"
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" /> Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-[2] h-12 gradient-btn text-white rounded-full text-base font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
                      disabled={isPending || !recaptchaVerified}
                    >
                      {isPending ? <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Submitting...</> : "Submit Registration"}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 sm:mt-8 text-center bg-white/5 py-4 sm:py-5 rounded-2xl border border-white/10">
              <p className="text-white/60 text-[11px] sm:text-sm font-medium px-2">
                Already registered? <Link href="/login" className="text-orange-400 font-extrabold hover:underline inline-block sm:inline whitespace-nowrap">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ListPropertyHero
