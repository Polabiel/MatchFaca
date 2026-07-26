"use client";

import { useEffect, useState } from "react";

/**
 * Returns a debounced version of the provided value.
 * Useful for delaying search queries, filter inputs, etc.
 *
 * Ported from Yield pattern.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 350)
 *
 * @example
 * const [search, setSearch] = useState("")
 * const debouncedSearch = useDebouncedValue(search, 300)
 *
 * useEffect(() => {
 *   api.search(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return debouncedValue;
}
