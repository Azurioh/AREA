import { useMemo } from "react";

export function useFilter<T>(
  items: T[],
  search: string,
  getField: (item: T) => string
): T[] {
  return useMemo(() => {
    if (!search) return items;
    const lowerSearch = search.toLowerCase();
    return items.filter(item =>
      getField(item).includes(lowerSearch)
    );
  }, [items, search, getField]);
}
