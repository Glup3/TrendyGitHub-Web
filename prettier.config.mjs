/** @type {import('prettier').Config} */
const config = {
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'all',
  bracketSameLine: false,
  semi: false,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
}

export default config
