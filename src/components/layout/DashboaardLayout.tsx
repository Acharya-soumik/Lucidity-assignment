import { useEffect } from "react";
import { StatsCards } from "../dashboard/StatsCard";
import { EditProductDialog } from "../products/EditProductDialog";
import { ProductTable } from "../products/ProductTable";
import { Header } from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { SkeletonCard } from "./SkeletonCard";
import { fetchProducts } from "@/store/slices/inventorySlice";
import { AppDispatch, RootState } from "@/store/slices/store";

const DashboardLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const inventoryState = useSelector((state: RootState) => state.inventory);

  useEffect(() => {
    dispatch(fetchProducts("inventory"));
  }, []);

  const { loading: isLoadingProducts, error } = inventoryState;

  return (
    <div className="container mx-auto p-4">
      <Header />
      <StatsCards />
      <EditProductDialog />
      {isLoadingProducts ? (
        <SkeletonCard />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ProductTable />
      )}
    </div>
  );
};

export default DashboardLayout;
