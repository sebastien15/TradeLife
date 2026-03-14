import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Screen } from '@/components/layout/Screen';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/hooks/useTheme';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/constants/typography';
import { useNotificationStore } from '@/stores/notificationStore';

interface ServiceItem {
  id: string;
  title: string;
  icon: string; // MaterialIcons name
  route: string;
  comingSoon?: boolean;
}

interface TravelTip {
  id: string;
  title: string;
  category: 'GEAR' | 'FINANCE' | 'LEGAL';
  imageUrl: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'visa',
    title: 'travel.hub.visa',
    icon: 'contract', // MaterialIcons — contract/document icon
    route: '/travel/visa/step-1-docs',
  },
  {
    id: 'flights',
    title: 'travel.hub.flights',
    icon: 'flight_takeoff', // MaterialIcons — underscore not hyphen
    route: '/travel/flights/search',
  },
  {
    id: 'hotels',
    title: 'travel.hub.hotels',
    icon: 'hotel', // MaterialIcons
    route: '/travel/hotels',
    comingSoon: true,
  },
  {
    id: 'inspector',
    title: 'travel.hub.inspector',
    icon: 'verified_user', // MaterialIcons — underscore not hyphen
    route: '/travel/inspector',
    comingSoon: true,
  },
];

const TRAVEL_TIPS: TravelTip[] = [
  {
    id: '1',
    title: 'Essential Packing List for 2024 Travels',
    category: 'GEAR',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
  },
  {
    id: '2',
    title: 'Best Ways to Exchange Currency without Fees',
    category: 'FINANCE',
    imageUrl: 'https://images.unsplash.com/photo-1554224311-beee460201b4?w=400',
  },
  {
    id: '3',
    title: 'Updated Visa Requirements for EU Countries',
    category: 'LEGAL',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
  },
];

export default function TravelScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const { t } = useTranslation();
  const { unreadCount } = useNotificationStore();

  const renderTravelTip = ({ item }: { item: TravelTip }) => (
    <Pressable
      key={item.id}
      className="mr-4 rounded-xl overflow-hidden"
      style={{
        width: 280,
        height: 160,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      {/* Background Image */}
      <Image
        source={{ uri: item.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View className="absolute bottom-0 left-0 right-0 p-4">
        {/* Category Badge */}
        <View className="mb-2">
          <View className="self-start px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <Text
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: theme.primary }}
            >
              {item.category}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-white font-bold leading-snug">
          {item.title}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <Screen scroll>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable>
            <MaterialIcons name="menu" size={24} color={theme.primary} />
          </Pressable>
          <Text style={{ ...Typography.h2, color: theme.textPrimary }}>
            Travel
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <Pressable className="relative p-1">
            <Ionicons name="notifications-outline" size={24} color={theme.textSecondary} />
            {unreadCount > 0 && (
              <View
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.error }}
              />
            )}
          </Pressable>
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.primary + '1a' }}
          >
            <Avatar size="sm" />
          </View>
        </View>
      </View>

      {/* Hero Banner */}
      <View className="px-4 pt-6">
        <View className="h-48 rounded-xl overflow-hidden relative" style={{ backgroundColor: theme.primary }}>
          {/* Airplane Background Image */}
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Ed_3lkqxp8KNTEjpf6E0CC64dR_be9tIBU4FTlC8TfuV-I4g4M6RQWX7k7uQYskgYHD1xyyXD_tOfEBPGAc8wET87Uaf7iSQ3297YgQK5QThKqFzohFhmLriO6Ay0K68MMeLZqj9gm1bTB9xfv8wwfXpqTo5k3-UIRqAgFgWPhOXWI9nBna2uMz1X5sZ8jOcvMlEVvDZ2BJKDR-ZxzbHdMQm3ugV-29gULa7Gww-E48j1xYHlFq7X-PeEAJnmvzPI1pnNGAhjSM'
            }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            placeholder={{ blurhash: 'L6B}7M~q00Rk-;IUofWBD%j[M{of' }}
          />

          {/* Teal Overlay (matches opacity-40 from design) */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: theme.primary,
                opacity: 0.4
              }
            ]}
          />

          {/* AI Badge */}
          <View
            className="absolute top-4 right-4 flex-row items-center gap-2 px-3 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <MaterialIcons name="auto-awesome" size={12} color="white" />
            <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
              AI POWERED
            </Text>
          </View>

          {/* Content - Bottom Left */}
          <View className="absolute bottom-0 left-0 right-0 p-6">
            <Text className="text-2xl font-bold text-white mb-1">
              {t('travel.hub.title')}
            </Text>
            <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {t('travel.hub.subtitle')}
            </Text>
          </View>
        </View>
      </View>

      {/* Service Grid */}
      <View className="px-4 py-8">
        <Text style={{ ...Typography.h3, color: theme.textPrimary, marginBottom: 16 }}>
          {t('travel.hub.services')}
        </Text>
        <View className="flex-row flex-wrap gap-4">
          {SERVICES.map((service) => (
            <Pressable
              key={service.id}
              className="flex-1 min-w-[160px] p-5 rounded-xl items-center gap-3 relative"
              style={{
                backgroundColor: service.comingSoon ? theme.surface2 : theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                opacity: service.comingSoon ? 0.6 : 1,
              }}
              onPress={() => {
                if (!service.comingSoon) {
                  router.push(service.route as any);
                }
              }}
              disabled={service.comingSoon}
            >
              {/* SOON Badge */}
              {service.comingSoon && (
                <View
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Text className="text-[9px] font-bold text-white uppercase">
                    SOON
                  </Text>
                </View>
              )}

              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: service.comingSoon
                    ? theme.textSecondary + '20'
                    : theme.primary + '1a',
                }}
              >
                <MaterialIcons
                  name={service.icon as any}
                  size={24}
                  color={service.comingSoon ? theme.textSecondary : theme.primary}
                />
              </View>
              <Text
                className="text-sm font-semibold text-center"
                style={{ color: theme.textPrimary }}
              >
                {t(service.title)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Travel Tips */}
      <View className="py-4 pb-8">
        <View className="flex-row items-center justify-between px-4 mb-4">
          <Text style={{ ...Typography.h3, color: theme.textPrimary }}>
            {t('travel.hub.tips')}
          </Text>
          <Pressable>
            <Text className="text-sm font-semibold" style={{ color: theme.primary }}>
              {t('common.viewAll')}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={TRAVEL_TIPS}
          renderItem={renderTravelTip}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </Screen>
  );
}
