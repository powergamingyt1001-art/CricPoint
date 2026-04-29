import { create } from "zustand";

export type AppView = "splash" | "dashboard" | "match-detail";
export type BottomTab = "home" | "match" | "ai" | "poll" | "more";
export type MatchTab = "info" | "scorecard" | "overs" | "commentary";
export type MatchFilter = "upcoming" | "complete";
export type MenuDialog = "icc-ranking" | "ranking" | "settings" | "about" | null;

interface CricPointState {
  currentView: AppView;
  activeTab: BottomTab;
  selectedMatchId: string | null;
  selectedMatchData: MatchBasic | null;
  matchPinned: boolean;
  pinnedMatchId: string | null;
  matchFilter: MatchFilter;
  showPointTable: boolean;
  menuDialog: MenuDialog;

  setView: (view: AppView) => void;
  setActiveTab: (tab: BottomTab) => void;
  selectMatch: (matchId: string, matchData: MatchBasic) => void;
  goBack: () => void;
  togglePin: (matchId?: string) => void;
  setPin: (val: boolean) => void;
  setMatchFilter: (filter: MatchFilter) => void;
  setShowPointTable: (show: boolean) => void;
  setMenuDialog: (dialog: MenuDialog) => void;
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
  team1Img?: string;
  team2Img?: string;
  currentOver?: string;
  battingTeam?: string;
  matchStarted?: boolean;
  matchEnded?: boolean;
  tossWinner?: string;
  tossChoice?: string;
  date?: string;
}

export const useCricPointStore = create<CricPointState>((set) => ({
  currentView: "splash",
  activeTab: "home",
  selectedMatchId: null,
  selectedMatchData: null,
  matchPinned: false,
  pinnedMatchId: null,
  matchFilter: "upcoming",
  showPointTable: false,
  menuDialog: null,

  setView: (view) => set({ currentView: view }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectMatch: (matchId, matchData) =>
    set({ selectedMatchId: matchId, selectedMatchData: matchData, currentView: "match-detail" }),
  goBack: () => set({ currentView: "dashboard", selectedMatchId: null, selectedMatchData: null }),
  togglePin: (matchId) => set((s) => ({
    matchPinned: !s.matchPinned,
    pinnedMatchId: !s.matchPinned ? (matchId || s.pinnedMatchId) : null,
  })),
  setPin: (val) => set({ matchPinned: val, pinnedMatchId: val ? null : null }),
  setMatchFilter: (filter) => set({ matchFilter: filter }),
  setShowPointTable: (show) => set({ showPointTable: show }),
  setMenuDialog: (dialog) => set({ menuDialog: dialog }),
}));
