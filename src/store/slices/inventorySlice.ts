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

// Base Selectors
export const selectAllProducts = (state: RootState) => state.inventory.products;

export const selectActiveProducts = createSelector(
  [selectAllProducts],
  (products) => products.filter((product) => !product.isDisabled)
);

// Value Calculations
export const selectProductValue = (product: Product): number => {
  if (product.isDisabled) return 0;
  const price = getPriceInInt(product.price);
  return price * product.quantity;
};

// Derived Selectors
export const selectTotalValue = createSelector(
  [selectActiveProducts],
  (products: Product[]): number =>
    products.reduce((sum, product) => sum + selectProductValue(product), 0)
);

export const selectOutOfStockCount = createSelector(
  [selectActiveProducts],
  (products) => products.filter((product) => product.quantity === 0).length
);

export const selectCategoryCount = createSelector(
  [selectActiveProducts],
  (products) => new Set(products.map((product) => product.category)).size
);

export const selectLowStockProducts = createSelector(
  [selectActiveProducts],
  (products) => products.filter((product) => product.quantity <= 10)
);

export const selectInventoryStats = createSelector(
  [
    selectAllProducts,
    selectActiveProducts,
    selectTotalValue,
    selectOutOfStockCount,
    selectCategoryCount,
  ],
  (allProducts, activeProducts, totalValue, outOfStock, categories) => ({
    totalProducts: allProducts.length,
    activeProducts: activeProducts.length,
    disabledProducts: allProducts.length - activeProducts.length,
    totalValue: totalValue.toFixed(2),
    outOfStock,
    categories,
  })
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    toggleRole: (state: InventoryState) => {
      state.role = state.role === "admin" ? "user" : "admin";
    },
    setEditingProduct: (
      state: InventoryState,
      action: PayloadAction<Product>
    ) => {
      state.editingProduct = action.payload;
      state.isEditDialogOpen = true;
    },
    closeEditDialog: (state: InventoryState) => {
      state.editingProduct = null;
      state.isEditDialogOpen = false;
    },
    updateProduct: (state: InventoryState, action: PayloadAction<Product>) => {
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
    deleteProduct: (state: InventoryState, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    toggleProductStatus: (
      state: InventoryState,
      action: PayloadAction<string>
    ) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        product.isDisabled = !product.isDisabled;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state: InventoryState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state: InventoryState, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state: InventoryState, action) => {
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
