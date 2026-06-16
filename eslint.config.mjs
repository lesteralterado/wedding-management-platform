import nextJs from "eslint-config-next";

export default [
  ...nextJs.coreWebVitals,
  ...nextJs.typescript,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];