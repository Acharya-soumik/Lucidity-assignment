import { useEffect } from "react";
import { StatsCards } from "../dashboard/StatsCard";
import { EditProductDialog } from "../products/EditProductDialog";
import { ProductTable } from "../products/ProductTable";
import { Header } from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/inventorySlice";
import { SkeletonCard } from "./SkeletonCard";
import { InventoryState } from "@/types/index";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const inventoryState = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchProducts("inventory"));
  }, []);

  const { loading: isLoadingProducts, error } =
    inventoryState as InventoryState;

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
