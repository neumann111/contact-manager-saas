import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCategoryStore } from '../../store/categoryStore';
import { api } from '../../services/api';
import type { Contact } from '../../types';
import toast from 'react-hot-toast';
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
    fetchCategories(); // Ensure categories dropdown is populated
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
        toast.success('Contact updated');
      } else {
        await api.post('/contacts', payload);
        toast.success('Contact created');
      }
      onSuccess();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to save contact');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
        <Input label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} />
      </div>
      
      <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
      <Input label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
      <Input label="Company" name="company" value={formData.company} onChange={handleChange} />
      
      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="isFavorite"
          name="isFavorite"
          checked={formData.isFavorite}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <label htmlFor="isFavorite" className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Star className={`w-4 h-4 mr-1 ${formData.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}`} />
          Mark as Favorite
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
};