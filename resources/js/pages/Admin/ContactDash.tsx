import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

// Define the Contact interface
interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
  emailAddress: string;
  message: string;
  createdAt?: string; // Optional timestamp
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Contact Dashboard",
    href: "admin/contactus",
  },
];

const ContactDash = ({ contacts }: { contacts: Contact[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Contact>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter((contact) =>
      Object.values(contact).some((value) =>
        value != null && String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle undefined/null values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? 1 : -1;
      if (bValue == null) return sortDirection === "asc" ? -1 : 1;
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [contacts, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleMessageExpansion = (contactId: number) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(contactId)) {
      newExpanded.delete(contactId);
    } else {
      newExpanded.add(contactId);
    }
    setExpandedMessages(newExpanded);
  };

  const toggleContactSelection = (contactId: number) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredAndSortedContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredAndSortedContacts.map(c => c.id)));
    }
  };

  const handleDeleteSingle = (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      setIsDeleting(true);
      router.delete(route('admin.contacts.destroy', contactId), {
        onFinish: () => setIsDeleting(false),
        onError: () => {
          alert('Failed to delete contact. Please try again.');
        }
      });
    }
  };

  const handleDeleteMultiple = () => {
    const selectedIds = Array.from(selectedContacts);
    if (selectedIds.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedIds.length} contact(s)? This action cannot be undone.`)) {
      setIsDeleting(true);
      router.delete(route('admin.contacts.destroyMultiple'), {
        data: { ids: selectedIds },
        onFinish: () => {
          setIsDeleting(false);
          setSelectedContacts(new Set()); // Clear selection after deletion
        },
        onError: () => {
          alert('Failed to delete contacts. Please try again.');
        }
      });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  const getSortIcon = (field: keyof Contact) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕️</span>;
    }
    return sortDirection === "asc" ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contact Dashboard" />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {filteredAndSortedContacts.length} of {contacts.length} contacts
            </p>
          </div>
          
          {/* Actions */}
          {selectedContacts.size > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteMultiple}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : `Delete (${selectedContacts.size})`}
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={sortField} 
                onChange={(e) => setSortField(e.target.value as keyof Contact)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="id">Sort by ID</option>
                <option value="firstName">Sort by First Name</option>
                <option value="lastName">Sort by Last Name</option>
                <option value="emailAddress">Sort by Email</option>
                <option value="createdAt">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedContacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📧</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No matching contacts found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms or filters.' 
                : 'Contact messages will appear here when customers reach out.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedContacts.size === filteredAndSortedContacts.length && filteredAndSortedContacts.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    {[
                      { key: 'firstName', label: 'First Name' },
                      { key: 'lastName', label: 'Last Name' },
                      { key: 'contactNumber', label: 'Phone' },
                      { key: 'emailAddress', label: 'Email' },
                      { key: 'message', label: 'Message' },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort(key as keyof Contact)}
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          {getSortIcon(key as keyof Contact)}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedContacts.map((contact, index) => (
                    <tr
                      key={contact.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedContacts.has(contact.id) ? 'bg-blue-50' : ''
                      } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedContacts.has(contact.id)}
                          onChange={() => toggleContactSelection(contact.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contact.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={`tel:${contact.contactNumber}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {contact.contactNumber}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={`mailto:${contact.emailAddress}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {contact.emailAddress}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className={expandedMessages.has(contact.id) ? '' : 'truncate'}>
                          {expandedMessages.has(contact.id) 
                            ? contact.message 
                            : truncateMessage(contact.message)
                          }
                        </div>
                        {contact.message.length > 100 && (
                          <button
                            onClick={() => toggleMessageExpansion(contact.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs mt-1 font-medium"
                          >
                            {expandedMessages.has(contact.id) ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDeleteSingle(contact.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ContactDash;