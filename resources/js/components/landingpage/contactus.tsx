"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Phone, MessageSquare, Send, CheckCircle, MapPin, Users, Award } from "lucide-react"
import { router } from "@inertiajs/react"

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

    // Simulate API call - replace with your actual API endpoint
    try {
      router.post(route('add.concern'), {
          firstName: data.firstName,
          lastName: data.lastName,
          contactNumber: data.contactNumber,
          emailAddress: data.emailAddress,
          message: data.message,
        }, {
          onSuccess: () => {
            console.log('success')
          }
        })

      setSubmitted(true)
      setData({
        firstName: "",
        lastName: "",
        contactNumber: "",
        emailAddress: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setProcessing(false)
    }
  }

  const characterCount = data.message.length

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@neuronest.edu",
      bgColor: "from-teal-500 to-teal-600",
      action: "Send Email",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      bgColor: "from-blue-500 to-blue-600",
      action: "Call Now",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come see us in person",
      contact: "123 Education St., Tech City",
      bgColor: "from-orange-500 to-orange-600",
      action: "Get Directions",
    },
  ]

  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Happy Students",
      bgColor: "from-teal-500 to-teal-600",
    },
    {
      icon: Award,
      number: "24/7",
      label: "Support Available",
      bgColor: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Let's Start a Conversation</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ready to transform your learning journey? We're here to help you every step of the way. Get in touch with
            our team and discover how NeuroNest can unlock your potential.
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Message sent successfully! We'll get back to you soon.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-slate-200 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-50 to-teal-100 rounded-full -translate-y-20 translate-x-20 opacity-50" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-50 to-orange-100 rounded-full translate-y-16 -translate-x-16 opacity-50" />

              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Send us a message</h3>
                  <p className="text-slate-600 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200 hover:border-slate-400"
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200 hover:border-slate-400"
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          id="contactNumber"
                          name="contactNumber"
                          value={data.contactNumber}
                          onChange={handleInputChange}
                          maxLength={11}
                          placeholder="(555) 123-4567"
                          className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200 hover:border-slate-400"
                          required
                        />
                      </div>
                      {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                    </div>

                    <div>
                      <label htmlFor="emailAddress" className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          id="emailAddress"
                          name="emailAddress"
                          value={data.emailAddress}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200 hover:border-slate-400"
                          required
                        />
                      </div>
                      {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        id="message"
                        name="message"
                        value={data.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your inquiry, which program interests you, or how we can help you achieve your learning goals..."
                        rows={5}
                        maxLength={300}
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200 resize-none hover:border-slate-400"
                        required
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-sm transition-colors ${
                          characterCount > 250 ? "text-orange-500" : "text-slate-500"
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
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 focus:ring-4 focus:ring-teal-200 outline-none disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Message...
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
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Get in touch</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${method.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                      >
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{method.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{method.description}</p>
                        <p className="text-slate-900 font-medium text-sm">{method.contact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Why choose us?</h4>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.number}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Response Guarantee */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Our Promise</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700 text-sm">Response within 24 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700 text-sm">Dedicated support team</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700 text-sm">Personalized guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-slate-700 text-sm">Free consultation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
