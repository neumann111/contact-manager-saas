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

  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);
    try { await updateProfile(profileData); } 
    catch { /* Handled in store */ } 
    finally { setIsProfileSaving(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsPasswordSaving(true);
    try {
      await updatePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } 
    catch { /* Handled in store */ } 
    finally { setIsPasswordSaving(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('File size must be less than 2MB'); return; }
    
    setIsUploading(true);
    try { await uploadAvatar(file); } 
    catch { /* Handled in store */ } 
    finally { setIsUploading(false); }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text">Profile Settings</h1>
        <p className="text-sm lg:text-base text-text-muted mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Identity Card */}
        <Card className="p-6 border-border bg-surface shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div
              role="button"
              tabIndex={0}
              aria-label="Change profile photo"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className="relative group cursor-pointer shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-md" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border-4 border-surface shadow-md">
                  <UserIcon className="w-10 h-10" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center">
                {isUploading ? <Loader2 className="w-7 h-7 text-white animate-spin" /> : <Camera className="w-7 h-7 text-white" />}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-text">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-text-muted mt-0.5">
                {user.email}
              </p>
              <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary border border-border text-text-muted shadow-sm capitalize">
                {user.role} Account
              </span>
            </div>
          </div>
        </Card>

        {/* Forms Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* General Information Form */}
          <Card className="p-6 shadow-sm border-border bg-surface flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
                <div className="p-2 bg-brand-500/10 border border-brand-500/20 rounded-lg">
                  <UserIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-base font-bold text-text">General Information</h3>
              </div>
              <form onSubmit={handleProfileSubmit} id="profile-form" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </form>
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t border-border/50">
              <Button 
                type="submit" 
                form="profile-form"
                isLoading={isProfileSaving}
              >
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Security Form */}
          <Card className="p-6 shadow-sm border-border bg-surface flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
                <div className="p-2 bg-warning/10 border border-warning/20 rounded-lg">
                  <Shield className="w-5 h-5 text-warning" />
                </div>
                <h3 className="text-base font-bold text-text">Security</h3>
              </div>
              <form onSubmit={handlePasswordSubmit} id="password-form" className="space-y-4">
                <Input 
                  label="Current Password" 
                  type="password" 
                  value={passwordData.currentPassword} 
                  onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} 
                  required 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </form>
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t border-border/50">
              <Button 
                type="submit" 
                form="password-form"
                variant="secondary" 
                isLoading={isPasswordSaving}
              >
                Update Password
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};