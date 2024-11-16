import { RoleToggle } from "@/components/dashboard/RoleToggle";

export const Header = () => {
  return (
    <>
      <div className="flex justify-end">
        <RoleToggle />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory stats</h1>
      </div>
    </>
  );
};
