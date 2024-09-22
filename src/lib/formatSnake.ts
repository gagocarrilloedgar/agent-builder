import { capitalize } from "./capitalize";

export const formatSnake = (str: string) => {
  return str
    .replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`)
    .replace(/^_/, " ");
};

export const formatName = (str?: string | null) => {
  if (!str) return "";

  return capitalize(formatSnake(str));
};
