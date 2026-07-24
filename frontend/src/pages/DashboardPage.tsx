import React, { useEffect } from 'react';
import { Users, Star, FolderKanban, UserPlus, History } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useContactStore } from '../store/contactStore';
import { Spinner } from '../components/ui/Spinner';

export const DashboardPage: React.FC = () => {
  const { stats, fetchStats, isStatsLoading } = useContactStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isStatsLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Contacts',
      value: stats.totalContacts,
      icon: Users,
      // Using /10 opacity creates a perfect tint on both light and dark surfaces automatically
      accent: 'text-brand-600 dark:text-brand-400 bg-brand-500/10',
    },
    {
      label: 'Favorites',
      value: stats.favoriteContacts,
      icon: Star,
      accent: 'text-warning bg-warning/10',
    },
    {
      label: 'Categories',
      value: stats.categorySummary.length,
      icon: FolderKanban,
      accent: 'text-accent bg-accent/10',
    },
    {
      label: 'Added Recently',
      value: stats.recentlyAdded.length,
      icon: UserPlus,
      accent: 'text-success bg-success/10',
    },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text">
          Dashboard
        </h1>
        <p className="mt-1 text-sm lg:text-base text-text-muted">
          Here's what's happening with your network today.
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <Card
            key={label}
            className="flex items-center gap-4 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow border-border bg-surface"
          >
            <div className={`p-3 lg:p-4 rounded-2xl shrink-0 ${accent}`}>
              <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide truncate">
                {label}
              </p>
              <h3 className="text-3xl lg:text-4xl font-bold text-text leading-none mt-1">
                {value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail row: categories, recently added, recently updated */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 lg:gap-6">
        
        {/* Categories Card */}
        <Card className="h-full p-6 lg:p-7 shadow-sm border-border bg-surface">
          <h3 className="font-semibold text-sm lg:text-base text-text flex items-center gap-2 mb-4">
            <FolderKanban className="w-4 h-4 lg:w-5 lg:h-5 text-text-muted opacity-70" />
            Categories
          </h3>
          {stats.categorySummary.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-6">No categories in use.</p>
          ) : (
            <div className="space-y-5">
              {stats.categorySummary.map((cat, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-text group-hover:text-brand-500 transition-colors truncate">
                      {cat.name}
                    </span>
                    <span className="text-text-muted font-medium shrink-0 ml-2">{cat.count}</span>
                  </div>
                  <div className="w-full bg-surface-tertiary rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((cat.count / stats.totalContacts) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recently Added Card */}
        <Card className="h-full p-6 lg:p-7 shadow-sm border-border bg-surface">
          <h3 className="font-semibold text-sm lg:text-base text-text flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 lg:w-5 lg:h-5 text-success" />
            Recently Added
          </h3>
          {stats.recentlyAdded.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-6">No contacts added yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {stats.recentlyAdded.map((contact) => (
                <div
                  key={`added-${contact._id}`}
                  className="py-3 flex items-center gap-3 hover:bg-surface-secondary rounded-lg px-2 transition-colors -mx-2 cursor-pointer"
                >
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-success/10 flex items-center justify-center text-success font-bold text-sm shrink-0 border border-success/20">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs lg:text-sm text-text-muted truncate">
                      {contact.email || 'No email provided'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recently Updated Card */}
        <Card className="h-full p-6 lg:p-7 shadow-sm border-border bg-surface">
          <h3 className="font-semibold text-sm lg:text-base text-text flex items-center gap-2 mb-4">
            <History className="w-4 h-4 lg:w-5 lg:h-5 text-warning" />
            Recently Updated
          </h3>
          {stats.recentlyUpdated.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-6">No contacts updated yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {stats.recentlyUpdated.map((contact) => (
                <div
                  key={`updated-${contact._id}`}
                  className="py-3 flex items-center gap-3 hover:bg-surface-secondary rounded-lg px-2 transition-colors -mx-2 cursor-pointer"
                >
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-warning/10 flex items-center justify-center text-warning font-bold text-sm shrink-0 border border-warning/20">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs lg:text-sm text-text-muted truncate">
                      {contact.email || 'No email provided'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};