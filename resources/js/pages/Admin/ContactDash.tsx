"use client"

import { useState, useMemo } from "react"
import { Search, Mail, Phone, Calendar, Trash2, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import DeleteModal from "@/components/modal/delete-modal"

// Define the Contact interface
interface Contact {
  id: number
  firstName: string
  lastName: string
  contactNumber: string
  emailAddress: string
  message: string
  createdAt?: string
}

export default function ContactDashboard({ contacts }: { contacts: Contact[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Contact>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set())
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(0)
  const [routeLink, setRouteLink] = useState('')

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    const filtered = contacts.filter((contact) =>
      Object.values(contact).some(
        (value) => value != null && String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )

    return filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortDirection === "asc" ? 1 : -1
      if (bValue == null) return sortDirection === "asc" ? -1 : 1

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [contacts, searchTerm, sortField, sortDirection])

  const toggleMessageExpansion = (contactId: number) => {
    const newExpanded = new Set(expandedMessages)
    if (newExpanded.has(contactId)) {
      newExpanded.delete(contactId)
    } else {
      newExpanded.add(contactId)
    }
    setExpandedMessages(newExpanded)
  }

  const toggleContactSelection = (contactId: number) => {
    const newSelected = new Set(selectedContacts)
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId)
    } else {
      newSelected.add(contactId)
    }
    setSelectedContacts(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredAndSortedContacts.length) {
      setSelectedContacts(new Set())
    } else {
      setSelectedContacts(new Set(filteredAndSortedContacts.map((c) => c.id)))
    }
  }

  const handleDeleteSingle = (contactId: number) => {
    setDeleteDialogOpen(true)
    setDeleteId(contactId)
  }

  const handleDeleteMultiple = () => {
    const selectedIds = Array.from(selectedContacts)
    if (selectedIds.length === 0) return

    if (confirm(`Are you sure you want to delete ${selectedIds.length} contact(s)? This action cannot be undone.`)) {
      setIsDeleting(true)
      setTimeout(() => {
        setIsDeleting(false)
        setSelectedContacts(new Set())
        alert(`${selectedIds.length} contacts deleted successfully!`)
      }, 1000)
    }
  }

  const truncateMessage = (message: string, maxLength = 120) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AppLayout>
      <Head title="Contact Us"/>
      <div className="min-h-screen p-4 md:p-6">
        <div className="p-7 space-y-6">
          {/* Header */}
          <div className="">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold ">Contact Dashboard</h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {filteredAndSortedContacts.length} of {contacts.length} contacts
                  </Badge>
                </p>
              </div>

              {/* Bulk Actions */}
              {selectedContacts.size > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-lg ">
                  <span className="text-sm font-medium ">{selectedContacts.size} selected</span>
                  <Button
                    onClick={handleDeleteMultiple}
                    disabled={isDeleting}
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Selected"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="rounded-lg shadow-sm border p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search contacts by name, email, phone, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={sortField} onValueChange={(value) => setSortField(value as keyof Contact)}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Sort by Date</SelectItem>
                    <SelectItem value="firstName">Sort by First Name</SelectItem>
                    <SelectItem value="lastName">Sort by Last Name</SelectItem>
                    <SelectItem value="emailAddress">Sort by Email</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  className="px-3"
                >
                  {sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Select All */}
            {filteredAndSortedContacts.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedContacts.size === filteredAndSortedContacts.length && filteredAndSortedContacts.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Select all contacts
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {filteredAndSortedContacts.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent className="pt-6">
                <div className="text-gray-400 text-6xl mb-4">📧</div>
                <h3 className="text-lg font-semibold  mb-2">
                  {searchTerm ? "No matching contacts found" : "No messages yet"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms or filters."
                    : "Contact messages will appear here when customers reach out."}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")} variant="outline">
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAndSortedContacts.map((contact) => (
                <Card
                  key={contact.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    selectedContacts.has(contact.id) ? "ring-2 " : "hover:shadow-lg"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <Checkbox
                          checked={selectedContacts.has(contact.id)}
                          onCheckedChange={() => toggleContactSelection(contact.id)}
                        />
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {contact.firstName.charAt(0)}
                          {contact.lastName.charAt(0)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            {/* Name and Date */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                              <h3 className="text-lg font-semibold ">
                                {contact.firstName} {contact.lastName}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(contact.createdAt)}
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                              <a
                                href={`mailto:${contact.emailAddress}`}
                                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                <span className="truncate">{contact.emailAddress}</span>
                              </a>
                              <a
                                href={`tel:${contact.contactNumber}`}
                                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                {contact.contactNumber}
                              </a>
                            </div>

                            {/* Message */}
                            <div className="bg-accent rounded-lg p-4">
                              <h4 className="text-sm font-medium  mb-2">Message:</h4>
                              <p className=" leading-relaxed">
                                {expandedMessages.has(contact.id) ? contact.message : truncateMessage(contact.message)}
                              </p>
                              {contact.message.length > 120 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleMessageExpansion(contact.id)}
                                  className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                                >
                                  {expandedMessages.has(contact.id) ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 mr-1" />
                                      Show less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4 mr-1" />
                                      Show more
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSingle(contact.id)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <DeleteModal 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        id={deleteId}
        routeLink={'admin.deleteConcern'}
        description={"This will permanently delete the concern and remove all associated data"}
        toastMessage="Delete successfully"
        buttonTitle="Delete Concern"
      />
    </AppLayout>
  )
}
