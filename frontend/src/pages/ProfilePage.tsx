import React, { useState, useRef } from 'react';
import { Camera, User as UserIcon, Shield, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, updatePassword, uploadAvatar } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar State
  const [isUploading, setIsUploading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);
    try {
      await updateProfile(profileData);
    } catch {
      // Error handled by store
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsPasswordSaving(true);
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      // Clear form on success
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      // Error handled by store
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      await uploadAvatar(file);
    } catch {
      // Error handled by store
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="flex flex-col items-center p-6 text-center">
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isUploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white" />}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 capitalize">
              {user.role} Account
            </span>
          </Card>
        </div>

        {/* RIGHT COLUMN: Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Info Form */}
          <Card>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Information</h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="First Name" 
                  value={profileData.firstName} 
                  onChange={(e) => setProfileData(p => ({ ...p, firstName: e.target.value }))}
                  required 
                />
                <Input 
                  label="Last Name" 
                  value={profileData.lastName} 
                  onChange={(e) => setProfileData(p => ({ ...p, lastName: e.target.value }))}
                  required 
                />
              </div>
              <Input 
                label="Email Address" 
                type="email" 
                value={profileData.email} 
                onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                required 
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isProfileSaving}>Save Changes</Button>
              </div>
            </form>
          </Card>

          {/* Security Form */}
          <Card>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <Shield className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input 
                label="Current Password" 
                type="password" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="New Password" 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                  required 
                  minLength={8}
                />
                <Input 
                  label="Confirm New Password" 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                  required 
                  minLength={8}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" isLoading={isPasswordSaving}>Update Password</Button>
              </div>
            </form>
          </Card>

        </div>
      </div>
    </div>
  );
};