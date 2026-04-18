// Simple cache for demo purposes
const cache = new Map<string, { status: 'pending' | 'resolved'; value?: unknown; promise?: Promise<void> }>();

export function fetchData<T>(key: string, ms: number, data: T): T {
  const entry = cache.get(key);

  if (entry?.status === 'resolved') {
    return entry.value as T;
  }

  if (entry?.status === 'pending') {
    throw entry.promise;
  }

  const promise = new Promise<void>((resolve) => {
    setTimeout(() => {
      cache.set(key, { status: 'resolved', value: data });
      resolve();
    }, ms);
  });

  cache.set(key, { status: 'pending', promise });
  throw promise;
}

export function invalidate(key: string) {
  cache.delete(key);
}

export function invalidateAll() {
  cache.clear();
}
