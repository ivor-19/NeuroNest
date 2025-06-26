import type React from "react"
import { useState } from "react"
import { Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react"
import Header from "@/components/landingpage/header"
import Footer from "@/components/landingpage/footer"

interface FormData {
  firstName: string
  lastName: string
  contactNumber: string
  emailAddress: string
  message: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  contactNumber?: string
  emailAddress?: string
  message?: string
}

export default function ContactUs() {
  const [data, setData] = useState<FormData>({
    firstName: "",
    lastName: "",
    contactNumber: "",
    emailAddress: "",
    message: "",
  })

  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "contactNumber") {
      // Only allow numbers
      if (!/^\d*$/.test(value)) return
    }

    if (name === "message") {
      // Limit to 300 characters
      if (value.length > 300) return
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setProcessing(false)
      setSubmitted(true)
      setData({
        firstName: "",
        lastName: "",
        contactNumber: "",
        emailAddress: "",
        message: "",
      })

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    }, 1500)
  }

  const characterCount = data.message.length

  return (
    <div className="min-h-screen bg-[#FFF5F0]">
        
      <Header />


      <main className="py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[#F88F60] bg-clip-text mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Message sent successfully!</p>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Form Section */}
              <div className="lg:col-span-3 p-8 lg:p-12">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Got Questions & Inquiries?</h2>
                  <p className="text-gray-600 text-lg">Fill out the form below and we'll get back to you shortly</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-3">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={data.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="text-gray-700 w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all duration-200 group-hover:border-gray-300"
                          required
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-3">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={data.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          className="text-gray-700 w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all duration-200 group-hover:border-gray-300"
                          required
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                        Contact Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="contactNumber"
                          name="contactNumber"
                          value={data.contactNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="text-gray-700 w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all duration-200 group-hover:border-gray-300"
                          required
                        />
                      </div>
                      {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">{errors.contactNumber}</p>
                      )}
                    </div>

                    <div className="group">
                      <label htmlFor="emailAddress" className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="emailAddress"
                          name="emailAddress"
                          value={data.emailAddress}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          className="text-gray-700 w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all duration-200 group-hover:border-gray-300"
                          required
                        />
                      </div>
                      {errors.emailAddress && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">{errors.emailAddress}</p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        id="message"
                        name="message"
                        value={data.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your inquiry..."
                        rows={6}
                        maxLength={300}
                        className="text-gray-700 w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all duration-200 resize-none group-hover:border-gray-300"
                        required
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span
                        className={`text-sm transition-colors ${
                          characterCount > 250 ? "text-orange-500" : "text-gray-500"
                        }`}
                      >
                        {characterCount}/300 characters
                      </span>
                      {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 focus:ring-4 focus:ring-teal-200 outline-none disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Send className="w-5 h-5" />
                        Send Message
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {/* Brand Section */}
              <div className="lg:col-span-2 bg-gradient-to-br from-teal-600 via-teal-600 to-[#F88F60] p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                  <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                </div>

                <div className="text-center relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <div className="w-80 h-80 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
                      <img
                        src="/placeholder.svg?height=256&width=256"
                        alt="NeuroNest Logo"
                        className="w-64 h-64 object-contain opacity-90"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">NeuroNest</h3>
                    <p className="text-blue-100 text-lg">Connecting minds, building futures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">hello@neuronest.com</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
