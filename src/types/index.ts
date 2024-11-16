import * as React from "react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string | number;
  quantity: number;
  isDisabled?: boolean;
}
