function SkeletonLine({ w, h = 4 }: { w: string; h?: number }) {
  return <div className={`h-${h} ${w} bg-track rounded-full animate-pulse`} />;
}

function CardSkeleton({ hasRight = false }: { hasRight?: boolean }) {
  return (
    <div className="flex items-center bg-card rounded-2xl border border-hair px-4 py-3.5">
      <div className="w-10 h-10 rounded-xl bg-track animate-pulse shrink-0" />
      <div className="flex-1 ml-3">
        <div className="h-4 w-32 bg-track rounded-full animate-pulse mb-1.5" />
        <div className="h-3 w-20 bg-track rounded-full animate-pulse" />
      </div>
      {hasRight && <div className="w-6 h-6 rounded-full bg-track animate-pulse shrink-0" />}
    </div>
  );
}

export default function TodayLoading() {
  return (
    <main
      className="flex flex-col bg-bg min-h-dvh pb-24 px-6"
      style={{ paddingTop: "var(--space-18)" }}
    >
      <div className="mb-6">
        <SkeletonLine w="w-28" h={3} />
        <div className="mt-2">
          <SkeletonLine w="w-52" h={6} />
        </div>
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SkeletonLine w="w-16" h={3} />
        </div>
        <div className="flex flex-col gap-2">
          <CardSkeleton hasRight />
          <CardSkeleton hasRight />
          <CardSkeleton hasRight />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <SkeletonLine w="w-20" h={3} />
        </div>
        <div className="flex flex-col gap-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    </main>
  );
}
