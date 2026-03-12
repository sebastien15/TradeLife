import { Tabs } from 'expo-router';
import { TabBar } from '@/components/layout/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Visible tabs — exactly 4 */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="money" />
      <Tabs.Screen name="ship" />
      <Tabs.Screen name="more" />
      {/* Hidden from tab bar */}
      <Tabs.Screen name="travel" options={{ href: null }} />
      <Tabs.Screen name="call" options={{ href: null }} />
    </Tabs>
  );
}
