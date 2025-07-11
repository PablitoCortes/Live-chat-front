import React from "react";
import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  const baseClasses = "bg-gray-400/20 animate-pulse rounded-md";
  return <div className={clsx(baseClasses, className)} />;
};

export default Skeleton;
