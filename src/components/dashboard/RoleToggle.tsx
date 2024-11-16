import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { toggleRole } from "@/store/slices/inventorySlice";
import { useDispatch, useSelector } from "react-redux";
import { InventoryState } from "@/types/index";

export const RoleToggle = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.inventory.role === "admin");

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="admin-mode">admin</Label>
      <Switch
        id="admin-mode"
        checked={isAdmin ? true : false}
        onCheckedChange={() => dispatch(toggleRole())}
      />
      <Label htmlFor="admin-mode">user</Label>
    </div>
  );
};
