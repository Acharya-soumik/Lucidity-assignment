import * as React from "react";

// src/types/index.ts
export interface Product {
  category: string;
  name: string; // primary key
  price: string;
  quantity: number;
  value: string;
  isDisabled?: boolean;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export interface InventoryState {
  products: Product[];
  role: "admin" | "user";
  editingProduct: Product | null;
  isEditDialogOpen: boolean;
  loading: boolean;
  error: string | null;
}
