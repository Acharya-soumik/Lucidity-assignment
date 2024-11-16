import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductRow from "./ProductRow";
import { useSelector } from "react-redux";

export const ProductTable = () => {
  const { ids, entities } = useSelector((state) => state.inventory);

  const headers = [
    { id: 1, label: "Name" },
    { id: 2, label: "Category" },
    { id: 3, label: "Price" },
    { id: 4, label: "Quantity" },
    { id: 5, label: "Value" },
    { id: 6, label: "Action", align: "right" as const },
  ];

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
          {ids.map((id: string) => (
            <ProductRow key={id} product={entities[id]} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
