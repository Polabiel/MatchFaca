"use server";

import { signIn } from "@matchfaca/auth";

export async function signInWithDiscord() {
  await signIn("discord", { redirectTo: "/swipe" });
}
