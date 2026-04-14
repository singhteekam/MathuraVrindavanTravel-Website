'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Car, Calendar, Users, MapPin, Phone, Mail, User,
  ChevronRight, Check, ArrowLeft, MessageCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cars, durations, addons, siteConfig } from '@/config/site'
import { formatCurrency } from '@/lib/utils'
import { ALL_PACKAGES } from '@/data/packages'

const STEPS = ['Trip Details', 'Your Details', 'Confirm']

function BookingForm() {
  const searchParams = useSearchParams()
  const preselectedPackage = searchParams.get('package') ?? ''
  const preselectedCar     = searchParams.get('car')     ?? cars[0].id

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1 state
  const [selectedPackage,  setSelectedPackage]  = useState(preselectedPackage)
  const [selectedCar,      setSelectedCar]      = useState(preselectedCar)
  const [selectedDuration, setSelectedDuration] = useState(durations[0].id)
  const [travelDate,       setTravelDate]       = useState('')
  const [pickupLocation,   setPickupLocation]   = useState('')
  const [selectedAddons,   setSelectedAddons]   = useState<string[]>(['hotel_help', 'restaurant_help'])

  // Step 2 state
  const [name,     setName]     = useState('')
  const [phone,    setPhone]    = useState('')
  const [email,    setEmail]    = useState('')
  const [passengers, setPassengers] = useState('2')
  const [requests, setRequests] = useState('')

  const carData      = cars.find((c) => c.id === selectedCar)!
  const durationData = durations.find((d) => d.id === selectedDuration)!
  const pkgData      = ALL_PACKAGES.find((p) => p.slug === selectedPackage)

  const addonTotal = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)

  const basePrice   = pkgData
    ? (pkgData.pricing?.find((p: { carType: string; price: number }) => p.carType === selectedCar)?.price ?? pkgData.basePrice)
    : carData.basePrice * durationData.days

  const totalPrice = basePrice + addonTotal

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  function goToStep2() {
    if (!travelDate) { toast.error('Please select a travel date.'); return }
    if (!pickupLocation.trim()) { toast.error('Please enter your pickup location.'); return }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToStep3() {
    if (!name.trim())  { toast.error('Please enter your name.'); return }
    if (!phone.trim()) { toast.error('Please enter your phone number.'); return }
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleConfirm() {
    setLoading(true)
    // TODO: call /api/bookings POST endpoint
    await new Promise((r) => setTimeout(r, 1500))
    toast.success('Booking confirmed! Our team will call you within 30 minutes. Jai Shri Krishna 🙏')
    setLoading(false)
    // TODO: redirect to /booking/confirmation?id=...
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero strip ── */}
      <div
        className="py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1e1b4b 100%)' }}
      >
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-saffron-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-300">Book a Tour</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}>
            Book Your Mathura Vrindavan Tour
          </h1>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={step > i + 1
                      ? { background: '#22c55e', color: '#fff' }
                      : step === i + 1
                      ? { background: '#ff7d0f', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.15)', color: '#9ca3af' }
                    }
                  >
                    {step > i + 1 ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${step === i + 1 ? 'text-white' : 'text-gray-400'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-8 sm:w-16 h-px mx-2"
                    style={{ background: step > i + 1 ? '#22c55e' : 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── Main form area ── */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card rounded-2xl p-6 mb-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-1">Step 1: Trip Details</h2>
                    <p className="text-gray-500 text-sm mb-6">Choose your vehicle, dates, and pickup location.</p>

                    {/* Package selector */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                        <Car size={12} className="inline mr-1" /> Select Tour Package (Optional)
                      </label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => setSelectedPackage('')}
                          className="p-3 rounded-xl text-left transition-all duration-200"
                          style={!selectedPackage
                            ? { border: '2px solid #ff7d0f', background: '#fff8ed' }
                            : { border: '1px solid #e5e7eb', background: '#fff' }
                          }
                        >
                          <p className="text-sm font-semibold text-gray-800">Custom Trip</p>
                          <p className="text-xs text-gray-400 mt-0.5">I'll select duration & car manually</p>
                        </button>
                        {ALL_PACKAGES.slice(0, 5).map((pkg) => (
                          <button
                            key={pkg.slug}
                            onClick={() => { setSelectedPackage(pkg.slug); setSelectedDuration(durations.find(d => d.days === pkg.duration)?.id ?? durations[0].id) }}
                            className="p-3 rounded-xl text-left transition-all duration-200"
                            style={selectedPackage === pkg.slug
                              ? { border: '2px solid #ff7d0f', background: '#fff8ed' }
                              : { border: '1px solid #e5e7eb', background: '#fff' }
                            }
                          >
                            <p className="text-sm font-semibold text-gray-800 truncate">{pkg.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#ff7d0f' }}>
                              from {formatCurrency(pkg.basePrice)} · {pkg.duration} day{pkg.duration > 1 ? 's' : ''}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Car selector */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                        Choose Your Vehicle
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {cars.map((car) => (
                          <button
                            key={car.id}
                            onClick={() => setSelectedCar(car.id)}
                            className="p-4 rounded-xl text-center transition-all duration-200"
                            style={selectedCar === car.id
                              ? { border: '2px solid #ff7d0f', background: '#fff8ed' }
                              : { border: '1px solid #e5e7eb', background: '#fff' }
                            }
                          >
                            <span className="text-3xl block mb-2">🚗</span>
                            <p className="text-sm font-bold text-gray-900">{car.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{car.capacity}</p>
                            <p className="text-sm font-bold mt-1.5" style={{ color: '#ff7d0f' }}>
                              from {formatCurrency(car.basePrice)}/day
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration — only show if no package selected */}
                    {!selectedPackage && (
                      <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                          Trip Duration
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {durations.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => setSelectedDuration(d.id)}
                              className="py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
                              style={selectedDuration === d.id
                                ? { border: '2px solid #ff7d0f', background: '#fff8ed', color: '#c74a06' }
                                : { border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280' }
                              }
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Date + Pickup */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          <Calendar size={12} className="inline mr-1" /> Travel Date *
                        </label>
                        <input
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          <MapPin size={12} className="inline mr-1" /> Pickup Location *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mathura Junction, Hotel name..."
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    {/* Add-ons */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                        Add-on Services
                      </label>
                      <div className="space-y-2">
                        {addons.map((addon) => (
                          <button
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 text-left"
                            style={selectedAddons.includes(addon.id)
                              ? { border: '1.5px solid #ff7d0f', background: '#fff8ed' }
                              : { border: '1px solid #e5e7eb', background: '#fff' }
                            }
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{addon.icon}</span>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{addon.label}</p>
                                <p className="text-xs text-gray-400">{addon.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                              <span className="text-sm font-bold" style={{ color: addon.price > 0 ? '#ff7d0f' : '#16a34a' }}>
                                {addon.price > 0 ? `+${formatCurrency(addon.price)}` : 'FREE'}
                              </span>
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={selectedAddons.includes(addon.id)
                                  ? { background: '#ff7d0f' }
                                  : { border: '2px solid #d1d5db', background: '#fff' }
                                }
                              >
                                {selectedAddons.includes(addon.id) && <Check size={11} className="text-white" />}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={goToStep2} className="btn-primary w-full py-4 text-base">
                      Continue to Passenger Details <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card rounded-2xl p-6 mb-6">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-saffron-600 transition-colors mb-5">
                      <ArrowLeft size={15} /> Back to Trip Details
                    </button>
                    <h2 className="font-bold text-gray-900 text-lg mb-1">Step 2: Your Details</h2>
                    <p className="text-gray-500 text-sm mb-6">We need your contact details to confirm the booking.</p>

                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            <User size={12} className="inline mr-1" /> Full Name *
                          </label>
                          <input type="text" placeholder="Ram Sharma"
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            <Phone size={12} className="inline mr-1" /> Phone / WhatsApp *
                          </label>
                          <input type="tel" placeholder="+91 98765 43210"
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="input-field" required />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            <Mail size={12} className="inline mr-1" /> Email Address
                          </label>
                          <input type="email" placeholder="your@email.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="input-field" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            <Users size={12} className="inline mr-1" /> Number of Passengers
                          </label>
                          <select value={passengers} onChange={(e) => setPassengers(e.target.value)}
                            className="input-field">
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Special Requests (Optional)
                        </label>
                        <textarea rows={3}
                          placeholder="Any special requirements — mobility assistance, specific temples, dietary needs..."
                          value={requests} onChange={(e) => setRequests(e.target.value)}
                          className="input-field resize-none" />
                      </div>

                      {/* WhatsApp opt-in */}
                      <div className="flex items-start gap-3 p-4 rounded-xl"
                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <span className="text-green-500 mt-0.5">✓</span>
                        <p className="text-sm text-green-700">
                          Booking confirmation and updates will be sent to your WhatsApp number.
                          Our team will call you within 30 minutes.
                        </p>
                      </div>
                    </div>

                    <button onClick={goToStep3} className="btn-primary w-full py-4 text-base mt-6">
                      Review & Confirm Booking <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Review & Confirm */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card rounded-2xl p-6 mb-6">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-saffron-600 transition-colors mb-5">
                      <ArrowLeft size={15} /> Back to Your Details
                    </button>
                    <h2 className="font-bold text-gray-900 text-lg mb-5">Step 3: Review & Confirm</h2>

                    {/* Summary sections */}
                    {[
                      {
                        title: 'Trip Details',
                        emoji: '🚗',
                        items: [
                          { label: 'Package',  value: pkgData?.name ?? 'Custom Trip' },
                          { label: 'Vehicle',  value: carData.name },
                          { label: 'Duration', value: durationData.label },
                          { label: 'Date',     value: new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                          { label: 'Pickup',   value: pickupLocation },
                        ],
                      },
                      {
                        title: 'Passenger Details',
                        emoji: '👤',
                        items: [
                          { label: 'Name',       value: name },
                          { label: 'Phone',      value: phone },
                          { label: 'Email',      value: email || 'Not provided' },
                          { label: 'Passengers', value: `${passengers} people` },
                        ],
                      },
                    ].map((section) => (
                      <div key={section.title} className="mb-5 p-5 rounded-2xl"
                        style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                          <span>{section.emoji}</span>{section.title}
                        </h3>
                        <div className="space-y-2">
                          {section.items.map((item) => (
                            <div key={item.label} className="flex justify-between text-sm">
                              <span className="text-gray-500">{item.label}</span>
                              <span className="font-semibold text-gray-800 text-right max-w-xs">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Add-ons */}
                    {selectedAddons.length > 0 && (
                      <div className="mb-5 p-5 rounded-2xl"
                        style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                        <h3 className="font-bold text-gray-800 text-sm mb-3">🎁 Add-on Services</h3>
                        {addons.filter((a) => selectedAddons.includes(a.id)).map((a) => (
                          <div key={a.id} className="flex justify-between text-sm py-1">
                            <span className="text-gray-600">{a.icon} {a.label}</span>
                            <span className="font-semibold" style={{ color: a.price > 0 ? '#ff7d0f' : '#16a34a' }}>
                              {a.price > 0 ? `+${formatCurrency(a.price)}` : 'FREE'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {requests && (
                      <div className="mb-5 p-4 rounded-2xl"
                        style={{ background: '#fffbeb', border: '1px solid #fef3c7' }}>
                        <p className="text-xs font-semibold text-amber-700 mb-1">Special Requests</p>
                        <p className="text-sm text-gray-700">{requests}</p>
                      </div>
                    )}

                    {/* Payment info */}
                    <div className="p-4 rounded-2xl mb-6"
                      style={{ background: '#fff8ed', border: '1px solid #ffdba8' }}>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Payment Note</p>
                      <p className="text-sm text-gray-600">
                        Pay <strong className="text-saffron-600">30% advance ({formatCurrency(Math.round(totalPrice * 0.3))})</strong> to
                        confirm. Remaining {formatCurrency(Math.round(totalPrice * 0.7))} to be paid on the day of trip.
                      </p>
                    </div>

                    <button onClick={handleConfirm} disabled={loading}
                      className="btn-primary w-full py-4 text-base"
                      style={{ opacity: loading ? 0.7 : 1 }}>
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                      ) : (
                        <>Confirm Booking — {formatCurrency(totalPrice)} total</>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=Namaste! I want to book a ${carData.name} for ${durationData.label} on ${travelDate}. My name is ${name}, phone: ${phone}. Please confirm. 🙏`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm mt-3 transition-colors"
                      style={{ background: '#dcfce7', color: '#16a34a' }}
                    >
                      <MessageCircle size={16} /> Or Book via WhatsApp
                    </a>

                    <p className="text-center text-xs text-gray-400 mt-3">
                      🔒 Secure booking · Free cancellation up to 24 hrs
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Price Summary sidebar ── */}
          <div className="lg:col-span-1">
            <div
              className="card rounded-2xl p-5 sticky top-24"
            >
              <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-semibold text-gray-800">{carData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-gray-800">{durationData.label}</span>
                </div>
                {pkgData && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Package</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[150px] truncate">{pkgData.name}</span>
                  </div>
                )}
                {travelDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base price</span>
                  <span className="font-semibold">{formatCurrency(basePrice)}</span>
                </div>
                {addonTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Add-ons</span>
                    <span className="font-semibold">+{formatCurrency(addonTotal)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl" style={{ color: '#ff7d0f' }}>
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Advance to pay now</span>
                  <span className="text-xs font-semibold text-green-600">
                    {formatCurrency(Math.round(totalPrice * 0.3))} (30%)
                  </span>
                </div>
              </div>

              <div className="rounded-xl p-3 text-xs"
                style={{ background: '#f0fdf4', color: '#166534' }}>
                ✓ Free cancellation up to 24 hrs before trip<br />
                ✓ No hidden charges<br />
                ✓ Confirmation within 30 minutes
              </div>

              <a href={`tel:${siteConfig.phone}`}
                className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-full text-sm font-semibold transition-colors"
                style={{ background: '#fff8ed', color: '#c74a06' }}>
                <Phone size={14} /> Need help? Call us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookingForm />
    </Suspense>
  )
}