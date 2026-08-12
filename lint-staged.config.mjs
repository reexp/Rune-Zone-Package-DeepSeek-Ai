export default {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{js,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,mdx,yml,yaml}": ["prettier --write"],
};
