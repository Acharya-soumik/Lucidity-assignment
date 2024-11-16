// inventorySlice.ts
import { InventoryState, Product } from "@/types/index";
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";

const getPriceInInt = (price: string | number) => {
  if (typeof price === "string") {
    const cleanPrice = price.replace(/[^\d.]/g, "");
    return parseFloat(cleanPrice) || 0;
  }
  return price || 0;
};

export const fetchProducts = createAsyncThunk(
  "inventory/fetchProducts",
  async (endpoint: string) => {
    const response = await fetch(
      `https://dev-0tf0hinghgjl39z.api.raw-labs.com/${endpoint}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    return products.map((product: Product) => ({
      ...product,
      isDisabled: false,
    }));
  }
);

const inventoryAdapter = createEntityAdapter<Product>({
  selectId: (product) => product.name,
});

const initialState = inventoryAdapter.getInitialState<
  Omit<InventoryState, "products">
>({
  role: "admin",
  editingProduct: null,
  isEditDialogOpen: false,
  loading: false,
  error: null,
});

export const {
  selectAll: selectAllProducts,
  selectTotal: selectTotalProducts,
} = inventoryAdapter.getSelectors((state) => state.inventory);

export const selectProductValue = (product: Product) => {
  const price = getPriceInInt(product.price);
  const quantity =
    typeof product.quantity === "string"
      ? parseInt(product.quantity)
      : product.quantity || 0;
  return price * quantity;
};
// Derived selectors
export const selectTotalValue = createSelector(
  [selectAllProducts],
  (products) =>
    products.reduce((sum, product) => {
      const price = getPriceInInt(product.price);
      const quantity =
        typeof product.quantity === "string"
          ? parseInt(product.quantity)
          : product.quantity || 0;
      return sum + price * quantity;
    }, 0)
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
    selectTotalProducts,
    selectTotalValue,
    selectOutOfStockCount,
    selectCategoryCount,
  ],
  (totalProducts, totalValue, outOfStock, categories) => ({
    totalProducts,
    totalValue: totalValue.toFixed(0),
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
      inventoryAdapter.updateOne(state, {
        id: action.payload.name,
        changes: action.payload,
      });
      state.isEditDialogOpen = false;
    },
    deleteProduct: inventoryAdapter.removeOne,
    toggleProductStatus: (state, action: PayloadAction<string>) => {
      const product = state.entities[action.payload];
      if (product) {
        inventoryAdapter.updateOne(state, {
          id: action.payload,
          changes: { isDisabled: !product.isDisabled },
        });
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
        inventoryAdapter.setAll(state, action.payload);
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
