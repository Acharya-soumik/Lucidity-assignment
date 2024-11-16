// inventorySlice.ts
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "./store";
import { Product } from "@/types";

const getPriceInInt = (price: string | number): number => {
  if (typeof price === "string") {
    const cleanPrice = price.replace(/[^\d.]/g, "");
    return parseFloat(cleanPrice) || 0;
  }
  return price || 0;
};

interface RawProduct {
  name: string;
  category: string;
  price: string | number;
  quantity: string | number;
}

export interface InventoryState {
  products: Product[];
  role: "admin" | "user";
  editingProduct: Product | null;
  isEditDialogOpen: boolean;
  loading: boolean;
  error: string | null;
}

export const fetchProducts = createAsyncThunk<Product[], string>(
  "inventory/fetchProducts",
  async (endpoint: string) => {
    const response = await fetch(
      `https://dev-0tf0hinghgjl39z.api.raw-labs.com/${endpoint}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products: RawProduct[] = await response.json();
    return products.map((product) => ({
      ...product,
      id: product.name,
      quantity: Number(product.quantity),
      isDisabled: false,
    }));
  }
);

const initialState: InventoryState = {
  products: [],
  role: "admin",
  editingProduct: null,
  isEditDialogOpen: false,
  loading: false,
  error: null,
};

// Selectors
export const selectAllProducts = (state: RootState) => state.inventory.products;
export const selectProductById = (state: RootState, id: string) =>
  state.inventory.products.find((product) => product.id === id);

export const selectProductValue = (product: Product): number => {
  const price = getPriceInInt(product.price);
  return price * product.quantity;
};

export const selectTotalValue = createSelector(
  [selectAllProducts],
  (products: Product[]): number =>
    products.reduce((sum, product) => sum + selectProductValue(product), 0)
);

export const selectOutOfStockCount = createSelector(
  [selectAllProducts],
  (products) => products.filter((product) => product.quantity === 0).length
);

export const selectCategoryCount = createSelector(
  [selectAllProducts],
  (products) => new Set(products.map((product) => product.category)).size
);

export const selectLowStockProducts = createSelector(
  [selectAllProducts],
  (products) => products.filter((product) => product.quantity <= 10)
);

export const selectInventoryStats = createSelector(
  [
    selectAllProducts,
    selectTotalValue,
    selectOutOfStockCount,
    selectCategoryCount,
  ],
  (products, totalValue, outOfStock, categories) => ({
    totalProducts: products.length,
    totalValue: totalValue.toFixed(2),
    outOfStock,
    categories,
  })
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    toggleRole: (state) => {
      state.role = state.role === "admin" ? "user" : "admin";
    },
    setEditingProduct: (state, action: PayloadAction<Product>) => {
      state.editingProduct = action.payload;
      state.isEditDialogOpen = true;
    },
    closeEditDialog: (state) => {
      state.editingProduct = null;
      state.isEditDialogOpen = false;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const updatedProduct = {
        ...action.payload,
        quantity: Number(action.payload.quantity),
        price: getPriceInInt(action.payload.price),
      };
      const index = state.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      state.isEditDialogOpen = false;
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    toggleProductStatus: (state, action: PayloadAction<string>) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        product.isDisabled = !product.isDisabled;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const {
  toggleRole,
  setEditingProduct,
  closeEditDialog,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} = inventorySlice.actions;

export default inventorySlice.reducer;
