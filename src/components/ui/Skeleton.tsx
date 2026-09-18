import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rc-skeleton rounded-lg", className)} />;
}

/** โครงการ์ดสถานีระหว่างรอผลค้นหา — สัดส่วนตรงกับการ์ดจริงเพื่อไม่ให้เลย์เอาต์กระโดด */
export function StationCardSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface p-3">
      <div className="flex gap-3">
        <Skeleton className="h-20 w-24 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
