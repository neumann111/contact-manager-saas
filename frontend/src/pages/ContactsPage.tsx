import React, { useEffect, useState } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Star, Users, ChevronLeft, ChevronRight, Filter, Download, Upload } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { useContactStore } from '../store/contactStore';
import { useCategoryStore } from '../store/categoryStore';
import { ContactForm } from '../components/contacts/ContactForm';
import { useDebounce } from '../hooks/useDebounce';
import type { Contact } from '../types';

export const ContactsPage: React.FC = () => {
  const { contacts, pagination, isLoading, fetchContacts, deleteContact, importContacts, exportContacts } = useContactStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterFavorite, setFilterFavorite] = useState<string>('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchContacts({
      search: debouncedSearch,
      category: filterCategory,
      isFavorite: filterFavorite === 'true' ? true : filterFavorite === 'false' ? false : undefined,
      page,
      limit
    });
  }, [debouncedSearch, filterCategory, filterFavorite, page, limit, fetchContacts]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); 
  };

  const handleOpenCreate = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleOpenView = (contact: Contact) => {
    setViewingContact(contact);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      await importContacts(file);
      fetchContacts({ search: debouncedSearch, page, limit });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    fetchContacts({
      search: debouncedSearch,
      category: filterCategory,
      isFavorite: filterFavorite === 'true' ? true : filterFavorite === 'false' ? false : undefined,
      page,
      limit
    });
  };

  const startItem = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endItem = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text">
          Contacts Directory
        </h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isImporting}
            className="bg-surface hover:bg-surface-secondary border-border hover:border-border-strong text-text transition-colors flex-1 sm:flex-none justify-center"
          >
            <Upload className="w-4 h-4 mr-2 shrink-0" /> Import
          </Button>
          <Button
            variant="outline"
            onClick={() => exportContacts()}
            className="bg-surface hover:bg-surface-secondary border-border hover:border-border-strong text-text transition-colors flex-1 sm:flex-none justify-center"
          >
            <Download className="w-4 h-4 mr-2 shrink-0" /> Export
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-sm transition-all border-transparent flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-4 h-4 mr-2 shrink-0" /> Add Contact
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden shadow-sm border-border bg-surface">
        
        {/* Search and Filters Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-secondary/50">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search by name, email, or company..."
              icon={<Search className="w-4 h-4 text-text-muted" />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="bg-surface border-border focus:border-brand-500 w-full"
            />
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="hidden sm:flex items-center text-sm font-medium text-text-muted">
              <Filter className="w-4 h-4 mr-2 opacity-70" /> Filters:
            </div>
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="rounded-xl border border-border bg-surface text-text px-3 py-2.5 text-sm shadow-sm transition-colors hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={filterFavorite}
              onChange={(e) => { setFilterFavorite(e.target.value); setPage(1); }}
              className="rounded-xl border border-border bg-surface text-text px-3 py-2.5 text-sm shadow-sm transition-colors hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="true">Favorites Only</option>
              <option value="false">Non-Favorites</option>
            </select>
          </div>
        </div>

        {/* Responsive Table Area */}
        <div className="w-full overflow-x-auto min-h-[400px] scrollbar-thin">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Spinner size="lg" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
              <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mb-4 border border-border">
                <Users className="w-8 h-8 text-text-muted opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-text mb-1">No contacts found</h3>
              <p className="text-text-muted text-sm">
                Adjust your search or filters, or add a new contact.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-text-muted uppercase bg-surface-secondary border-b border-border">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3.5 font-semibold tracking-wider">Name</th>
                  <th scope="col" className="px-4 sm:px-6 py-3.5 font-semibold tracking-wider">Contact Details</th>
                  <th scope="col" className="px-4 sm:px-6 py-3.5 font-semibold tracking-wider">Category</th>
                  <th scope="col" className="px-4 sm:px-6 py-3.5 font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="group border-l-2 border-l-transparent hover:border-l-brand-500 hover:bg-surface-secondary/70 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm shrink-0 border border-brand-500/20 shadow-xs">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-text text-sm sm:text-base flex items-center gap-1.5 sm:gap-2">
                          <span className="truncate max-w-[140px] sm:max-w-xs">{contact.firstName} {contact.lastName}</span>
                          {contact.isFavorite && <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-warning text-warning shrink-0" />}
                        </div>
                        {contact.company && <div className="text-xs text-text-muted mt-0.5 truncate max-w-[140px] sm:max-w-xs">{contact.company}</div>}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                      <div className="text-text font-medium text-xs sm:text-sm truncate max-w-[180px] sm:max-w-xs">{contact.email || '-'}</div>
                      <div className="text-text-muted text-xs mt-0.5">{contact.phoneNumber || '-'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                      {contact.category ? (
                        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-xs font-medium bg-surface-tertiary text-text-muted border border-border shadow-2xs">
                          {contact.category.name}
                        </span>
                      ) : (
                        <span className="text-text-muted italic text-xs">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1 p-1 rounded-xl bg-surface-secondary/80 border border-border/70 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleOpenView(contact)}
                          aria-label={`View ${contact.firstName} ${contact.lastName}`}
                          className="p-2 rounded-lg bg-surface border border-border/50 text-text-muted hover:bg-brand-500/15 hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 shadow-2xs active:scale-95 group/btn"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(contact)}
                          aria-label={`Edit ${contact.firstName} ${contact.lastName}`}
                          className="p-2 rounded-lg bg-surface border border-border/50 text-text-muted hover:bg-accent/15 hover:border-accent/40 hover:text-accent transition-all duration-200 shadow-2xs active:scale-95 group/btn"
                          title="Edit Contact"
                        >
                          <Edit2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(contact._id)}
                          aria-label={`Delete ${contact.firstName} ${contact.lastName}`}
                          className="p-2 rounded-lg bg-surface border border-border/50 text-text-muted hover:bg-danger/15 hover:border-danger/40 hover:text-danger transition-all duration-200 shadow-2xs active:scale-95 group/btn"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Responsive Pagination Footer */}
        {pagination && pagination.total > 0 && (
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface">
            
            <div className="flex items-center gap-3 text-sm text-text-muted w-full sm:w-auto justify-center sm:justify-start">
              <label htmlFor="rows-per-page" className="font-medium">Rows per page:</label>
              <select
                id="rows-per-page"
                value={limit}
                onChange={handleLimitChange}
                disabled={isLoading}
                className="bg-surface border border-border-strong rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-text-muted w-full sm:w-auto justify-between sm:justify-end">
              <span className="font-medium text-text">
                {startItem}-{endItem} <span className="font-normal text-text-muted">of</span> {pagination.total}
              </span>
              
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 hover:bg-surface-secondary text-text-muted hover:text-text disabled:opacity-40 transition-colors flex-1 sm:flex-none justify-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === pagination.totalPages || isLoading}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 hover:bg-surface-secondary text-text-muted hover:text-text disabled:opacity-40 transition-colors flex-1 sm:flex-none justify-center"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingContact ? 'Edit Contact' : 'New Contact'}>
        <ContactForm key={editingContact ? editingContact._id : 'new-contact'} initialData={editingContact} onSuccess={handleCloseModal} onCancel={handleCloseModal} />
      </Modal>

      {/* View Profile Modal */}
      <Modal isOpen={!!viewingContact} onClose={() => setViewingContact(null)} title="Contact Profile">
        {viewingContact && (
          <div className="space-y-8">
            <div className="flex items-center gap-5 pb-6 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl shrink-0 border border-brand-500/20">
                {viewingContact.firstName.charAt(0)}{viewingContact.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-text flex items-center gap-2">
                  {viewingContact.firstName} {viewingContact.lastName}
                  {viewingContact.isFavorite && <Star className="w-5 h-5 fill-warning text-warning" />}
                </h3>
                {viewingContact.company && <p className="text-sm font-medium text-text-muted mt-1">{viewingContact.company}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5">Email Address</p>
                <p className="text-sm font-medium text-text break-all">{viewingContact.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5">Phone Number</p>
                <p className="text-sm font-medium text-text">{viewingContact.phoneNumber || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5">Category</p>
                {viewingContact.category ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-tertiary text-text-muted border border-border">
                    {viewingContact.category.name}
                  </span>
                ) : (
                  <span className="text-sm text-text-muted italic">Uncategorized</span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5">Date Added</p>
                <p className="text-sm font-medium text-text">
                  {new Date(viewingContact.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setViewingContact(null)} 
                className="bg-surface hover:bg-surface-secondary border-border hover:border-border-strong text-text transition-colors w-full sm:w-auto"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  const contact = viewingContact;
                  setViewingContact(null);
                  handleOpenEdit(contact);
                }} 
                className="bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white border-transparent transition-colors w-full sm:w-auto"
              >
                Edit Contact
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};