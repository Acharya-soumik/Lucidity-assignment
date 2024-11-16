import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Eye, Trash2, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteProduct,
  selectProductValue,
  setEditingProduct,
  toggleProductStatus,
} from "@/store/slices/inventorySlice";
import { Product } from "@/types/index";

const ProductRow = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();

  const handleToggleStatus = (key: string) => {
    dispatch(toggleProductStatus(key));
  };

  const isAdmin = useSelector((state) => state.inventory.role === "admin");

  return (
    <TableRow
      className={
        product.isDisabled && isAdmin
          ? "opacity-30 text-left text-gray-500"
          : "text-left"
      }
    >
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product?.category}</TableCell>
      <TableCell>{product?.price}</TableCell>
      <TableCell>{product?.quantity}</TableCell>
      <TableCell>${selectProductValue(product)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setEditingProduct(product))}
            disabled={!isAdmin || product.isDisabled}
            title="Edit product"
            className="hover:text-gray-500"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleToggleStatus(product.name)}
            disabled={!isAdmin}
            title={product.isDisabled ? "Enable product" : "Disable product"}
            className="hover:text-gray-500"
          >
            {product.isDisabled ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(deleteProduct(product.name))}
            disabled={!isAdmin || product.isDisabled}
            title="Delete product"
            className="hover:text-gray-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
