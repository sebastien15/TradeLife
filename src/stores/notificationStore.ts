import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Notification } from '@/types/domain.types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),

      addNotification: (notification) =>
        set((state) => {
          const newNotifications = [notification, ...state.notifications];
          return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter((n) => !n.isRead).length,
          };
        }),

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.isRead).length,
          };
        }),

      markAllAsRead: () =>
        set((state) => {
          const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
          return {
            notifications: updated,
            unreadCount: 0,
          };
        }),

      deleteNotification: (id) =>
        set((state) => {
          const filtered = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: filtered,
            unreadCount: filtered.filter((n) => !n.isRead).length,
          };
        }),

      clearAll: () =>
        set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'tradelife-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
