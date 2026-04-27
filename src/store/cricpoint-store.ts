import { create } from "zustand";

export type AppView = "splash" | "dashboard" | "match-detail";
export type BottomTab = "home" | "pin" | "point-table" | "ai-chat";
export type MatchTab = "info" | "scorecard" | "overs" | "commentary";

interface CricPointState {
  currentView: AppView;
  activeTab: BottomTab;
  selectedMatchId: string | null;
  selectedMatchData: MatchBasic | null;
  pinnedMatchId: string | null;

  setView: (view: AppView) => void;
  setActiveTab: (tab: BottomTab) => void;
  selectMatch: (matchId: string, matchData: MatchBasic) => void;
  goBack: () => void;
  pinMatch: (matchId: string | null) => void;
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
  pinnedMatchId: null,

  setView: (view) => set({ currentView: view }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectMatch: (matchId, matchData) =>
    set({ selectedMatchId: matchId, selectedMatchData: matchData, currentView: "match-detail" }),
  goBack: () => set({ currentView: "dashboard", selectedMatchId: null, selectedMatchData: null }),
  pinMatch: (matchId) => set({ pinnedMatchId: matchId }),
}));
