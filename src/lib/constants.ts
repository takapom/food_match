// Application constants

export const APP_NAME = "Food Matching";
export const APP_DESCRIPTION = "Find your perfect food match";

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
  },
  FOOD: {
    LIST: "/api/food",
    DETAIL: "/api/food/[id]",
    MATCH: "/api/food/match",
  },
} as const;

export const FOOD_CATEGORIES = [
  "Japanese",
  "Italian",
  "Chinese",
  "American",
  "Mexican",
  "Thai",
  "Indian",
  "French",
  "Korean",
  "Other",
] as const;

export type FoodCategory = typeof FOOD_CATEGORIES[number];