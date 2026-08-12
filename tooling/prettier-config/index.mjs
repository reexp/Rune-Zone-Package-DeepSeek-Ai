/**
 * Shared Prettier config untuk seluruh workspace RuneZone.
 */
export default {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
  arrowParens: "always",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.md",
      options: { proseWrap: "preserve" },
    },
  ],
};
