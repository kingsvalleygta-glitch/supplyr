import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "@/context/CartContext";
import { colors } from "@/lib/theme";

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: colors.accent,
          headerTitleStyle: { fontWeight: "800", color: colors.white },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[slug]" options={{ title: "Product" }} />
        <Stack.Screen name="category/[slug]" options={{ title: "Category" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        <Stack.Screen name="orders/[id]/index" options={{ title: "Order" }} />
        <Stack.Screen
          name="orders/[id]/track"
          options={{ title: "Live tracking" }}
        />
      </Stack>
    </CartProvider>
  );
}
