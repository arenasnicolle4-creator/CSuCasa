import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Calendar,
  MapPin,
  Sparkles,
  Bath,
  Bed,
  Lightbulb,
  MessageSquare,
  Clock,
} from "lucide-react";
// ===== CONFIGURATION =====
// Google Places API Key - for address autocomplete
const GOOGLE_PLACES_API_KEY = "AIzaSyB18lv_Rulnv7jjFrM0PP57bCLO4U4_A_I";
export default function App() {
  const formTopRef = useRef(null);
  const addressInputRef = useRef(null);
  // Form state
  const [step, setStep] = useState(1);

  const mobileBarRef = useRef(null);
  const [mobileBarHeight, setMobileBarHeight] = useState(0);
  useEffect(() => {
    const el = mobileBarRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMobileBarHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // House Cleaning state
  const [squareFeetRange, setSquareFeetRange] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  // Airbnb Cleaning state
  const [airbnbSquareFeet, setAirbnbSquareFeet] = useState("");
  const [airbnbLaundry, setAirbnbLaundry] = useState("");
  const [airbnbBeds, setAirbnbBeds] = useState(0);
  const [airbnbUnits, setAirbnbUnits] = useState("");
  const [addOns, setAddOns] = useState({
      fridge: false,
      oven: false,
      microwave: false,
      deepClean: 0,
      linens: 0,
      dishes: false,
      windows: 0,
      pets: 0,
      baseTrimFeet: 0,
    });
const [keyAreas, setKeyAreas] = useState("");
const [additionalNotes, setAdditionalNotes] = useState("");
const [preferredDay1, setPreferredDay1] = useState("");
const [preferredDay2, setPreferredDay2] = useState("");
const [timeFrom, setTimeFrom] = useState("8:00 AM");
const [timeTo, setTimeTo] = useState("5:00 PM");
const [timeWindows, setTimeWindows] = useState([]);
// Load Google Places API and initialize autocomplete
useEffect(() => {
    // Only initialize when on step 2 and input is available
    if (step !== 2 || !addressInputRef.current) return;
    console.log("Initializing Google Places autocomplete...");
    const initializeAutocomplete = () => {
      if (!addressInputRef.current || !window.google || !window.google.maps) {
        console.log("Cannot initialize: missing requirements", {
            hasInput: !!addressInputRef.current,
            hasGoogle: !!window.google,
            hasMaps: !!(window.google && window.google.maps),
          });
      return;
    }
  console.log("Creating autocomplete instance...");
  const autocomplete = new window.google.maps.places.Autocomplete(
    addressInputRef.current,
    {
      types: ["address"],
      componentRestrictions: { country: "us" },
    }
);
autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    console.log("Place selected:", place);
    if (place.address_components) {
      let streetNumber = "";
      let route = "";
      let cityName = "";
      let stateName = "";
      let zipCode = "";
      // Parse address components
      place.address_components.forEach((component) => {
          const types = component.types;
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          }
        if (types.includes("route")) {
          route = component.long_name;
        }
      if (types.includes("locality")) {
        cityName = component.long_name;
      }
    if (types.includes("administrative_area_level_1")) {
      stateName = component.short_name;
    }
  if (types.includes("postal_code")) {
    zipCode = component.long_name;
  }
});
// Set the split address fields
setAddress(`${streetNumber} ${route}`.trim());
setCity(cityName);
setState(stateName);
setZip(zipCode);
} else if (place.formatted_address) {
// Fallback to formatted address
setAddress(place.formatted_address);
}
});
console.log("Autocomplete initialized successfully!");
};
// Load Google Places script if not already loaded
if (window.google && window.google.maps && window.google.maps.places) {
  console.log("Google Maps already loaded, initializing...");
  initializeAutocomplete();
} else {
console.log("Loading Google Maps script...");
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
script.async = true;
script.defer = true;
script.onload = () => {
  console.log("Google Maps script loaded!");
  initializeAutocomplete();
};
script.onerror = () => {
  console.error("Failed to load Google Maps script");
};
// Check if script already exists
const existingScript = document.querySelector(
  `script[src*="maps.googleapis.com"]`
);
if (!existingScript) {
  document.head.appendChild(script);
} else {
console.log("Script already exists, waiting for load...");
existingScript.onload = () => initializeAutocomplete();
}
}
}, [step]); // Re-run when step changes
// Pricing constants
const squareFeetOptions = [
  { range: "0-999", label: "< 1,000", icon: "🏠", price: 71 },
  { range: "1000-1499", label: "1,000-1,499", icon: "🏡", price: 89 },
  { range: "1500-1999", label: "1,500-1,999", icon: "🏘️", price: 124 },
  { range: "2000-2499", label: "2,000-2,499", icon: "🏚️", price: 144 },
  { range: "2500-2999", label: "2,500-2,999", icon: "🏛️", price: 164 },
  { range: "3000-3499", label: "3,000-3,499", icon: "🏰", price: 189 },
  { range: "3500-3999", label: "3,500-3,999", icon: "🏢", price: 214 },
  { range: "4000-4499", label: "4,000-4,499", icon: "🏬", price: 238 },
  { range: "4500-4999", label: "4,500-4,999", icon: "🏨", price: 259 },
  { range: "5000-5499", label: "5,000-5,499", icon: "🏩", price: 277 },
  { range: "5500-5999", label: "5,500-5,999", icon: "🏪", price: 300 },
  { range: "6000-6499", label: "6,000+", icon: "🏫", price: 323 },
];
const squareFeetPricing = {
  "0-999": 71,
  "1000-1499": 89,
  "1500-1999": 124,
  "2000-2499": 144,
  "2500-2999": 164,
  "3000-3499": 189,
  "3500-3999": 214,
  "4000-4499": 238,
  "4500-4999": 259,
  "5000-5499": 277,
  "5500-5999": 300,
  "6000-6499": 323,
};
const frequencyDiscounts = {
  "every-week": 0.2,
  "bi-weekly": 0.15,
  "every-3-weeks": 0.12,
  "every-4-weeks": 0.09,
  "one-time": 0,
};
// Calculate total price
const calculateSubtotal = () => {
  let total = 0;
  if (serviceType === "Airbnb Cleaning") {
    // Airbnb pricing
    if (airbnbSquareFeet && airbnbLaundry) {
      const pricePerSqFt = airbnbLaundry === "yes" ? 0.095 : 0.09;
      total += parseFloat(airbnbSquareFeet) * pricePerSqFt;
    }
  total += airbnbBeds * 18;
  const fullBaths = Math.floor(bathrooms);
  const hasHalfBath = bathrooms % 1 !== 0;
  total += fullBaths * 20;
  if (hasHalfBath) total += 13;
  // Only certain add-ons for Airbnb
  total += addOns.windows * 6;
  total += addOns.deepClean * 65;
  total += addOns.pets * 10;
  total += addOns.baseTrimFeet * 0.54;
} else {
// House Cleaning pricing
if (squareFeetRange && squareFeetPricing[squareFeetRange]) {
  total += squareFeetPricing[squareFeetRange];
}
total += bedrooms * 16;
const fullBaths = Math.floor(bathrooms);
const hasHalfBath = bathrooms % 1 !== 0;
total += fullBaths * 20;
if (hasHalfBath) total += 13;
if (addOns.fridge) total += 35;
if (addOns.oven) total += 50;
if (addOns.microwave) total += 10;
total += addOns.deepClean * 65;
total += addOns.linens * 10;
if (addOns.dishes) total += 20;
total += addOns.windows * 6;
total += addOns.pets * 10;
total += addOns.baseTrimFeet * 0.54;
}
return total;
};
const getDiscount = () => {
  if (serviceType === "Airbnb Cleaning") {
    const subtotal = calculateSubtotal();
    let discountPercent = 0;
    // Frequency discount
    if (frequency === "1-3") discountPercent += 0;
    else if (frequency === "4-6") discountPercent += 0.03;
    else if (frequency === "7-9") discountPercent += 0.06;
    else if (frequency === "10+") discountPercent += 0.075;
    // Units discount (added to frequency discount)
    if (airbnbUnits === "2") discountPercent += 0.03;
    else if (airbnbUnits === "3") discountPercent += 0.05;
    else if (airbnbUnits === "4+") discountPercent += 0.07;
    return subtotal * discountPercent;
  }
// House Cleaning discount
const subtotal = calculateSubtotal();
if (frequency && frequencyDiscounts[frequency] !== undefined) {
  return subtotal * frequencyDiscounts[frequency];
}
return 0;
};
const calculateTotal = () => {
  const total = calculateSubtotal() - getDiscount();
  // Minimum: $139.99 for Airbnb with no laundry, $154.99 for everything else
  const minimum =
  serviceType === "Airbnb Cleaning" && airbnbLaundry === "no"
  ? 139.99
  : 154.99;
  return Math.max(minimum, total);
};
// Get price breakdown for sidebar
const getPriceBreakdown = () => {
  const items = [];
  if (serviceType === "Airbnb Cleaning") {
    if (airbnbSquareFeet && airbnbLaundry) {
      const pricePerSqFt = airbnbLaundry === "yes" ? 0.095 : 0.09;
      const sqFtCost = parseFloat(airbnbSquareFeet) * pricePerSqFt;
      items.push({
          label: `${airbnbSquareFeet} sq ft ${
            airbnbLaundry === "yes" ? "(w/ laundry)" : "(no laundry)"
          }`,
        amount: sqFtCost,
      });
}
if (airbnbBeds > 0) {
  items.push({
      label: `${airbnbBeds} Bed${airbnbBeds > 1 ? "s" : ""}`,
      amount: airbnbBeds * 18,
    });
}
if (bathrooms > 0) {
  const fullBaths = Math.floor(bathrooms);
  const hasHalfBath = bathrooms % 1 !== 0;
  let bathCost = fullBaths * 20;
  if (hasHalfBath) bathCost += 13;
  items.push({
      label: `${bathrooms} Bathroom${bathrooms > 1 ? "s" : ""}`,
      amount: bathCost,
    });
}
if (addOns.windows > 0)
items.push({
    label: `${addOns.windows} Window${addOns.windows > 1 ? "s" : ""}`,
    amount: addOns.windows * 6,
  });
if (addOns.deepClean > 0)
items.push({
    label: `Deep Clean +${addOns.deepClean}hr`,
    amount: addOns.deepClean * 65,
  });
if (addOns.pets > 0)
items.push({
    label: `${addOns.pets} Pet${addOns.pets > 1 ? "s" : ""}`,
    amount: addOns.pets * 10,
  });
if (addOns.baseTrimFeet > 0)
items.push({
    label: `Base Trim (${addOns.baseTrimFeet} ft)`,
    amount: addOns.baseTrimFeet * 0.54,
  });
} else {
if (squareFeetRange && squareFeetPricing[squareFeetRange]) {
  const option = squareFeetOptions.find(
    (opt) => opt.range === squareFeetRange
  );
items.push({
    label: `${option.label} sq ft`,
    amount: squareFeetPricing[squareFeetRange],
  });
}
if (bedrooms > 0) {
  items.push({
      label: `${bedrooms} Bedroom${bedrooms > 1 ? "s" : ""}`,
      amount: bedrooms * 16,
    });
}
if (bathrooms > 0) {
  const fullBaths = Math.floor(bathrooms);
  const hasHalfBath = bathrooms % 1 !== 0;
  let bathCost = fullBaths * 20;
  if (hasHalfBath) bathCost += 13;
  items.push({
      label: `${bathrooms} Bathroom${bathrooms > 1 ? "s" : ""}`,
      amount: bathCost,
    });
}
if (addOns.fridge) items.push({ label: "Inside Fridge", amount: 35 });
if (addOns.oven) items.push({ label: "Inside Oven", amount: 50 });
if (addOns.microwave)
items.push({ label: "Inside Microwave", amount: 10 });
if (addOns.deepClean > 0)
items.push({
    label: `Deep Clean +${addOns.deepClean}hr`,
    amount: addOns.deepClean * 65,
  });
if (addOns.linens > 0)
items.push({
    label: `${addOns.linens} Linen Set${addOns.linens > 1 ? "s" : ""}`,
    amount: addOns.linens * 10,
  });
if (addOns.dishes) items.push({ label: "Clean Dishes", amount: 20 });
if (addOns.windows > 0)
items.push({
    label: `${addOns.windows} Window${addOns.windows > 1 ? "s" : ""}`,
    amount: addOns.windows * 6,
  });
if (addOns.pets > 0)
items.push({
    label: `${addOns.pets} Pet${addOns.pets > 1 ? "s" : ""}`,
    amount: addOns.pets * 10,
  });
if (addOns.baseTrimFeet > 0)
items.push({
    label: `Base Trim (${addOns.baseTrimFeet} ft)`,
    amount: addOns.baseTrimFeet * 0.54,
  });
}
return items;
};
const handleContinueToAddOns = () => {
  const isValid =
  serviceType === "Airbnb Cleaning"
  ? address &&
  serviceType &&
  frequency &&
  airbnbSquareFeet &&
  airbnbLaundry
  : address && serviceType && frequency && squareFeetRange;
  if (isValid) {
    setStep(3);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }, 100);
}
};
const handleSubmit = async () => {
  // Prepare form data for FormSubmit
  const formData = new FormData();
  
  // Add all form fields
  formData.append('_subject', 'NEW BOOKING REQUEST - Cleaning Su Casa');
  formData.append('First Name', firstName);
  formData.append('Last Name', lastName);
  formData.append('Phone', phone);
  formData.append('Email', email);
  formData.append('Street Address', address);
  formData.append('Apt/Suite/Unit', address2 || 'N/A');
  formData.append('City', city);
  formData.append('State', state);
  formData.append('ZIP', zip);
  formData.append('Service Type', serviceType);
  formData.append('Frequency', frequency);
  
  if (serviceType === "House Cleaning") {
    formData.append('Square Feet Range', squareFeetRange);
    formData.append('Bedrooms', bedrooms);
  } else {
    formData.append('Square Feet', airbnbSquareFeet);
    formData.append('Laundry', airbnbLaundry);
    formData.append('Beds', airbnbBeds);
    formData.append('Units', airbnbUnits);
  }
  
  formData.append('Bathrooms', bathrooms);
  
  // Add-ons
  const addOnsList = [];
  if (addOns.fridge) addOnsList.push('Inside Fridge');
  if (addOns.oven) addOnsList.push('Inside Oven');
  if (addOns.microwave) addOnsList.push('Inside Microwave');
  if (addOns.deepClean > 0) addOnsList.push(`Deep Clean +${addOns.deepClean}hr`);
  if (addOns.linens > 0) addOnsList.push(`${addOns.linens} Linen Set(s)`);
  if (addOns.dishes) addOnsList.push('Clean Dishes');
  if (addOns.windows > 0) addOnsList.push(`${addOns.windows} Window(s)`);
  if (addOns.pets > 0) addOnsList.push(`${addOns.pets} Pet(s)`);
  if (addOns.baseTrimFeet > 0) addOnsList.push(`Base Trim (${addOns.baseTrimFeet} ft)`);
  formData.append('Add-Ons', addOnsList.join(', ') || 'None');
  
  formData.append('Key Areas', keyAreas || 'None specified');
  formData.append('Additional Notes', additionalNotes || 'None');
  formData.append('Preferred Day 1', preferredDay1 || 'Not specified');
  formData.append('Preferred Day 2', preferredDay2 || 'Not specified');
  formData.append('Preferred Times', timeWindows.length ? timeWindows.join(', ') : 'Not specified');
  
  // Pricing
  formData.append('Subtotal', `$${calculateSubtotal().toFixed(2)}`);
  formData.append('Discount', `-$${getDiscount().toFixed(2)}`);
  formData.append('TOTAL PRICE', `$${calculateTotal().toFixed(2)}`);

  // FormSubmit requires these for AJAX submissions
  formData.append('_captcha', 'false'); // Disable captcha
  formData.append('_template', 'table'); // Use table format for email

  try {
    // Send to FormSubmit with proper headers
    const response = await fetch('https://formsubmit.co/ajax/AkCleaningSuCasa@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    const result = await response.json();
    
    if (result.success) {
      // Show success modal
      setShowSuccessModal(true);
    } else {
      alert('There was an error submitting your booking. Please try again or call us directly.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('There was an error submitting your booking. Please try again or call us directly.');
  }
};
return (
  <div
  ref={formTopRef}
  style={{
      minHeight: "100vh",
      backgroundColor: "#020c1f",
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),
        radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%),
        radial-gradient(circle at 55% 8%, rgba(93,235,241,0.06) 0%, transparent 30%),
        radial-gradient(ellipse at 5% 88%, rgba(5,53,116,0.4) 0%, transparent 40%),
        radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      paddingBottom: mobileBarHeight ? mobileBarHeight + 20 : undefined,
    }}
>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&family=Allura&display=swap');
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
.service-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}
.service-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}
.service-card.selected {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border: 2px solid #0ea5e9;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}
.counter-btn {
  transition: all 0.2s ease;
}
.counter-btn:active {
  transform: scale(0.9);
}
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}
input[type="date"] {
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
  max-width: 100%;
}
.price-breakdown-scroll::-webkit-scrollbar {
  width: 8px;
}
.price-breakdown-scroll::-webkit-scrollbar-track {
  background: #f0f9ff;
  border-radius: 10px;
}
.price-breakdown-scroll::-webkit-scrollbar-thumb {
  background: #0ea5e9;
  border-radius: 10px;
}
.price-breakdown-scroll::-webkit-scrollbar-thumb:hover {
  background: #0284c7;
}
.glow-text {
  color: white;
  text-shadow:
  0 0 10px rgba(255, 255, 255, 0.8),
  0 0 20px rgba(6, 182, 212, 0.6),
  0 0 30px rgba(6, 182, 212, 0.4),
  0 0 40px rgba(6, 182, 212, 0.2);
}

/* Mobile Styles */
@media (max-width: 768px) {
  /* Hide desktop price sidebar on mobile — use sticky bar instead */
  .desktop-sidebar {
    display: none !important;
  }
  
  /* Hide 100% Satisfaction badge on mobile */
  .satisfaction-badge {
    display: none !important;
  }
  
  /* Show mobile price sticky at bottom */
  .mobile-price-sticky {
    display: block !important;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1000 !important;
    width: 100vw !important;
  }
  
  /* Limit mobile price height so users can see more selections */
  .mobile-price-sticky > div {
    max-height: 37vh !important;
  }
  
  /* Make breakdown scrollable with smaller max height */
  .mobile-price-sticky .price-breakdown-items {
    max-height: 130px !important;
    overflow-y: auto !important;
  }
  
  /* Make main grid single column on mobile with bottom padding for sticky price */
  .mobile-responsive-grid {
    grid-template-columns: 1fr !important;
    
  }
  
  /* Service Type cards - keep 2 columns with better mobile styling */
  .service-grid-2col {
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
  }
  
  /* Service card text - ensure centered and wrap properly on mobile */
  .service-grid-2col .service-card {
    padding: 20px 10px !important;
    text-align: center !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .service-grid-2col .service-card > div:last-child {
    font-size: 14px !important;
    line-height: 1.3 !important;
    word-wrap: break-word !important;
  }
  
  /* City/State/ZIP - make full width on mobile */
  .address-3col {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  
  /* Turnovers per month - 2 columns on mobile instead of 4 */
  .turnovers-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
  }
  
  /* Square feet to 2 columns */
  .sqft-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
  }
  
  /* Add-ons to 2 columns on mobile for better fit */
  .addons-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
  }
  
  /* Time slots to single column */
  .time-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }
  
  /* Buttons stack vertically */
  .button-row {
    flex-direction: column !important;
  }
  
  .button-row button {
    width: 100% !important;
  }
}

/* Iframe embedding optimization - full width, no side gaps */
body {
  margin: 0 !important;
  padding: 0 !important;
}

/* Desktop - hide mobile price and ensure sticky works */
.mobile-price-sticky { display: none; }
@media (min-width: 769px) {
  .mobile-price-sticky {
    display: none !important;
  }
  
  /* Desktop iframe embedding - full width */
  .mobile-responsive-grid {
    max-width: 100% !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}

/* On larger screens in iframe, limit width but keep centered */
@media (min-width: 1440px) {
  .mobile-responsive-grid {
    max-width: 1400px !important;
    margin: 0 auto !important;
  }
}

/* Animated background elements */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.hero-orb-1 {
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(5,53,116,0.18) 0%, transparent 70%);
  animation: porb 7s ease-in-out infinite;
}

.hero-orb-2 {
  width: 320px;
  height: 320px;
  top: 8%;
  right: 5%;
  background: radial-gradient(circle, rgba(5,53,116,0.14) 0%, transparent 70%);
  animation: porb2 9s ease-in-out infinite reverse;
}

.hero-orb-3 {
  width: 220px;
  height: 220px;
  bottom: 12%;
  left: 5%;
  background: radial-gradient(circle, rgba(93,235,241,0.09) 0%, transparent 70%);
  animation: porb2 6s ease-in-out infinite;
}

@keyframes porb {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.12);
    opacity: 0.7;
  }
}

@keyframes porb2 {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.18);
    opacity: 0.6;
  }
}

.hero-rings {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.hero-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.dot-p {
  position: absolute;
  border-radius: 50%;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-22px); opacity: 1; }
}
`}</style>

{/* Animated Background Elements - Fixed Container */}
<div style={{
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 0
}}>
<div className="hero-orb hero-orb-1"></div>
<div className="hero-orb hero-orb-2"></div>
<div className="hero-orb hero-orb-3"></div>

<div className="hero-rings">
  <svg width="560" height="560" style={{position:"absolute",top:"-100px",left:"28%",opacity:0.5}} viewBox="0 0 560 560">
    <circle cx="280" cy="280" r="240" fill="none" stroke="rgba(93,235,241,0.5)" strokeWidth="1.8"/>
    <circle cx="280" cy="280" r="190" fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth="1.2"/>
    <circle cx="280" cy="280" r="140" fill="none" stroke="rgba(93,235,241,0.35)" strokeWidth="1.2"/>
    <circle cx="280" cy="280" r="90" fill="none" stroke="rgba(14,165,233,0.2)" strokeWidth="0.8"/>
  </svg>
  <svg width="300" height="300" style={{position:"absolute",bottom:"-60px",right:"4%",opacity:0.45}} viewBox="0 0 300 300">
    <circle cx="150" cy="150" r="125" fill="none" stroke="rgba(93,235,241,0.45)" strokeWidth="1.8"/>
    <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth="1.2"/>
  </svg>
</div>

<div className="hero-dots">
  <div className="dot-p" style={{width:"7px",height:"7px",left:"22%",bottom:"12%",animationDuration:"7s",animationDelay:"0s",background:"rgba(93,235,241,0.6)",boxShadow:"0 0 10px rgba(93,235,241,0.5)"}}></div>
  <div className="dot-p" style={{width:"5px",height:"5px",left:"48%",bottom:"18%",animationDuration:"9s",animationDelay:"1.5s",background:"rgba(14,165,233,0.5)",boxShadow:"0 0 8px rgba(14,165,233,0.5)"}}></div>
  <div className="dot-p" style={{width:"8px",height:"8px",left:"72%",bottom:"9%",animationDuration:"8s",animationDelay:"0.7s",background:"rgba(93,235,241,0.55)",boxShadow:"0 0 12px rgba(93,235,241,0.5)"}}></div>
  <div className="dot-p" style={{width:"6px",height:"6px",left:"33%",bottom:"22%",animationDuration:"10s",animationDelay:"2s",background:"rgba(14,165,233,0.45)",boxShadow:"0 0 10px rgba(14,165,233,0.4)"}}></div>
  <div className="dot-p" style={{width:"6px",height:"6px",left:"82%",bottom:"28%",animationDuration:"7.5s",animationDelay:"3s",background:"rgba(93,235,241,0.5)",boxShadow:"0 0 10px rgba(93,235,241,0.5)"}}></div>
</div>
</div>

<div
className="mobile-responsive-grid"
style={{
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px 20px",
    display: "grid",
    gridTemplateColumns: step === 1 ? "1fr" : "1fr 380px",
    gap: "30px",
    alignItems: "start",
    position: "relative",
    zIndex: 1,
  }}
>
{/* Main Form */}
<div
className="form-card-animated"
style={{
    backgroundColor: "#020c1f",
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),
      radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%),
      radial-gradient(circle at 55% 8%, rgba(93,235,241,0.06) 0%, transparent 30%),
      radial-gradient(ellipse at 5% 88%, rgba(5,53,116,0.4) 0%, transparent 40%),
      radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
    `,
    backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
    borderRadius: "32px",
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(93, 235, 241, 0.2)",
    position: "relative",
  }}
>
{/* Header with Custom Animated Title */}
<div
style={{
    backgroundColor: "rgba(2, 12, 31, 0.4)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(93, 235, 241, 0.2)",
    padding: step === 1 ? "50px 30px" : "30px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  }}
>
{/* Decorative rings inside header */}
<svg width="220" height="220" style={{position:"absolute",top:"-60px",left:"-40px",opacity:0.2,pointerEvents:"none"}} viewBox="0 0 220 220">
  <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(93,235,241,0.8)" strokeWidth="1.2"/>
  <circle cx="110" cy="110" r="70" fill="none" stroke="rgba(125,211,252,0.5)" strokeWidth="0.8"/>
</svg>
<svg width="180" height="180" style={{position:"absolute",bottom:"-50px",right:"-30px",opacity:0.2,pointerEvents:"none"}} viewBox="0 0 180 180">
  <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(93,235,241,0.8)" strokeWidth="1.2"/>
  <circle cx="90" cy="90" r="52" fill="none" stroke="rgba(125,211,252,0.5)" strokeWidth="0.8"/>
</svg>
{/* Floating dots */}
<div style={{position:"absolute",width:"5px",height:"5px",borderRadius:"50%",background:"rgba(125,211,252,0.7)",top:"20%",left:"12%",boxShadow:"0 0 6px rgba(93,235,241,0.6)",pointerEvents:"none"}}/>
<div style={{position:"absolute",width:"4px",height:"4px",borderRadius:"50%",background:"rgba(93,235,241,0.6)",top:"60%",left:"80%",boxShadow:"0 0 5px rgba(93,235,241,0.5)",pointerEvents:"none"}}/>
<div style={{position:"absolute",width:"3px",height:"3px",borderRadius:"50%",background:"rgba(125,211,252,0.5)",top:"75%",left:"25%",boxShadow:"0 0 4px rgba(93,235,241,0.4)",pointerEvents:"none"}}/>
<div style={{position:"absolute",width:"4px",height:"4px",borderRadius:"50%",background:"rgba(93,235,241,0.5)",top:"30%",left:"60%",boxShadow:"0 0 5px rgba(93,235,241,0.4)",pointerEvents:"none"}}/>
<div
style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
    "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  }}
/>
<div style={{ position: "relative", zIndex: 1 }}>
{/* Custom Title - Logo Style */}
<div
style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  }}
>
{/* CLEANING - Thin modern all caps */}
<div
className="glow-text"
style={{
    fontFamily: "'Oswald', sans-serif",
    fontSize: "52px",
    fontWeight: "300",
    letterSpacing: "8px",
    lineHeight: "1",
  }}
>
CLEANING
</div>
{/* Su Casa - Elegant handwritten cursive */}
<div
style={{
    fontFamily: "'Allura', cursive",
    fontSize: "56px",
    color: "#7dd3fc",
    letterSpacing: "3px",
    marginTop: "-8px",
    lineHeight: "1",
  }}
>
Su Casa
</div>
</div>
{step === 1 && (
    <>
    <div
    style={{
        marginTop: "20px",
        height: "3px",
        width: "80px",
        background:
        "linear-gradient(90deg, transparent, #06b6d4, transparent)",
        margin: "20px auto 15px",
      }}
  />
  <p
  style={{
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "16px",
      margin: 0,
      fontWeight: "500",
      letterSpacing: "1px",
      textTransform: "uppercase",
    }}
>
Premium Cleaning Services
</p>
</>
)}
</div>
</div>
{/* Progress Bar */}
<div
style={{
    height: "6px",
    background: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  }}
>
<div
style={{
    height: "100%",
    background: "linear-gradient(90deg, #06b6d4 0%, #0ea5e9 100%)",
    width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
    transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 15px rgba(6, 182, 212, 0.6)",
  }}
/>
</div>
<div style={{ padding: "50px 40px" }}>
{/* Step 1: Email */}
{step === 1 && (
    <div className="fade-in-up">
    <div style={{ textAlign: "center", marginBottom: "50px" }}>
    <div
    style={{
        width: "110px",
        height: "110px",
        background:
        "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 30px",
        boxShadow: "0 20px 50px rgba(6, 182, 212, 0.4)",
        border: "4px solid rgba(255, 255, 255, 0.2)",
      }}
  >
  <Sparkles size={55} color="white" strokeWidth={2.5} />
  </div>
  <h2
  style={{
      fontSize: "36px",
      fontWeight: "900",
      color: "white",
      margin: "0 0 20px 0",
      letterSpacing: "-1px",
      textTransform: "uppercase",
    }}
>
Let's Do This!
</h2>
<p
style={{
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "18px",
    lineHeight: "1.6",
    fontWeight: "500",
  }}
>
Drop your email & let's build your perfect clean
</p>
</div>
<div style={{ maxWidth: "500px", margin: "0 auto" }}>
{/* Name Fields */}
<div
style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "25px",
  }}
>
<div>
<label
style={{
    display: "block",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  }}
>
First Name
</label>
<input
type="text"
value={firstName}
onChange={(e) => setFirstName(e.target.value)}
placeholder="John"
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
</div>
<div>
<label
style={{
    display: "block",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  }}
>
Last Name
</label>
<input
type="text"
value={lastName}
onChange={(e) => setLastName(e.target.value)}
placeholder="Doe"
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
</div>
</div>
{/* Phone Field */}
<div style={{ marginBottom: "25px" }}>
<label
style={{
    display: "block",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  }}
>
Phone Number
</label>
<input
type="tel"
value={phone}
onChange={(e) => setPhone(e.target.value)}
placeholder="(555) 123-4567"
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
</div>
{/* Email Field */}
<div style={{ marginBottom: "40px" }}>
<label
style={{
    display: "block",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  }}
>
Email Address *
</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="your.email@example.com"
required
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
</div>
</div>
<button
onClick={() => {
  if (email) {
    setStep(2);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }
}}
disabled={!email}
style={{
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    margin: "0 auto",
    padding: "22px",
    background: email
    ? "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)"
    : "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "18px",
    fontWeight: "800",
    cursor: email ? "pointer" : "not-allowed",
    transition: "all 0.3s ease",
    boxShadow: email
    ? "0 15px 40px rgba(6, 182, 212, 0.4)"
    : "none",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }}
onMouseEnter={(e) => {
    if (email) {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow =
      "0 20px 50px rgba(6, 182, 212, 0.5)";
    }
}}
onMouseLeave={(e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = email
    ? "0 15px 40px rgba(6, 182, 212, 0.4)"
    : "none";
  }}
>
<span>To Service Details</span>
<span style={{ fontSize: "24px", marginLeft: "8px" }}>→</span>
</button>
</div>
)}
{/* Step 2: Service Selection - CONDITIONAL RENDERING */}
{step === 2 && (
    <div className="fade-in-up">
    <h2
    style={{
        fontSize: "32px",
        fontWeight: "900",
        color: "white",
        margin: "0 0 40px 0",
        letterSpacing: "-0.5px",
        textTransform: "uppercase",
      }}
  >
  Service Details
  </h2>
  {/* Address */}
  <div style={{ marginBottom: "35px" }}>
  <label
  style={{
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
      fontWeight: "800",
      color: "#06b6d4",
      marginBottom: "12px",
      gap: "8px",
      letterSpacing: "1px",
      textTransform: "uppercase",
    }}
>
<MapPin size={18} color="#06b6d4" />
Service Address *
</label>
{/* Street Address */}
<input
ref={addressInputRef}
type="text"
value={address}
onChange={(e) => setAddress(e.target.value)}
placeholder="Start typing your address..."
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
    marginBottom: "15px",
  }}
/>
{/* Address Line 2 */}
<input
type="text"
value={address2}
onChange={(e) => setAddress2(e.target.value)}
placeholder="Apt, Suite, Unit (optional)"
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
    marginBottom: "15px",
  }}
/>
{/* City, State, Zip */}
<div
className="address-3col"
style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px",
  }}
>
<input
type="text"
value={city}
onChange={(e) => setCity(e.target.value)}
placeholder="City"
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
<input
type="text"
value={state}
onChange={(e) => setState(e.target.value)}
placeholder="State"
maxLength="2"
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
    textTransform: "uppercase",
  }}
/>
<input
type="text"
value={zip}
onChange={(e) => setZip(e.target.value)}
placeholder="ZIP"
maxLength="5"
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
</div>
<p
style={{
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: "10px",
    marginBottom: 0,
    fontWeight: "600",
  }}
>
📍 Start typing street address for suggestions
</p>
</div>
{/* Service Type */}
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "15px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<Home size={18} color="#06b6d4" />
Service Type *
</label>
<div
className="service-grid-2col"
style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  }}
>
{["House Cleaning", "Airbnb Cleaning"].map((type) => (
      <div
      key={type}
      className={`service-card ${
          serviceType === type ? "selected" : ""
        }`}
    onClick={() => {
        setServiceType(type);
        setFrequency("");
        // Reset opposite type's fields
        if (type === "House Cleaning") {
          setAirbnbSquareFeet("");
          setAirbnbLaundry("");
          setAirbnbBeds(0);
        } else {
        setSquareFeetRange("");
        setBedrooms(0);
      }
  }}
style={{
    padding: "30px",
    border:
    serviceType === type
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    textAlign: "center",
    background:
    serviceType === type
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
  }}
>
<div
style={{
    fontSize: "52px",
    marginBottom: "15px",
  }}
>
{type === "House Cleaning" ? "🏠" : "🏡"}
</div>
<div
style={{
    fontSize: "17px",
    fontWeight: "800",
    color: serviceType === type ? "white" : "#0c4a6e",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }}
>
{type}
</div>
</div>
))}
</div>
</div>
{/* Frequency - Different styles based on service type */}
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<Calendar size={18} color="#06b6d4" />
{serviceType === "Airbnb Cleaning"
  ? "Turnovers Per Month *"
  : "Frequency *"}
</label>
{serviceType === "House Cleaning" ? (
    <select
    value={frequency}
    onChange={(e) => setFrequency(e.target.value)}
    style={{
        width: "100%",
        padding: "20px 24px",
        fontSize: "17px",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.95)",
        cursor: "pointer",
        boxSizing: "border-box",
        fontWeight: "600",
        color: "#0c4a6e",
      }}
  >
  <option value="">Select frequency...</option>
  <option value="every-week">
  Every Week (20% discount)
  </option>
  <option value="bi-weekly">
  Bi-Weekly (15% discount)
  </option>
  <option value="every-3-weeks">
  Every 3 Weeks (12% discount)
  </option>
  <option value="every-4-weeks">
  Every 4 Weeks (9% discount)
  </option>
  <option value="one-time">One-Time (no discount)</option>
  </select>
) : (
<div
className="turnovers-grid"
style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  }}
>
{[
    { value: "1-3", label: "1-3", discount: "" },
    { value: "4-6", label: "4-6", discount: "3% off" },
    { value: "7-9", label: "7-9", discount: "6% off" },
    { value: "10+", label: "10+", discount: "7.5% off" },
  ].map((option) => (
    <div
    key={option.value}
    className={`service-card ${
        frequency === option.value ? "selected" : ""
      }`}
  onClick={() => setFrequency(option.value)}
  style={{
      padding: "20px 15px",
      border:
      frequency === option.value
      ? "2px solid #0ea5e9"
      : "2px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "16px",
      textAlign: "center",
      background:
      frequency === option.value
      ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
      : "rgba(255, 255, 255, 0.95)",
      cursor: "pointer",
    }}
>
<div
style={{
    fontSize: "22px",
    fontWeight: "900",
    color:
    frequency === option.value
    ? "white"
    : "#0c4a6e",
    marginBottom: "8px",
  }}
>
{option.label}
</div>
{option.discount && (
    <div
    style={{
        fontSize: "11px",
        fontWeight: "700",
        color:
        frequency === option.value
        ? "rgba(255,255,255,0.9)"
        : "#10b981",
      }}
  >
  {option.discount}
  </div>
)}
</div>
))}
</div>
)}
</div>
{/* Airbnb Units Selection */}
{serviceType === "Airbnb Cleaning" && (
    <div style={{ marginBottom: "35px" }}>
    <label
    style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "12px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}
  >
  <Home size={18} color="#06b6d4" />
  Number of Units
  </label>
  <div
  style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "15px",
    }}
>
{[
    { value: "1", label: "1 Unit", discount: "" },
    { value: "2", label: "2 Units", discount: "3% off" },
    { value: "3", label: "3 Units", discount: "5% off" },
    { value: "4+", label: "4+ Units", discount: "7% off" },
  ].map((option) => (
    <div
    key={option.value}
    className={`service-card ${
        airbnbUnits === option.value ? "selected" : ""
      }`}
  onClick={() => setAirbnbUnits(option.value)}
  style={{
      padding: "20px 15px",
      border:
      airbnbUnits === option.value
      ? "2px solid #0ea5e9"
      : "2px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "16px",
      textAlign: "center",
      background:
      airbnbUnits === option.value
      ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
      : "rgba(255, 255, 255, 0.95)",
      cursor: "pointer",
    }}
>
<div
style={{
    fontSize: "14px",
    fontWeight: "800",
    color:
    airbnbUnits === option.value
    ? "white"
    : "#0c4a6e",
    marginBottom: option.discount ? "6px" : "0",
    lineHeight: "1.3",
  }}
>
{option.label}
</div>
{option.discount && (
    <div
    style={{
        fontSize: "11px",
        fontWeight: "700",
        color:
        airbnbUnits === option.value
        ? "rgba(255,255,255,0.9)"
        : "#10b981",
      }}
  >
  {option.discount}
  </div>
)}
</div>
))}
</div>
</div>
)}
{/* HOUSE CLEANING FIELDS */}
{serviceType === "House Cleaning" && (
    <>
    {/* Square Feet - Card Grid */}
    <div style={{ marginBottom: "35px" }}>
    <label
    style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}
  >
  <span>📐</span>
  Home Size *
  </label>
  <div
  style={{
      display: "grid",
      gridTemplateColumns:
      "repeat(auto-fill, minmax(140px, 1fr))",
      gap: "15px",
    }}
>
{squareFeetOptions.map((option) => (
      <div
      key={option.range}
      className={`service-card ${
          squareFeetRange === option.range ? "selected" : ""
        }`}
    onClick={() => setSquareFeetRange(option.range)}
    style={{
        padding: "22px 15px",
        border:
        squareFeetRange === option.range
        ? "2px solid #0ea5e9"
        : "2px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "18px",
        textAlign: "center",
        background:
        squareFeetRange === option.range
        ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
        : "rgba(255, 255, 255, 0.95)",
      }}
  >
  <div
  style={{ fontSize: "36px", marginBottom: "10px" }}
  >
  {option.icon}
  </div>
  <div
  style={{
      fontSize: "13px",
      fontWeight: "800",
      color:
      squareFeetRange === option.range
      ? "white"
      : "#0c4a6e",
      lineHeight: "1.3",
      letterSpacing: "0.3px",
    }}
>
{option.label}
</div>
</div>
))}
</div>
</div>
{/* Bedrooms */}
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "15px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<Bed size={18} color="#06b6d4" />
Bedrooms
</label>
<div
style={{
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "28px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
  }}
>
<div style={{ fontSize: "44px" }}>🛏️</div>
<button
className="counter-btn"
onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
style={{
    width: "52px",
    height: "52px",
    background: "white",
    border: "3px solid #0284c7",
    borderRadius: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#0284c7",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)",
  }}
>
−
</button>
<div
style={{
    flex: 1,
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "900",
    color: "#0c4a6e",
  }}
>
{bedrooms}
</div>
<button
className="counter-btn"
onClick={() => setBedrooms(bedrooms + 1)}
style={{
    width: "52px",
    height: "52px",
    background:
    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    border: "none",
    borderRadius: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 16px rgba(14, 165, 233, 0.3)",
  }}
>
+
</button>
</div>
</div>
</>
)}
{/* AIRBNB CLEANING FIELDS */}
{serviceType === "Airbnb Cleaning" && (
    <>
    {/* Laundry Selection */}
    <div style={{ marginBottom: "35px" }}>
    <label
    style={{
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "800",
        color: "#06b6d4",
        marginBottom: "15px",
        gap: "8px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}
  >
  <Sparkles size={18} color="#06b6d4" />
  Laundry Service *
  </label>
  <div
  style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    }}
>
{[
    { value: "yes", label: "With Laundry" },
    { value: "no", label: "No Laundry" },
  ].map((option) => (
    <div
    key={option.value}
    className={`service-card ${
        airbnbLaundry === option.value ? "selected" : ""
      }`}
  onClick={() => setAirbnbLaundry(option.value)}
  style={{
      padding: "25px",
      border:
      airbnbLaundry === option.value
      ? "2px solid #0ea5e9"
      : "2px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "20px",
      textAlign: "center",
      background:
      airbnbLaundry === option.value
      ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
      : "rgba(255, 255, 255, 0.95)",
    }}
>
<div
style={{
    fontSize: "16px",
    fontWeight: "800",
    color:
    airbnbLaundry === option.value
    ? "white"
    : "#0c4a6e",
    letterSpacing: "0.5px",
  }}
>
{option.label}
</div>
</div>
))}
</div>
</div>
{/* Square Footage Input */}
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<span>📐</span>
Square Footage *
</label>
<input
type="number"
value={airbnbSquareFeet}
onChange={(e) => setAirbnbSquareFeet(e.target.value)}
placeholder="Enter square footage"
disabled={!airbnbLaundry}
style={{
    width: "100%",
    padding: "20px 24px",
    fontSize: "17px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    boxSizing: "border-box",
    background: airbnbLaundry
    ? "rgba(255, 255, 255, 0.95)"
    : "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
    cursor: airbnbLaundry ? "text" : "not-allowed",
    opacity: airbnbLaundry ? 1 : 0.6,
  }}
/>
{!airbnbLaundry && (
    <p
    style={{
        fontSize: "13px",
        color: "rgba(255, 255, 255, 0.7)",
        marginTop: "10px",
        marginBottom: 0,
        fontWeight: "600",
      }}
  >
  💡 Please select laundry service first
  </p>
)}
</div>
{/* Beds (not Bedrooms) */}
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "15px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<Bed size={18} color="#06b6d4" />
Beds
</label>
<div
style={{
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "28px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
  }}
>
<div style={{ fontSize: "44px" }}>🛏️</div>
<button
className="counter-btn"
onClick={() =>
  setAirbnbBeds(Math.max(0, airbnbBeds - 1))
}
style={{
    width: "52px",
    height: "52px",
    background: "white",
    border: "3px solid #0284c7",
    borderRadius: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#0284c7",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)",
  }}
>
−
</button>
<div
style={{
    flex: 1,
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "900",
    color: "#0c4a6e",
  }}
>
{airbnbBeds}
</div>
<button
className="counter-btn"
onClick={() => setAirbnbBeds(airbnbBeds + 1)}
style={{
    width: "52px",
    height: "52px",
    background:
    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    border: "none",
    borderRadius: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 16px rgba(14, 165, 233, 0.3)",
  }}
>
+
</button>
</div>
</div>
</>
)}
{/* Bathrooms - SHARED BY BOTH */}
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "15px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<Bath size={18} color="#06b6d4" />
Bathrooms
</label>
<div
style={{
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "28px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
  }}
>
<div style={{ fontSize: "44px" }}>🚿</div>
<button
className="counter-btn"
onClick={() => setBathrooms(Math.max(0, bathrooms - 0.5))}
style={{
    width: "52px",
    height: "52px",
    background: "white",
    border: "3px solid #0284c7",
    borderRadius: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#0284c7",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)",
  }}
>
−
</button>
<div
style={{
    flex: 1,
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "900",
    color: "#0c4a6e",
  }}
>
{bathrooms}
</div>
<button
className="counter-btn"
onClick={() => setBathrooms(bathrooms + 0.5)}
style={{
    width: "52px",
    height: "52px",
    background:
    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    border: "none",
    borderRadius: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 16px rgba(14, 165, 233, 0.3)",
  }}
>
+
</button>
</div>
<p
style={{
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: "12px",
    marginBottom: 0,
    textAlign: "center",
    fontWeight: "600",
  }}
>
💡 Click + once for half bath, twice for full
</p>
</div>
<div
style={{ display: "flex", gap: "15px", marginTop: "40px" }}
>
<button
onClick={() => {
  setStep(1);
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 100);
}}
style={{
    flex: 1,
    padding: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    color: "#0284c7",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }}
>
← Back
</button>
<button
onClick={handleContinueToAddOns}
disabled={
  !address ||
  !serviceType ||
  !frequency ||
  (serviceType === "House Cleaning"
    ? !squareFeetRange
    : !airbnbSquareFeet || !airbnbLaundry)
}
style={{
    flex: 2,
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    background:
    address &&
    serviceType &&
    frequency &&
    (serviceType === "House Cleaning"
      ? squareFeetRange
      : airbnbSquareFeet && airbnbLaundry)
    ? "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)"
    : "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "18px",
    fontWeight: "800",
    cursor:
    address &&
    serviceType &&
    frequency &&
    (serviceType === "House Cleaning"
      ? squareFeetRange
      : airbnbSquareFeet && airbnbLaundry)
    ? "pointer"
    : "not-allowed",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }}
>
<span>To Add-Ons</span>
<span style={{ fontSize: "24px", marginLeft: "8px" }}>
→
</span>
</button>
</div>
</div>
)}
{/* Step 3: Add-ons and Scheduling - CONDITIONAL */}
{step === 3 && (
    <div className="fade-in-up">
    <h2
    style={{
        fontSize: "32px",
        fontWeight: "900",
        color: "white",
        margin: "0 0 40px 0",
        letterSpacing: "-0.5px",
        textTransform: "uppercase",
      }}
  >
  Customize Your Clean
  </h2>
  {/* Note for Airbnb customers */}
  {serviceType === "Airbnb Cleaning" && (
      <div
      style={{
          padding: "20px",
          background: "rgba(6, 182, 212, 0.15)",
          borderRadius: "16px",
          marginBottom: "30px",
          border: "2px solid rgba(6, 182, 212, 0.3)",
        }}
    >
    <p
    style={{
        color: "white",
        fontSize: "14px",
        margin: 0,
        fontWeight: "600",
        lineHeight: "1.6",
      }}
  >
  💡 Your base price covers kitchen and appliances, dishes,
  & linens for every turnover. The options below are for
  additional services as needed.
  </p>
  </div>
)}
{/* Add-ons Grid - CONDITIONAL BASED ON SERVICE TYPE */}
<div
className="addons-grid"
style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "15px",
    marginBottom: "35px",
  }}
>
{/* House Cleaning Add-ons */}
{serviceType === "House Cleaning" && (
    <>
    <div
    onClick={() =>
      setAddOns({ ...addOns, fridge: !addOns.fridge })
    }
  className="service-card"
  style={{
      padding: "28px 20px",
      border: addOns.fridge
      ? "2px solid #0ea5e9"
      : "2px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "20px",
      cursor: "pointer",
      background: addOns.fridge
      ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
      : "rgba(255, 255, 255, 0.95)",
      textAlign: "center",
    }}
>
<div style={{ fontSize: "44px", marginBottom: "12px" }}>
🧊
</div>
<div
style={{
    fontSize: "14px",
    fontWeight: "800",
    color: addOns.fridge ? "white" : "#0c4a6e",
    lineHeight: "1.3",
    letterSpacing: "0.3px",
  }}
>
Inside Fridge
</div>
</div>
<div
onClick={() =>
  setAddOns({ ...addOns, oven: !addOns.oven })
}
className="service-card"
style={{
    padding: "28px 20px",
    border: addOns.oven
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    cursor: "pointer",
    background: addOns.oven
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
  }}
>
<div style={{ fontSize: "44px", marginBottom: "12px" }}>
🔥
</div>
<div
style={{
    fontSize: "14px",
    fontWeight: "800",
    color: addOns.oven ? "white" : "#0c4a6e",
    lineHeight: "1.3",
    letterSpacing: "0.3px",
  }}
>
Inside Oven
</div>
</div>
<div
onClick={() =>
  setAddOns({ ...addOns, microwave: !addOns.microwave })
}
className="service-card"
style={{
    padding: "28px 20px",
    border: addOns.microwave
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    cursor: "pointer",
    background: addOns.microwave
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
  }}
>
<div style={{ fontSize: "44px", marginBottom: "12px" }}>
📻
</div>
<div
style={{
    fontSize: "14px",
    fontWeight: "800",
    color: addOns.microwave ? "white" : "#0c4a6e",
    lineHeight: "1.3",
    letterSpacing: "0.3px",
  }}
>
Microwave
</div>
</div>
<div
className="service-card"
style={{
    padding: "20px 15px",
    border:
    addOns.linens > 0
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    background:
    addOns.linens > 0
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  }}
>
<div style={{ fontSize: "36px" }}>🛏️</div>
<div
style={{
    fontSize: "13px",
    fontWeight: "800",
    color: addOns.linens > 0 ? "white" : "#0c4a6e",
    lineHeight: "1.2",
    letterSpacing: "0.3px",
  }}
>
Linens
</div>
<div
style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
<button
onClick={() =>
  setAddOns({
      ...addOns,
      linens: Math.max(0, addOns.linens - 1),
    })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.linens > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "white",
    border:
    addOns.linens > 0
    ? "none"
    : "2px solid #0284c7",
    borderRadius: "8px",
    fontSize: "18px",
    color: addOns.linens > 0 ? "white" : "#0284c7",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
−
</button>
<div
style={{
    fontSize: "20px",
    fontWeight: "900",
    color: addOns.linens > 0 ? "white" : "#0c4a6e",
    minWidth: "24px",
    textAlign: "center",
  }}
>
{addOns.linens}
</div>
<button
onClick={() =>
  setAddOns({
      ...addOns,
      linens: addOns.linens + 1,
    })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.linens > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    color: "white",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
+
</button>
</div>
</div>
<div
onClick={() =>
  setAddOns({ ...addOns, dishes: !addOns.dishes })
}
className="service-card"
style={{
    padding: "28px 20px",
    border: addOns.dishes
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    cursor: "pointer",
    background: addOns.dishes
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
  }}
>
<div style={{ fontSize: "44px", marginBottom: "12px" }}>
🍽️
</div>
<div
style={{
    fontSize: "14px",
    fontWeight: "800",
    color: addOns.dishes ? "white" : "#0c4a6e",
    lineHeight: "1.3",
    letterSpacing: "0.3px",
  }}
>
Clean Dishes
</div>
</div>
</>
)}
{/* SHARED Add-ons for both */}
<div
className="service-card"
style={{
    padding: "20px 15px",
    border:
    addOns.deepClean > 0
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    background:
    addOns.deepClean > 0
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  }}
>
<div style={{ fontSize: "36px" }}>✨</div>
<div
style={{
    fontSize: "13px",
    fontWeight: "800",
    color: addOns.deepClean > 0 ? "white" : "#0c4a6e",
    lineHeight: "1.2",
    letterSpacing: "0.3px",
  }}
>
Deep Clean +1hr
</div>
<div
style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
<button
onClick={() =>
  setAddOns({
      ...addOns,
      deepClean: Math.max(0, addOns.deepClean - 1),
    })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.deepClean > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "white",
    border:
    addOns.deepClean > 0 ? "none" : "2px solid #0284c7",
    borderRadius: "8px",
    fontSize: "18px",
    color: addOns.deepClean > 0 ? "white" : "#0284c7",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
−
</button>
<div
style={{
    fontSize: "20px",
    fontWeight: "900",
    color: addOns.deepClean > 0 ? "white" : "#0c4a6e",
    minWidth: "24px",
    textAlign: "center",
  }}
>
{addOns.deepClean}
</div>
<button
onClick={() =>
  setAddOns({
      ...addOns,
      deepClean: addOns.deepClean + 1,
    })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.deepClean > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    color: "white",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
+
</button>
</div>
</div>
<div
className="service-card"
style={{
    padding: "20px 15px",
    border:
    addOns.windows > 0
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    background:
    addOns.windows > 0
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  }}
>
<div style={{ fontSize: "36px" }}>🪟</div>
<div
style={{
    fontSize: "13px",
    fontWeight: "800",
    color: addOns.windows > 0 ? "white" : "#0c4a6e",
    lineHeight: "1.2",
    letterSpacing: "0.3px",
  }}
>
Windows
</div>
<div
style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
<button
onClick={() =>
  setAddOns({
      ...addOns,
      windows: Math.max(0, addOns.windows - 1),
    })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.windows > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "white",
    border:
    addOns.windows > 0 ? "none" : "2px solid #0284c7",
    borderRadius: "8px",
    fontSize: "18px",
    color: addOns.windows > 0 ? "white" : "#0284c7",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
−
</button>
<div
style={{
    fontSize: "20px",
    fontWeight: "900",
    color: addOns.windows > 0 ? "white" : "#0c4a6e",
    minWidth: "24px",
    textAlign: "center",
  }}
>
{addOns.windows}
</div>
<button
onClick={() =>
  setAddOns({ ...addOns, windows: addOns.windows + 1 })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.windows > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    color: "white",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
+
</button>
</div>
</div>
<div
className="service-card"
style={{
    padding: "20px 15px",
    border:
    addOns.pets > 0
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    background:
    addOns.pets > 0
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  }}
>
<div style={{ fontSize: "36px" }}>🐾</div>
<div
style={{
    fontSize: "13px",
    fontWeight: "800",
    color: addOns.pets > 0 ? "white" : "#0c4a6e",
    lineHeight: "1.2",
    letterSpacing: "0.3px",
  }}
>
Pets
</div>
<div
style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
<button
onClick={() =>
  setAddOns({
      ...addOns,
      pets: Math.max(0, addOns.pets - 1),
    })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.pets > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "white",
    border:
    addOns.pets > 0 ? "none" : "2px solid #0284c7",
    borderRadius: "8px",
    fontSize: "18px",
    color: addOns.pets > 0 ? "white" : "#0284c7",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
−
</button>
<div
style={{
    fontSize: "20px",
    fontWeight: "900",
    color: addOns.pets > 0 ? "white" : "#0c4a6e",
    minWidth: "24px",
    textAlign: "center",
  }}
>
{addOns.pets}
</div>
<button
onClick={() =>
  setAddOns({ ...addOns, pets: addOns.pets + 1 })
}
className="counter-btn"
style={{
    width: "32px",
    height: "32px",
    background:
    addOns.pets > 0
    ? "rgba(255, 255, 255, 0.3)"
    : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    color: "white",
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
+
</button>
</div>
</div>
<div
className="service-card"
style={{
    padding: "20px",
    border:
    addOns.baseTrimFeet > 0
    ? "2px solid #0ea5e9"
    : "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    background:
    addOns.baseTrimFeet > 0
    ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
    : "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  }}
>
<div style={{ fontSize: "36px" }}>📏</div>
<div
style={{
    fontSize: "13px",
    fontWeight: "800",
    color: addOns.baseTrimFeet > 0 ? "white" : "#0c4a6e",
    lineHeight: "1.2",
    letterSpacing: "0.3px",
  }}
>
Base Trim
</div>
<input
type="number"
value={addOns.baseTrimFeet || ""}
onChange={(e) =>
  setAddOns({
      ...addOns,
      baseTrimFeet: Math.max(
        0,
        parseFloat(e.target.value) || 0
      ),
  })
}
placeholder="Enter feet"
style={{
    width: "90px",
    padding: "8px",
    fontSize: "14px",
    border: "2px solid rgba(12, 74, 110, 0.2)",
    borderRadius: "8px",
    boxSizing: "border-box",
    background: "white",
    fontWeight: "600",
    color: "#0c4a6e",
    textAlign: "center",
  }}
/>
<div
style={{
    fontSize: "11px",
    fontWeight: "700",
    color:
    addOns.baseTrimFeet > 0
    ? "rgba(255,255,255,0.8)"
    : "#64748b",
    letterSpacing: "0.5px",
  }}
>
Linear Ft
</div>
</div>
</div>
{/* Rest of Step 3 fields... */}
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<Lightbulb size={18} color="#06b6d4" />
Special Attention Areas
</label>
<textarea
value={keyAreas}
onChange={(e) => setKeyAreas(e.target.value)}
placeholder="Kitchen counters, master bathroom..."
rows={3}
style={{
    width: "100%",
    padding: "18px 22px",
    fontSize: "16px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
</div>
<div style={{ marginBottom: "35px" }}>
<label
style={{
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#06b6d4",
    marginBottom: "12px",
    gap: "8px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
<MessageSquare size={18} color="#06b6d4" />
Additional Requests
</label>
<textarea
value={additionalNotes}
onChange={(e) => setAdditionalNotes(e.target.value)}
placeholder="Any other details we should know..."
rows={3}
style={{
    width: "100%",
    padding: "18px 22px",
    fontSize: "16px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
  }}
/>
</div>
<div style={{ marginBottom: "35px" }}>
<label style={{ display:"flex", alignItems:"center", fontSize:"13px", fontWeight:"800", color:"#06b6d4", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
  <Calendar size={18} color="#06b6d4" />
  Preferred Start Date(s)
</label>
<p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:"600", marginTop:"-10px", marginBottom:"16px" }}>Select your first choice and a backup date.</p>
<div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"15px", maxWidth:"100%", overflow:"hidden" }}>
  <div>
    <label style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginBottom:"8px", display:"block", fontWeight:"700" }}>First Choice</label>
    <input
      type="date"
      value={preferredDay1}
      onChange={(e) => setPreferredDay1(e.target.value)}
      style={{ width:"100%", maxWidth:"100%", padding:"16px 14px", fontSize:"16px", border:"2px solid rgba(255,255,255,0.2)", borderRadius:"14px", background:"rgba(255,255,255,0.95)", cursor:"pointer", boxSizing:"border-box", fontWeight:"600", color:"#0c4a6e", display:"block" }}
    />
  </div>
  <div>
    <label style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginBottom:"8px", display:"block", fontWeight:"700" }}>Second Choice</label>
    <input
      type="date"
      value={preferredDay2}
      onChange={(e) => setPreferredDay2(e.target.value)}
      style={{ width:"100%", maxWidth:"100%", padding:"16px 14px", fontSize:"16px", border:"2px solid rgba(255,255,255,0.2)", borderRadius:"14px", background:"rgba(255,255,255,0.95)", cursor:"pointer", boxSizing:"border-box", fontWeight:"600", color:"#0c4a6e", display:"block" }}
    />
  </div>
</div>
</div>

<div style={{ marginBottom: "40px" }}>
<label style={{ display:"flex", alignItems:"center", fontSize:"13px", fontWeight:"800", color:"#06b6d4", marginBottom:"15px", gap:"8px", letterSpacing:"1px", textTransform:"uppercase" }}>
  <Clock size={18} color="#06b6d4" />
  Preferred Service Times
</label>
<p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:"600", marginTop:"-10px", marginBottom:"16px" }}>Add one or more time windows when cleaning is welcome.</p>
{/* From / To row */}
<div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"12px", flexWrap:"wrap" }}>
  <div style={{ flex:1, minWidth:"120px" }}>
    <label style={{ fontSize:"11px", fontWeight:"700", color:"rgba(255,255,255,0.6)", letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>From</label>
    <select value={timeFrom} onChange={e=>setTimeFrom(e.target.value)} style={{ width:"100%", padding:"14px 16px", borderRadius:"12px", border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.95)", color:"#0c4a6e", fontSize:"16px", fontWeight:"600", outline:"none", boxSizing:"border-box" }}>
      {["12:00 AM","12:30 AM","1:00 AM","1:30 AM","2:00 AM","2:30 AM","3:00 AM","3:30 AM","4:00 AM","4:30 AM","5:00 AM","5:30 AM","6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM"].map(t=><option key={t} value={t}>{t}</option>)}
    </select>
  </div>
  <div style={{ paddingTop:"22px", color:"rgba(255,255,255,0.7)", fontWeight:"800", fontSize:"14px" }}>to</div>
  <div style={{ flex:1, minWidth:"120px" }}>
    <label style={{ fontSize:"11px", fontWeight:"700", color:"rgba(255,255,255,0.6)", letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>To</label>
    <select value={timeTo} onChange={e=>setTimeTo(e.target.value)} style={{ width:"100%", padding:"14px 16px", borderRadius:"12px", border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.95)", color:"#0c4a6e", fontSize:"16px", fontWeight:"600", outline:"none", boxSizing:"border-box" }}>
      {["12:00 AM","12:30 AM","1:00 AM","1:30 AM","2:00 AM","2:30 AM","3:00 AM","3:30 AM","4:00 AM","4:30 AM","5:00 AM","5:30 AM","6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM"].map(t=><option key={t} value={t}>{t}</option>)}
    </select>
  </div>
  <div style={{ paddingTop:"22px" }}>
    <button onClick={()=>{ const w=`${timeFrom} – ${timeTo}`; if(!timeWindows.includes(w)) setTimeWindows([...timeWindows,w]); }} style={{ padding:"14px 20px", borderRadius:"12px", border:"2px solid rgba(14,165,233,0.6)", background:"linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", color:"white", fontSize:"14px", fontWeight:"800", cursor:"pointer", whiteSpace:"nowrap" }}>+ Add</button>
  </div>
</div>
{/* Added windows */}
{timeWindows.length>0&&(
  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
    {timeWindows.map((w,i)=>(
      <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"10px 16px", borderRadius:"20px", background:"rgba(14,165,233,0.15)", border:"1.5px solid rgba(93,235,241,0.4)" }}>
        <span style={{ fontSize:"13px", fontWeight:"700", color:"white" }}>{w}</span>
        <button onClick={()=>setTimeWindows(timeWindows.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", cursor:"pointer", color:"#06b6d4", fontSize:"16px", fontWeight:"900", lineHeight:"1", padding:"0" }}>×</button>
      </div>
    ))}
  </div>
)}
</div>
<div style={{ display: "flex", gap: "15px" }}>
<button
onClick={() => {
  setStep(2);
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 100);
}}
style={{
    flex: 1,
    padding: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    color: "#0284c7",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }}
>
← Back
</button>
<button
onClick={handleSubmit}
style={{
    flex: 2,
    padding: "20px",
    background:
    "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "18px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 15px 40px rgba(6, 182, 212, 0.4)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }}
>
Book Your Clean! 🎉
</button>
</div>
</div>
)}
</div>
{/* Footer */}
<div
style={{
    padding: "28px 40px",
    background: "rgba(12, 74, 110, 0.8)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center",
  }}
>
<p
style={{
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    margin: "0 0 10px 0",
    fontWeight: "600",
  }}
>
Questions? Email{" "}
<a
href="mailto:AkCleaningSuCasa@gmail.com"
style={{
    color: "#06b6d4",
    fontWeight: "800",
    textDecoration: "none",
  }}
>
AkCleaningSuCasa@gmail.com
</a>
</p>
<p
style={{
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "12px",
    margin: 0,
    fontWeight: "600",
  }}
>
By booking, you agree to our{" "}
<a
href="https://img1.wsimg.com/blobby/go/a218c663-7c40-48f5-aae1-0c7e30c1037f/downloads/Terms%20and%20Conditions.pdf?ver=1721081910935"
target="_blank"
rel="noopener noreferrer"
style={{
    color: "#06b6d4",
    fontWeight: "800",
    textDecoration: "underline",
  }}
>
Terms & Conditions
</a>
</p>
</div>
</div>
{/* Price Sidebar */}
{(step === 2 || step === 3) && (
    <div
    className="fade-in-up desktop-sidebar"
    style={{
        position: "sticky",
        top: "20px",
        height: "fit-content",
        maxHeight: "calc(100vh - 40px)",
        display: "flex",
        flexDirection: "column",
      }}
  >
  <div
  style={{
      backgroundColor: "#020c1f",
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),
        radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%),
        radial-gradient(circle at 55% 8%, rgba(93,235,241,0.06) 0%, transparent 30%),
        radial-gradient(ellipse at 5% 88%, rgba(5,53,116,0.4) 0%, transparent 40%),
        radial-gradient(circle 1px at center, rgba(255,255,255,0.07) 0%, transparent 100%)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 26px 26px",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow: "0 25px 70px rgba(0, 0, 0, 0.6)",
      border: "1px solid rgba(93, 235, 241, 0.2)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "100%",
    }}
>
<div
style={{
    padding: "25px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  }}
>
{/* Decorative rings inside sidebar header */}
<svg width="160" height="160" style={{position:"absolute",top:"-40px",right:"-30px",opacity:0.2,pointerEvents:"none"}} viewBox="0 0 160 160">
  <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(93,235,241,0.8)" strokeWidth="1.2"/>
  <circle cx="80" cy="80" r="52" fill="none" stroke="rgba(125,211,252,0.5)" strokeWidth="0.8"/>
  <circle cx="80" cy="80" r="34" fill="none" stroke="rgba(93,235,241,0.4)" strokeWidth="0.6"/>
</svg>
<div style={{position:"absolute",width:"4px",height:"4px",borderRadius:"50%",background:"rgba(125,211,252,0.7)",top:"18%",right:"18%",boxShadow:"0 0 5px rgba(93,235,241,0.6)",pointerEvents:"none"}}/>
<div style={{position:"absolute",width:"3px",height:"3px",borderRadius:"50%",background:"rgba(93,235,241,0.6)",top:"65%",right:"8%",boxShadow:"0 0 4px rgba(93,235,241,0.5)",pointerEvents:"none"}}/>
<div style={{position:"absolute",width:"5px",height:"5px",borderRadius:"50%",background:"rgba(125,211,252,0.5)",bottom:"15%",left:"8%",boxShadow:"0 0 5px rgba(93,235,241,0.4)",pointerEvents:"none"}}/>
<div style={{position:"relative",zIndex:1}}>
<div
style={{
    fontSize: "14px",
    color: "#06b6d4",
    fontWeight: "800",
    marginBottom: "8px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  }}
>
Price Breakdown
</div>
</div>
</div>
<div
className="price-breakdown-scroll"
style={{
    padding: "25px",
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
  }}
>
{getPriceBreakdown().length === 0 ? (
    <div
    style={{
        textAlign: "center",
        padding: "30px 20px",
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: "14px",
        fontWeight: "600",
      }}
  >
  Select services to see pricing
  </div>
) : (
<>
<div style={{ marginBottom: "20px" }}>
{getPriceBreakdown().map((item, index) => (
      <div
      key={index}
      style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "14px",
        }}
    >
    <div
    style={{
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: "600",
      }}
  >
  {item.label}
  </div>
  <div style={{ color: "white", fontWeight: "800" }}>
  ${item.amount.toFixed(2)}
  </div>
  </div>
))}
</div>
<div
style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderTop: "2px solid rgba(255, 255, 255, 0.2)",
    fontSize: "15px",
  }}
>
<div
style={{
    color: "#06b6d4",
    fontWeight: "800",
    textTransform: "uppercase",
  }}
>
Subtotal
</div>
<div style={{ color: "white", fontWeight: "900" }}>
${calculateSubtotal().toFixed(2)}
</div>
</div>
{getDiscount() > 0 && (
    <div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        background:
        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        borderRadius: "12px",
        marginBottom: "16px",
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
      }}
  >
  <div style={{ color: "white", fontWeight: "800" }}>
  {serviceType === "House Cleaning" && (
      <>
      {frequency === "every-week" && "WEEKLY (20%)"}
      {frequency === "bi-weekly" && "BI-WEEKLY (15%)"}
      {frequency === "every-3-weeks" && "3-WEEK (12%)"}
      {frequency === "every-4-weeks" && "4-WEEK (9%)"}
      </>
    )}
{serviceType === "Airbnb Cleaning" &&
  "DISCOUNTS APPLIED"}
</div>
<div style={{ color: "white", fontWeight: "900" }}>
-${getDiscount().toFixed(2)}
</div>
</div>
)}
</>
)}
</div>

{/* Price Disclaimer */}
<div style={{
  padding: "12px 20px",
  background: "rgba(255, 255, 255, 0.1)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
}}>
  <p style={{
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "11px",
    margin: 0,
    fontWeight: "600",
    lineHeight: "1.4",
    textAlign: "center",
    fontStyle: "italic",
  }}>
    💡 This is an estimate. Final prices may vary based on property condition and specific requirements.
  </p>
</div>

<div
style={{
    padding: "25px",
    background: "rgba(93, 235, 241, 0.15)",
    backdropFilter: "blur(10px)",
    borderTop: "1px solid rgba(93, 235, 241, 0.3)",
    boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.2)",
  }}
>
<div
style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
<div
style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  }}
>
<div
style={{
    color: "white",
    fontWeight: "900",
    fontSize: "18px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  }}
>
Total
</div>
{(() => {
      const minimum =
      serviceType === "Airbnb Cleaning" &&
      airbnbLaundry === "no"
      ? 139.99
      : 154.99;
      return (
        calculateSubtotal() - getDiscount() < minimum && (
          <div
          style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              marginTop: "4px",
            }}
        >
        (Min. ${minimum.toFixed(2)})
        </div>
      )
  );
})()}
</div>
<div
style={{
    color: "white",
    fontWeight: "900",
    fontSize: "36px",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  }}
>
${calculateTotal().toFixed(2)}
</div>
</div>
</div>
</div>
<div
className="satisfaction-badge"
style={{
    marginTop: "20px",
    padding: "20px",
    background: "white",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(12, 74, 110, 0.1)",
  }}
>
<div style={{ fontSize: "36px", marginBottom: "12px" }}>🛡️</div>
<div
style={{
    fontSize: "13px",
    color: "#0c4a6e",
    fontWeight: "800",
    lineHeight: "1.6",
    letterSpacing: "0.3px",
  }}
>
100% SATISFACTION
<br />
GUARANTEED
</div>
</div>
</div>
)}
</div>

{/* MOBILE-ONLY PRICE DISPLAY - STICKY AT BOTTOM */}
{(step === 2 || step === 3) && (
  <div ref={mobileBarRef} className="mobile-price-sticky" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000}}>
    <div style={{
      backgroundColor:"#020c1f",
      backgroundImage:`radial-gradient(circle at 20% 30%, rgba(5,53,116,0.55) 0%, transparent 45%),radial-gradient(circle at 80% 68%, rgba(10,79,168,0.45) 0%, transparent 40%)`,
      backgroundSize:"100% 100%, 100% 100%",
      borderTop:"2px solid rgba(93,235,241,0.35)",
      borderRadius:"16px 16px 0 0",
      boxShadow:"0 -8px 30px rgba(0,0,0,0.5)",
    }}>
      {/* Total row — always visible */}
      <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:"rgba(93,235,241,0.8)",fontSize:"11px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase"}}>Estimate</div>
          {getDiscount()>0&&<div style={{color:"#10b981",fontSize:"11px",fontWeight:"700",marginTop:"2px"}}>✓ Saving ${getDiscount().toFixed(2)}</div>}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{color:"white",fontSize:"28px",fontWeight:"900",lineHeight:"1"}}>${calculateTotal().toFixed(2)}</div>
          <div style={{color:"rgba(93,235,241,0.6)",fontSize:"10px",fontWeight:"600"}}>per visit</div>
        </div>
      </div>
      {/* Line items — hard capped, always scrollable */}
      {getPriceBreakdown().length>0&&(
        <div style={{borderTop:"1px solid rgba(93,235,241,0.15)",overflowY:"scroll",maxHeight:"120px",padding:"6px 20px 10px",WebkitOverflowScrolling:"touch"}}>
          {getPriceBreakdown().map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",fontSize:"12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <span style={{color:"rgba(255,255,255,0.8)",fontWeight:"600",flex:1,marginRight:"8px"}}>{item.label}</span>
              <span style={{color:"white",fontWeight:"700",flexShrink:0}}>${item.amount.toFixed(2)}</span>
            </div>
          ))}
          {getDiscount()>0&&(
            <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0 0",borderTop:"1px solid rgba(16,185,129,0.4)",marginTop:"3px"}}>
              <span style={{color:"#10b981",fontSize:"12px",fontWeight:"800"}}>✓ Discount Applied</span>
              <span style={{color:"#10b981",fontSize:"12px",fontWeight:"900"}}>-${getDiscount().toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}

{/* Success Modal */}
{showSuccessModal && (
    <div
    style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        animation: "fadeIn 0.3s ease-out",
      }}
  onClick={() => setShowSuccessModal(false)}
  >
  <div
  style={{
      background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
      borderRadius: "32px",
      padding: "50px 40px",
      maxWidth: "500px",
      width: "100%",
      boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
      border: "2px solid rgba(6, 182, 212, 0.3)",
      textAlign: "center",
      position: "relative",
      animation: "slideInUp 0.4s ease-out",
    }}
onClick={(e) => e.stopPropagation()}
>
{/* Success Icon */}
<div
style={{
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 30px",
    boxShadow: "0 20px 50px rgba(16, 185, 129, 0.4)",
    animation: "scaleIn 0.5s ease-out 0.2s backwards",
  }}
>
<div
style={{
    fontSize: "50px",
    animation: "rotateIn 0.6s ease-out 0.4s backwards",
  }}
>
✓
</div>
</div>
{/* Success Message */}
<h2
style={{
    fontSize: "32px",
    fontWeight: "900",
    color: "white",
    margin: "0 0 20px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }}
>
Booking Received!
</h2>
<p
style={{
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: "1.6",
    marginBottom: "10px",
    fontWeight: "600",
  }}
>
Thank you for choosing Cleaning Su Casa!
</p>
<p
style={{
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: "1.6",
    marginBottom: "30px",
    fontWeight: "500",
  }}
>
Your quote for{" "}
<strong style={{ color: "#06b6d4", fontSize: "20px" }}>
${calculateTotal().toFixed(2)}
</strong>{" "}
has been submitted.
<br />
We'll contact you at{" "}
<strong style={{ color: "white" }}>{email}</strong> shortly!
</p>
{/* Close Button */}
<button
onClick={() => {
    setShowSuccessModal(false);
    window.location.reload();
  }}
style={{
    padding: "18px 40px",
    background: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(6, 182, 212, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }}
onMouseEnter={(e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 15px 40px rgba(6, 182, 212, 0.5)";
  }}
onMouseLeave={(e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 10px 30px rgba(6, 182, 212, 0.4)";
  }}
>
Got It!
</button>
</div>
</div>
)}
{/* Animations */}
<style>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
to {
  opacity: 1;
  transform: translateY(0);
}
}
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
to {
  opacity: 1;
  transform: scale(1);
}
}
@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotate(-180deg);
  }
to {
  opacity: 1;
  transform: rotate(0);
}
}
`}</style>
</div>
);
}
