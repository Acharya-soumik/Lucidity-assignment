// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "@/store/slices/inventorySlice";

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
