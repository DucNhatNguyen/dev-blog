const THEME_KEY = "dev-notes-theme";
const THEME_CHANGE_EVENT = "dev-notes-theme-change";

export function getThemeSnapshot() {
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  return savedTheme
    ? savedTheme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getServerThemeSnapshot() {
  return false;
}

export function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

export function setThemePreference(dark: boolean) {
  window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  document.documentElement.classList.toggle("dark", dark);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
