import Widget from "./Widget";
import { useSelector } from "react-redux";
import { selectInventoryStats } from "@/store/slices/inventorySlice";
import { ShoppingCart, CircleDollarSign, Component } from "lucide-react";

export const StatsCards = () => {
  // const dispatch = useDispatch();
  const stats = useSelector(selectInventoryStats);
  console.log({ stats });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Widget
        icon={<ShoppingCart />}
        title="Total Products"
        value={stats.activeProducts}
      />
      <Widget
        icon={<CircleDollarSign />}
        title="Total Store Value"
        value={`$${stats.totalValue}`}
      />
      <Widget
        icon={<ShoppingCart />}
        title="Out of Stock"
        value={stats.outOfStock}
      />
      <Widget
        icon={<Component />}
        title="Categories"
        value={stats.categories}
      />
    </div>
  );
};
