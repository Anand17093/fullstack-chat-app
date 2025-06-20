import { create } from "zustand";

export const useThemeStore = create((set) => {
  const savedTheme = localStorage.getItem("chat-theme") || "coffee";
  if (!localStorage.getItem("chat-theme")) {
    localStorage.setItem("chat-theme", savedTheme);
  }

  return {
    theme: savedTheme,
    setTheme: (theme) => {
      localStorage.setItem("chat-theme", theme);
      set({ theme });
    },
  };
});
