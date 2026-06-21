export type QueryKeySegment = string | number | boolean | null | undefined;

export type QueryKey = readonly QueryKeySegment[];

export function createQueryKeyFactory<const ModuleName extends string>(moduleName: ModuleName) {
  const root = [moduleName] as const;

  return {
    all: root,
    lists: () => [...root, "list"] as const,
    list: (filters: QueryKeySegment | Record<string, QueryKeySegment>) =>
      [...root, "list", filters] as const,
    details: () => [...root, "detail"] as const,
    detail: (id: QueryKeySegment) => [...root, "detail", id] as const,
  };
}
