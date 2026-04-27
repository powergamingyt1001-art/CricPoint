import { create } from "zustand";

export type AppView = "splash" | "dashboard" | "match-detail";
export type BottomTab = "home" | "match" | "ai" | "poll" | "more";
export type MatchTab = "info" | "scorecard" | "overs" | "commentary";
export type MatchFilter = "upcoming" | "complete";

interface CricPointState {
  currentView: AppView;
  activeTab: BottomTab;
  selectedMatchId: string | null;
  selectedMatchData: MatchBasic | null;
  matchPinned: boolean;
  matchFilter: MatchFilter;

  setView: (view: AppView) => void;
  setActiveTab: (tab: BottomTab) => void;
  selectMatch: (matchId: string, matchData: MatchBasic) => void;
  goBack: () => void;
  togglePin: () => void;
  setPin: (val: boolean) => void;
  setMatchFilter: (filter: MatchFilter) => void;
}

export interface MatchBasic {
  id: string;
  team1: string;
  team2: string;
  team1Short: string;
  team2Short: string;
  team1Score: string;
  team2Score: string;
  status: string;
  matchType: string;
  venue: string;
  isLive: boolean;
  team1Flag: string;
  team2Flag: string;
  currentOver?: string;
  battingTeam?: string;
}

export const useCricPointStore = create<CricPointState>((set) => ({
  currentView: "splash",
  activeTab: "home",
  selectedMatchId: null,
  selectedMatchData: null,
  matchPinned: false,
  matchFilter: "upcoming",

  setView: (view) => set({ currentView: view }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectMatch: (matchId, matchData) =>
    set({ selectedMatchId: matchId, selectedMatchData: matchData, currentView: "match-detail" }),
  goBack: () => set({ currentView: "dashboard", selectedMatchId: null, selectedMatchData: null }),
  togglePin: () => set((s) => ({ matchPinned: !s.matchPinned })),
  setPin: (val) => set({ matchPinned: val }),
  setMatchFilter: (filter) => set({ matchFilter: filter }),
}));
