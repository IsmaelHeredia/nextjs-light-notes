import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export type DatePreset =
  | "today"
  | "yesterday"
  | "week"
  | "month"
  | null;

export interface SearchState {
  text: string;
  preset: DatePreset;
  year?: number;
  from?: string;
  to?: string;
}

const initialState: SearchState = {
  text: "",
  preset: null,
  year: undefined,
  from: undefined,
  to: undefined,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<Partial<SearchState>>) {
      return { ...state, ...action.payload };
    },
    resetSearch() {
      return initialState;
    },
  },
});

export const { setSearch, resetSearch } = searchSlice.actions;
export const selectSearch = (state: RootState) => state.search;

export default searchSlice.reducer;