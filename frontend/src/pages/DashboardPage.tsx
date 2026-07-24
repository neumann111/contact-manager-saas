import React, { useEffect } from 'react';
import { Users, Star, Clock, FolderKanban } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useContactStore } from '../store/contactStore';

export const DashboardPage: React.FC = () => {
  const { stats, isStatsLoading, fetchStats } = useContactStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isStatsLoading || !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center p-4">
          <div className="p-3 bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 rounded-lg mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contacts</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContacts}</h3>
          </div>
        </Card>

        <Card className="flex items-center p-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg mr-4">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorites</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favoriteContacts}</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contacts Lists */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Recently Added</h3>
            </div>
            {stats.recentlyAdded.length === 0 ? (
              <p className="text-gray-500 text-sm">No contacts added yet.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {stats.recentlyAdded.map((contact) => (
                  <div key={contact._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold mr-3">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.firstName} {contact.lastName}
                        </p>
                        {contact.email && <p className="text-xs text-gray-500">{contact.email}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center mb-4">
              <FolderKanban className="w-5 h-5 mr-2 text-gray-500" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Categories</h3>
            </div>
            {stats.categorySummary.length === 0 ? (
              <p className="text-gray-500 text-sm">No categories in use.</p>
            ) : (
              <div className="space-y-4">
                {stats.categorySummary.map((cat, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                      <span className="text-gray-500">{cat.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-brand-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((cat.count / stats.totalContacts) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};