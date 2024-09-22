import { capitalize } from "./capitalize";

export const formatSnake = (str: string) => {
  return str.toLocaleLowerCase().replace(/_/g, " ");
};

export const formatName = (str?: string | null) => {
  if (!str) return "";

  return capitalize(formatSnake(str));
};
