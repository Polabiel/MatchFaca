import { Pressable, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";

type NavRoute = "/swipe" | "/matches" | "/profile";

interface NavItemProps {
  href: NavRoute;
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}

function NavItem({ label, icon, isActive, onPress }: NavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center justify-center gap-0.5 py-2 ${
        isActive ? "border-t-2 border-[#DC2626]" : ""
      }`}
    >
      <Text
        className={`text-xl ${isActive ? "text-[#DC2626]" : "text-gray-500"}`}
      >
        {icon}
      </Text>
      <Text
        className={`text-[10px] ${
          isActive ? "font-semibold text-[#DC2626]" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const items: { href: NavRoute; label: string; icon: string }[] = [
    { href: "/swipe", label: "Swipe", icon: "🔥" },
    { href: "/matches", label: "Lutas", icon: "🤜" },
    { href: "/profile", label: "Perfil", icon: "👤" },
  ];

  return (
    <View className="flex-row border-t border-[#DC2626]/20 bg-[#0D0D0D] pb-2 pt-1">
      {items.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={pathname === item.href}
          onPress={() => router.push(item.href)}
        />
      ))}
    </View>
  );
}
