import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RouterInputs } from "@matchfaca/api";
import { trpc } from "~/utils/api";

// ─── Simple Icon Components (no emojis) ───────────────────

function IconSwords() {
  return (
    <View className="items-center justify-center">
      <View className="h-6 w-6 rotate-45 border-b-2 border-r-2 border-[#DC2626]" />
      <View className="-mt-1 h-6 w-6 -rotate-45 border-l-2 border-t-2 border-[#DC2626]" />
    </View>
  );
}

function IconPen() {
  return (
    <View className="items-center justify-center">
      <View className="h-6 w-0.5 rotate-12 rounded-full bg-[#DC2626]" />
      <View className="-ml-0.5 mt-1 h-1.5 w-1.5 rounded-full border border-[#DC2626]" />
    </View>
  );
}

function IconScale() {
  return (
    <View className="items-center justify-center">
      <View className="h-4 w-0.5 bg-[#DC2626]" />
      <View className="mt-0.5 h-2 w-4 rounded-sm border border-[#DC2626]" />
      <View className="mt-0.5 flex-row gap-2">
        <View className="h-1 w-3 rounded-sm bg-[#DC2626]" />
        <View className="h-1 w-3 rounded-sm bg-[#DC2626]" />
      </View>
    </View>
  );
}

function IconZap() {
  return (
    <View className="items-center justify-center">
      <View className="h-0 w-0 border-b-[10px] border-l-[5px] border-r-[5px] border-b-[#DC2626] border-l-transparent border-r-transparent" />
      <View className="mt-px h-0 w-0 border-t-[10px] border-l-[5px] border-r-[5px] border-t-[#DC2626] border-l-transparent border-r-transparent" />
    </View>
  );
}

function IconShield() {
  return (
    <View className="items-center justify-center">
      <View className="h-6 w-5 rounded-t-full border-2 border-[#DC2626] bg-[#DC2626]/10" />
      <View className="-mt-1 h-3 w-5 rounded-b-sm border-2 border-t-0 border-[#DC2626] bg-[#DC2626]/10" />
    </View>
  );
}

function IconFlame() {
  return (
    <View className="items-center justify-center">
      <View className="h-5 w-3 rounded-t-full bg-[#DC2626]" />
      <View className="h-3 w-4 rounded-b-full bg-[#DC2626]/60" />
    </View>
  );
}

function IconEye() {
  return (
    <View className="items-center justify-center">
      <View className="h-4 w-6 rounded-full border-2 border-[#DC2626]" />
      <View className="absolute h-2 w-2 rounded-full bg-[#DC2626]" />
    </View>
  );
}

function IconSkull() {
  return (
    <View className="items-center justify-center">
      <View className="h-6 w-5 rounded-sm border-2 border-[#DC2626] bg-[#DC2626]/10">
        <View className="mt-1 flex-row justify-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
          <View className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
        </View>
        <View className="mx-0.5 mt-0.5 h-1.5 rounded-sm border border-[#DC2626]" />
      </View>
    </View>
  );
}

function IconHand() {
  return (
    <View className="items-center justify-center">
      <View className="h-5 w-4 rounded-t-2xl border-2 border-[#DC2626] bg-[#DC2626]/10" />
      <View className="flex-row gap-px">
        <View className="h-2 w-2 rounded-full border border-[#DC2626]" />
        <View className="h-2 w-2 rounded-full border border-[#DC2626]" />
        <View className="h-2 w-2 rounded-full border border-[#DC2626]" />
        <View className="h-2 w-2 rounded-full border border-[#DC2626]" />
      </View>
    </View>
  );
}

function IconHelp() {
  return (
    <View className="items-center justify-center">
      <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-[#DC2626]">
        <Text className="text-xs font-bold text-[#DC2626]">?</Text>
      </View>
    </View>
  );
}

// ─── Icon mapping ─────────────────────────────────────────

const STYLE_ICONS: Record<string, React.ComponentType> = {
  boxe: IconHand,
  muay_thai: IconZap,
  jiu_jitsu: IconShield,
  mma: IconFlame,
  kickboxing: IconZap,
  capoeira: IconEye,
  karate: IconSwords,
  judô: IconShield,
  taekwondo: IconZap,
  luta_livre: IconSwords,
  vale_tudo: IconSkull,
  porrada_limpa: IconHand,
  outro: IconHelp,
};

// ─── Data ─────────────────────────────────────────────────

const STYLE_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: "boxe", label: "Boxe", icon: "boxe" },
  { value: "muay_thai", label: "Muay Thai", icon: "muay_thai" },
  { value: "jiu_jitsu", label: "Jiu-Jitsu", icon: "jiu_jitsu" },
  { value: "mma", label: "MMA", icon: "mma" },
  { value: "kickboxing", label: "Kickboxing", icon: "kickboxing" },
  { value: "capoeira", label: "Capoeira", icon: "capoeira" },
  { value: "karate", label: "Caratê", icon: "karate" },
  { value: "judô", label: "Judô", icon: "judô" },
  { value: "taekwondo", label: "Taekwondo", icon: "taekwondo" },
  { value: "luta_livre", label: "Luta Livre", icon: "luta_livre" },
  { value: "vale_tudo", label: "Vale-Tudo", icon: "vale_tudo" },
  { value: "porrada_limpa", label: "Porrada Limpa", icon: "porrada_limpa" },
  { value: "outro", label: "Outro", icon: "outro" },
];

const WEIGHT_OPTIONS = [
  { value: "", label: "Não informar" },
  { value: "até_66kg", label: "Até 66kg" },
  { value: "até_77kg", label: "Até 77kg" },
  { value: "até_93kg", label: "Até 93kg" },
  { value: "acima_93kg", label: "+93kg" },
];

// ─── Onboarding Screen ───────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [fightingStyle, setFightingStyle] = useState("");
  const [weightClass, setWeightClass] = useState("");
  const [error, setError] = useState<string | null>(null);

  const saveProfile = useMutation(
    trpc.profile.upsert.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.profile.pathFilter() as never,
        );
        router.replace("/");
      },
      onError: (err) => {
        setError(err.message);
      },
    }),
  );

  const handleSkip = useCallback(() => {
    router.replace("/");
  }, [router]);

  const handleSubmit = useCallback(() => {
    if (!nickname.trim() || nickname.trim().length < 2) {
      setError("Apelido precisa ter pelo menos 2 caracteres");
      return;
    }
    if (!fightingStyle) {
      setError("Selecione um estilo de luta");
      return;
    }
    setError(null);

    type UpsertInput = RouterInputs["profile"]["upsert"];
    const payload: UpsertInput = {
      nickname: nickname.trim(),
      fightingStyle: fightingStyle as UpsertInput["fightingStyle"],
      weightClass: weightClass
        ? (weightClass as UpsertInput["weightClass"])
        : undefined,
    };
    saveProfile.mutate(payload);
  }, [nickname, fightingStyle, weightClass, saveProfile]);

  const renderStyleIcon = (styleValue: string) => {
    const IconComponent = STYLE_ICONS[styleValue] ?? IconHelp;
    return <IconComponent />;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <Stack.Screen
        options={{
          title: "Criar Perfil",
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTitleStyle: { color: "#DC2626", fontWeight: "bold" },
          headerTintColor: "#DC2626",
          headerRight: () => (
            <Pressable onPress={handleSkip} className="mr-2">
              <Text className="text-sm text-gray-500">Pular</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pb-10 pt-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Step indicator */}
        <View className="mb-8 flex-row items-center justify-center gap-2">
          {[0, 1, 2].map((s) => (
            <React.Fragment key={s}>
              <View
                className={`size-8 items-center justify-center rounded-full ${
                  s <= step
                    ? "bg-[#DC2626]"
                    : "border border-gray-700 bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    s <= step ? "text-white" : "text-gray-500"
                  }`}
                >
                  {s + 1}
                </Text>
              </View>
              {s < 2 && (
                <View
                  className={`h-px w-8 ${
                    s < step ? "bg-[#DC2626]" : "bg-gray-800"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Step 0: Nickname */}
        {step === 0 && (
          <View className="gap-6">
            <View className="items-center">
              <View className="mb-4 size-20 items-center justify-center rounded-full border-2 border-[#DC2626]/20 bg-[#DC2626]/5">
                <IconPen />
              </View>
              <Text className="text-center text-xl font-bold text-white">
                Qual seu apelido de luta?
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                É assim que os outros vão te chamar
              </Text>
            </View>

            <TextInput
              autoFocus
              value={nickname}
              onChangeText={(t) => {
                setNickname(t);
                setError(null);
              }}
              placeholder="Ex: Faca, Brutamontes..."
              placeholderTextColor="#555"
              maxLength={60}
              className="h-14 rounded-xl border border-gray-800 bg-gray-900 px-4 text-center text-lg font-bold text-white"
              onSubmitEditing={() => {
                if (nickname.trim().length >= 2) setStep(1);
              }}
            />

            <Text className="text-center text-xs text-gray-600">
              {nickname.length}/60
            </Text>
          </View>
        )}

        {/* Step 1: Fighting Style */}
        {step === 1 && (
          <View className="gap-6">
            <View className="items-center">
              <View className="mb-4 size-20 items-center justify-center rounded-full border-2 border-[#DC2626]/20 bg-[#DC2626]/5">
                <IconSwords />
              </View>
              <Text className="text-center text-xl font-bold text-white">
                Qual sua arte marcial?
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Seu estilo principal de luta
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {STYLE_OPTIONS.map((style) => {
                const isSelected = fightingStyle === style.value;
                return (
                  <Pressable
                    key={style.value}
                    onPress={() => {
                      setFightingStyle(style.value);
                      setError(null);
                    }}
                    className={`rounded-xl border p-3 ${
                      isSelected
                        ? "border-[#DC2626]/50 bg-[#DC2626]/10"
                        : "border-gray-800 bg-gray-900"
                    }`}
                    style={{ width: "47%" }}
                  >
                    <View className="mb-1 items-center">
                      {renderStyleIcon(style.icon)}
                    </View>
                    <Text
                      className={`text-center text-sm font-medium ${
                        isSelected ? "text-[#DC2626]" : "text-gray-400"
                      }`}
                    >
                      {style.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Weight Class */}
        {step === 2 && (
          <View className="gap-6">
            <View className="items-center">
              <View className="mb-4 size-20 items-center justify-center rounded-full border-2 border-[#DC2626]/20 bg-[#DC2626]/5">
                <IconScale />
              </View>
              <Text className="text-center text-xl font-bold text-white">
                Quase lá!
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Sua categoria de peso (opcional)
              </Text>
            </View>

            {/* Preview card */}
            <View className="flex-row items-center gap-3 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-4">
              <View className="size-12 items-center justify-center rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
                <Text className="text-lg font-bold text-[#DC2626]">
                  {nickname.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="font-bold text-white">{nickname}</Text>
                <Text className="text-sm text-gray-400">
                  {
                    STYLE_OPTIONS.find((s) => s.value === fightingStyle)
                      ?.label
                  }
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {WEIGHT_OPTIONS.map((opt) => {
                const isSelected =
                  opt.value === "" ? !weightClass : weightClass === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setWeightClass(opt.value)}
                    className={`rounded-xl border p-4 ${
                      isSelected
                        ? "border-[#DC2626]/40 bg-[#DC2626]/10"
                        : "border-gray-800 bg-gray-900"
                    }`}
                    style={{ width: "47%" }}
                  >
                    <Text
                      className={`text-center text-sm ${
                        isSelected
                          ? "font-semibold text-[#DC2626]"
                          : "text-gray-400"
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Error */}
        {error && (
          <View className="mt-6 rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 px-4 py-3">
            <Text className="text-center text-sm text-[#DC2626]">
              {error}
            </Text>
          </View>
        )}

        {/* Navigation buttons */}
        <View className="mt-8 flex-row gap-3">
          {step === 0 ? (
            <Pressable
              onPress={handleSkip}
              className="flex-1 items-center rounded-xl py-3"
            >
              <Text className="text-sm text-gray-500">Pular</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setStep((s) => s - 1);
                setError(null);
              }}
              className="flex-1 items-center rounded-xl border border-gray-800 py-3"
            >
              <Text className="text-sm text-gray-400">Voltar</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              if (step < 2) {
                const canProceed =
                  step === 0
                    ? nickname.trim().length >= 2
                    : step === 1
                      ? fightingStyle !== ""
                      : true;
                if (canProceed) {
                  setStep((s) => s + 1);
                  setError(null);
                } else {
                  setError(
                    step === 0
                      ? "Digite um apelido com pelo menos 2 caracteres"
                      : "Selecione um estilo de luta",
                  );
                }
              } else {
                handleSubmit();
              }
            }}
            className={`flex-1 items-center rounded-xl py-3 ${
              saveProfile.isPending ? "bg-[#DC2626]/50" : "bg-[#DC2626]"
            }`}
          >
            {saveProfile.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-sm font-bold text-white">
                {step < 2 ? "Continuar" : "Finalizar"}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
