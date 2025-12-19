import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TableDensity = "comfortable" | "compact";

interface PreferencesState {
  sidebarCollapsed: boolean;
  tableDensity: TableDensity;
  lastGlobalSearch: string;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setTableDensity: (density: TableDensity) => void;
  setLastGlobalSearch: (value: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      tableDensity: "comfortable",
      lastGlobalSearch: "",

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTableDensity: (tableDensity) => set({ tableDensity }),
      setLastGlobalSearch: (lastGlobalSearch) => set({ lastGlobalSearch }),
    }),
    { name: "erpvilabella-preferences-v1" },
  ),
);

