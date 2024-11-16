import { configureStore } from "@reduxjs/toolkit";
import inventorySlice, { InventoryState } from "./inventorySlice";

export const store = configureStore({
  reducer: {
    inventory: inventorySlice,
  },
});

export type RootState = {
  inventory: InventoryState;
};
export type AppDispatch = typeof store.dispatch;
