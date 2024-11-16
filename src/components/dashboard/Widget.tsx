import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsCardProps } from "@/types/index";

const Widget = ({ title, value, icon }: StatsCardProps) => (
  <Card className=" hover:shadow hover:shadow-gray-400">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium flex">
        {icon && <div className="text-gray-600 pr-3">{icon}</div>}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-left pl-8">{value}</p>
    </CardContent>
  </Card>
);

export default Widget;
