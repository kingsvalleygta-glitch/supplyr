import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import { colors, spacing } from "@/lib/theme";

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  style,
  variant = "primary",
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        isPrimary && styles.primary,
        variant === "secondary" && styles.secondary,
        isGhost && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.accentFg : colors.ink} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary && styles.labelPrimary,
            isGhost && styles.labelGhost,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.navy },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  disabled: { opacity: 0.5 },
  label: { fontSize: 15, fontWeight: "800", color: colors.white },
  labelPrimary: { color: colors.accentFg },
  labelGhost: { color: colors.ink },
});
