import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductRow from "./ProductRow";
import { useSelector } from "react-redux";
import { RootState } from "@/store/slices/store";
const headers = [
  { id: 1, label: "Name" },
  { id: 2, label: "Category" },
  { id: 3, label: "Price" },
  { id: 4, label: "Quantity" },
  { id: 5, label: "Value" },
  { id: 6, label: "Action", align: "right" },
];

export const ProductTable = () => {
  const products = useSelector((state: RootState) => state.inventory.products);

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead
                key={header.id}
                className={header.align === "right" ? "text-right" : ""}
              >
                <span className="px-2 opacity-70 text-sm py-1 bg-[#111010] rounded-sm text-[#b2e01a]">
                  {header.label}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
