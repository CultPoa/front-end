import { useState, useCallback } from 'react';

interface WikiData {
  title: string;
  extract: string;
  image?: string;
}

type WikiCache = Record<string, WikiData>;

export function useWikipedia() {
  const [cache, setCache] = useState<WikiCache>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchWikipediaData = useCallback(async (title: string): Promise<WikiData | null> => {
    if (cache[title]) {
      return cache[title];
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar dados da Wikipedia');
      }

      const data = await response.json();

      const wikiData: WikiData = {
        title: data.title,
        extract: data.extract,
        image: data.thumbnail?.source || data.originalimage?.source,
      };

      setCache((prev) => ({
        ...prev,
        [title]: wikiData,
      }));

      return wikiData;
    } catch (error) {
      console.error('Erro ao buscar Wikipedia:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  return { cache, fetchWikipediaData, isLoading };
}
