import baseConfig, { restrictEnvAccess } from "@matchfaca/eslint-config/base";
import nextjsConfig from "@matchfaca/eslint-config/nextjs";
import reactConfig from "@matchfaca/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
