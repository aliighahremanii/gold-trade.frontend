type ScaffoldPageProps = {
  title: string;
  description?: string;
  module?: string;
};

export function ScaffoldPage({ title, description, module }: ScaffoldPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-6 py-10">
      {module ? (
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          {module}
        </p>
      ) : null}
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <p className="text-base text-zinc-600 dark:text-zinc-400">
        {description ??
          "Scaffold placeholder. Workflow implementation is planned for a later phase."}
      </p>
    </section>
  );
}
