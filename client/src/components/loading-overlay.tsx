import { cn } from "@/lib/utils";
import { LucideLoader, LucideLoader2 } from "lucide-react";

const LoadingOverlay = ({ isPending=true, loader="1" }: { isPending?: boolean, loader?: "1" | '2' }) => {
  if (!isPending) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center pointer-events-auto cursor-wait top-0 left-0 right-0">
      {loader === "1" ? (
        <LucideLoader size={24} className={cn("text-muted-foreground animate-spin")} />
        ) : (
        <LucideLoader2 size={24} className={cn("text-muted-foreground animate-spin")} />
        )}
    </div>
  );
};

export default LoadingOverlay;
