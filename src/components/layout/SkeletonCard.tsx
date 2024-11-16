import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[50px] min-w-full rounded-xl" />
      <Skeleton className="h-[30px] min-w-full rounded-xl" />
      <Skeleton className="h-[30px] min-w-full rounded-xl" />
    </div>
  );
}
