'use client'

import { useEffect, useRef, useState } from 'react';

interface DimensionObject {
  width: number;
  height: number;
}

export function useResizeObserver(ref: React.RefObject<HTMLElement>): DimensionObject | undefined {
  const [dimensions, setDimensions] = useState<DimensionObject>();
  const resizeObserver = useRef<ResizeObserver>(null);

  useEffect(() => {
    // Create a new ResizeObserver if we don't have one yet
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver(entries => {
        // We only observe one element, so we just need the first entry
        if (entries[0]) {
          const { width, height } = entries[0].contentRect;
          setDimensions({ width, height });
        }
      });
    }

    // Start observing the element if we have a ref
    if (ref.current) {
      resizeObserver.current.observe(ref.current);
    }

    // Cleanup function to stop observing and disconnect
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [ref]); // Only re-run if the ref changes

  return dimensions;
}