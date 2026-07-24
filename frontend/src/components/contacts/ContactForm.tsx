import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCategoryStore } from '../../store/categoryStore';
import { api } from '../../services/api';
import type { Contact } from '../../types';
import { showToast } from '../../utils/showToast';
import { isAxiosError } from 'axios';
import { Star } from 'lucide-react';

interface ContactFormProps {
  initialData?: Contact | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { categories, fetchCategories } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    company: initialData?.company || '',
    category: initialData?.category?._id || '',
    isFavorite: initialData?.isFavorite || false,
  });

  useEffect(() => {
    fetchCategories(); 
  }, [fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        category: formData.category || null, 
      };

      if (initialData) {
        await api.put(`/contacts/${initialData._id}`, payload);
        showToast.success('Contact updated');
      } else {
        await api.post('/contacts', payload);
        showToast.success('Contact created');
      }
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        showToast.error(error.response?.data?.message || 'Failed to save contact');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input 
          label="First Name" 
          name="firstName" 
          required 
          value={formData.firstName} 
          onChange={handleChange} 
          className="bg-surface border-border focus:border-brand-500"
        />
        <Input 
          label="Last Name" 
          name="lastName" 
          required 
          value={formData.lastName} 
          onChange={handleChange} 
          className="bg-surface border-border focus:border-brand-500"
        />
      </div>
      
      <Input 
        label="Email Address" 
        name="email" 
        type="email" 
        value={formData.email} 
        onChange={handleChange} 
        className="bg-surface border-border focus:border-brand-500"
      />
      <Input 
        label="Phone Number" 
        name="phoneNumber" 
        type="tel" 
        value={formData.phoneNumber} 
        onChange={handleChange} 
        className="bg-surface border-border focus:border-brand-500"
      />
      <Input 
        label="Company" 
        name="company" 
        value={formData.company} 
        onChange={handleChange} 
        className="bg-surface border-border focus:border-brand-500"
      />
      
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="block w-full rounded-xl border border-border bg-surface text-text px-3 py-2.5 text-sm shadow-sm transition-colors hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 cursor-pointer"
        >
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center mt-3">
        <input
          type="checkbox"
          id="isFavorite"
          name="isFavorite"
          checked={formData.isFavorite}
          onChange={handleChange}
          className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500/50 cursor-pointer"
        />
        <label htmlFor="isFavorite" className="ml-2 flex items-center text-sm text-text font-medium cursor-pointer">
          <Star className={`w-4 h-4 mr-1.5 ${formData.isFavorite ? 'fill-warning text-warning' : 'text-text-muted'}`} />
          Mark as Favorite
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="hover:bg-surface-secondary text-text-muted hover:text-text transition-colors"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          className="bg-brand-600 hover:bg-brand-500 text-white border-transparent shadow-sm"
        >
          {initialData ? 'Save Changes' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
};