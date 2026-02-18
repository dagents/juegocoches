export const APP_NAME = "JuegoCoches";
export const APP_DESCRIPTION =
  "Plataforma comunitaria de votación de ideas. Propón, vota, transforma.";

export const IDEA_MIN_LENGTH = 10;
export const IDEA_MAX_LENGTH = 500;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 50;

export const CATEGORIES = [
  "transporte",
  "urbanismo",
  "medioambiente",
  "comunidad",
  "otro",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const GAME_TITLE_MIN_LENGTH = 3;
export const GAME_TITLE_MAX_LENGTH = 100;
export const GAME_DESCRIPTION_MIN_LENGTH = 10;
export const GAME_DESCRIPTION_MAX_LENGTH = 500;
