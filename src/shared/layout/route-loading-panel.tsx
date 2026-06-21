type RouteLoadingPanelProps = {
  area: "customer" | "admin";
};

export function RouteLoadingPanel({ area }: RouteLoadingPanelProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-6 py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">{area}</p>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Loading</h1>
      <p className="text-base text-zinc-600 dark:text-zinc-400">
        Preparing the page. Financial data will load from the backend when available.
      </p>
    </section>
  );
}
