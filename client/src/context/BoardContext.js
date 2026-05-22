import { create } from "zustand";
import { 
  createSocketSlice, 
  createBoardSlice, 
  createListSlice, 
  createCardSlice, 
  createTrashSlice, 
  createCollaborationSlice 
} from "./slices/index.js";

export const useBoardStore = create((set, get) => ({
  ...createSocketSlice(set, get),
  ...createBoardSlice(set, get),
  ...createListSlice(set, get),
  ...createCardSlice(set, get),
  ...createTrashSlice(set, get),
  ...createCollaborationSlice(set, get),
}));