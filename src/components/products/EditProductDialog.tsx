import { useEffect } from "react";

import type { Product } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { closeEditDialog, updateProduct } from "@/store/slices/inventorySlice";
import { RootState } from "@/store/slices/store";

export const EditProductDialog = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.inventory);
  const { isEditDialogOpen, editingProduct } = state;
  console.log({ editingProduct }, { isEditDialogOpen });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: editingProduct || {},
  });

  useEffect(() => {
    if (editingProduct) {
      reset(editingProduct);
    }
  }, [editingProduct, reset]);

  const onSubmit = (data: Product) => {
    dispatch(
      updateProduct({
        ...data,
        price: data.price,
        quantity: Number(data.quantity),
      })
    );
  };

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={() => dispatch(closeEditDialog())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{editingProduct?.name}</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register("category", { required: "Category is required" })}
              className={errors.category ? "border-red-500" : ""}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 0, message: "Quantity must be positive" },
              })}
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => dispatch(closeEditDialog())}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="hover:text-gray-700"
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
