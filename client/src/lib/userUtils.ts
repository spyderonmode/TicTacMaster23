// Utility functions for handling user data and display

export interface User {
  id?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  profileImageUrl?: string;
  isEmailVerified?: boolean;
  wins?: number;
  losses?: number;
  draws?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function getUserDisplayName(user: any): string {
  if (!user) return 'Anonymous';
  
  // Try different display name fields in order of preference
  return user.displayName || 
         user.username || 
         user.firstName || 
         `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
         user.email?.split('@')[0] ||
         'Anonymous';
}

export function getUserId(user: any): string | undefined {
  if (!user) return undefined;
  return user.userId || user.id;
}

export function isEmailVerified(user: any): boolean {
  if (!user) return false;
  // Default to true if isEmailVerified is not set (for backwards compatibility)
  return user.isEmailVerified !== false;
}

export function getUserInitials(user: any): string {
  const displayName = getUserDisplayName(user);
  
  if (user.firstName && user.lastName) {
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  }
  
  const nameParts = displayName.split(' ');
  if (nameParts.length >= 2) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
  
  return displayName.slice(0, 2).toUpperCase();
}

export function getUserStats(user: any) {
  if (!user) return { wins: 0, losses: 0, draws: 0 };
  
  return {
    wins: user.wins || 0,
    losses: user.losses || 0,
    draws: user.draws || 0,
  };
}