import { Category } from "../types";
import { DEFAULT_CATEGORIES } from "../constants";

export interface AppState {
  categories: Category[];
  backgroundImage: string | null;
  logoText: string;
  logoImage: string | null;
}

const API_URL = "/api/sync";

export const loadData = async (): Promise<AppState | null> => {
  try {
    const response = await fetch(API_URL);
    if (response.status === 404) {
      return null; // No data found, use defaults
    }
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.warn("Failed to load from KV, falling back to local defaults:", error);
    return null;
  }
};

export const saveData = async (data: AppState): Promise<boolean> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to save to KV:", error);
    return false;
  }
};