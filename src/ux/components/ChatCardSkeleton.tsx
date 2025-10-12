import Skeleton from "@/components/Skeleton/Skeleton";
import React from "react";

const ChatCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-[72px] mt-auto transition-colors rounded-lg bg-gray-800/20 p-3">
      {/* Ícono simulado */}
      <div className="flex items-center px-4">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>

      {/* Contenido simulado */}
      <div className="flex w-[85%] flex-col justify-center gap-2">
        <Skeleton className="w-1/2 h-4" /> {/* Simula título */}
        <Skeleton className="w-2/3 h-3" /> {/* Simula email */}
      </div>
    </div>
  );
};

export default ChatCardSkeleton;
