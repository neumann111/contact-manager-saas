import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { useContactStore } from '../store/contactStore';
import { ContactForm } from '../components/contacts/ContactForm';
import { useDebounce } from '../hooks/useDebounce';
import type { Contact } from '../types';

export const ContactsPage: React.FC = () => {
  const { contacts, pagination, isLoading, fetchContacts, deleteContact } = useContactStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Fetch contacts whenever the debounced search OR page changes
  useEffect(() => {
    fetchContacts({ search: debouncedSearch, page, limit: 10 });
  }, [debouncedSearch, page, fetchContacts]);

  // OFFENDING useEffect REMOVED ENTIRELY FROM HERE

  const handleOpenCreate = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    fetchContacts({ search: debouncedSearch, page, limit: 10 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Contacts Directory
        </h1>
        <Button onClick={handleOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search by name, email, or company..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // <--- We now reset the page instantly in the event handler!
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Spinner size="lg" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No contacts found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm ? `No results for "${searchTerm}"` : "You haven't added any contacts yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/80 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Contact Details</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold shrink-0">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {contact.firstName} {contact.lastName}
                          {contact.isFavorite && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                        </div>
                        {contact.company && <div className="text-xs text-gray-500">{contact.company}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-gray-200">{contact.email || '-'}</div>
                      <div className="text-gray-500 text-xs">{contact.phoneNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {contact.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                          {contact.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(contact)}>
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(contact._id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <span className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{contacts.length}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> entries
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1 || isLoading} 
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === pagination.totalPages || isLoading} 
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingContact ? 'Edit Contact' : 'New Contact'}
      >
        <ContactForm 
          key={editingContact ? editingContact._id : 'new-contact'}
          initialData={editingContact} 
          onSuccess={handleCloseModal} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};