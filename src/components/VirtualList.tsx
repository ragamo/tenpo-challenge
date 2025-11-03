import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type VirtualListProps<T> = {
  items: Array<T>
  height: number
  itemHeight: number
  overscan?: number
  renderItem: (item: T) => ReactNode
  getKey?: (item: T, index: number) => string | number
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  overscan = 6,
  renderItem,
  getKey,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)

  const onScroll = useCallback(() => {
    const top = containerRef.current?.scrollTop ?? 0
    setScrollTop(top)
  }, [])

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2
  const endIndex = Math.min(items.length, startIndex + visibleCount)

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  )

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="overflow-auto border border-gray-200 rounded-lg bg-gray-50 relative"
      style={{ height }}
    >
      <div className="relative" style={{ height: totalHeight }}>
        {visibleItems.map((item, i) => {
          const index = startIndex + i
          const top = index * itemHeight
          const key = getKey ? getKey(item, index) : index
          return (
            <div
              key={key}
              className="absolute left-0 right-0"
              style={{ top, height: itemHeight }}
            >
              {renderItem(item)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
