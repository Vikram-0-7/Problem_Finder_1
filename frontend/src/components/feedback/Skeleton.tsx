/* ============================================
   SKELETON COMPONENT
   Loading placeholder with pulse animation
   ============================================ */

interface SkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'stats';
  count?: number;
}

const SkeletonLine = ({ width = 'w-full' }: { width?: string }) => (
  <div className={`h-4 ${width} bg-border rounded-lg animate-pulse`} />
);

const CardSkeleton = () => (
  <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
    <div className="flex items-center gap-2">
      <div className="h-6 w-20 bg-border rounded-full animate-pulse" />
      <div className="h-6 w-16 bg-border rounded-full animate-pulse" />
    </div>
    <div className="space-y-2">
      <SkeletonLine />
      <SkeletonLine width="w-3/4" />
    </div>
    <div className="space-y-2">
      <SkeletonLine width="w-1/2" />
      <SkeletonLine width="w-2/3" />
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div className="h-10 w-20 bg-border rounded-xl animate-pulse" />
      <div className="h-10 w-28 bg-border rounded-xl animate-pulse" />
    </div>
  </div>
);

const TextSkeleton = () => (
  <div className="space-y-3">
    <SkeletonLine />
    <SkeletonLine width="w-5/6" />
    <SkeletonLine width="w-4/6" />
  </div>
);

const CircleSkeleton = () => (
  <div className="w-12 h-12 bg-border rounded-full animate-pulse" />
);

const StatsSkeleton = () => (
  <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="w-11 h-11 bg-border rounded-2xl animate-pulse" />
      <div className="h-6 w-14 bg-border rounded-full animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="h-8 w-24 bg-border rounded-lg animate-pulse" />
      <div className="h-4 w-32 bg-border-light rounded-lg animate-pulse" />
    </div>
  </div>
);

const skeletonMap = {
  card: CardSkeleton,
  text: TextSkeleton,
  circle: CircleSkeleton,
  stats: StatsSkeleton,
};

const Skeleton = ({ variant = 'card', count = 1 }: SkeletonProps) => {
  const Component = skeletonMap[variant];

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
};

export default Skeleton;
