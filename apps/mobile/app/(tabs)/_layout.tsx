import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useCart } from "@/context/CartContext";
import { colors } from "@/lib/theme";

function TabIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const { count } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: "#9a9aa3",
        tabBarStyle: {
          backgroundColor: colors.navy,
          borderTopColor: colors.navySoft,
        },
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "800" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon name="home" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => (
            <TabIcon name="search" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge: count > 0 ? count : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.accent,
            color: colors.accentFg,
            fontWeight: "800",
          },
          tabBarIcon: ({ color }) => (
            <TabIcon name="shopping-cart" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="pro"
        options={{
          title: "Pro",
          tabBarIcon: ({ color }) => (
            <TabIcon name="briefcase" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Estimate",
          tabBarIcon: ({ color }) => (
            <TabIcon name="calculator" color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
