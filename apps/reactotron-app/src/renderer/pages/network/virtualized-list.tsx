import React, { useMemo, useRef, useState } from "react"

interface VirtualizedListProps<T> {
  data: T[]
  renderItem: (item: T) => React.ReactNode
  itemHeight: number
  height: number
  getKey: (item: T) => string
}

export const VirtualizedList = <T,>({
  data,
  renderItem,
  itemHeight,
  height,
  getKey,
}: VirtualizedListProps<T>) => {
  const itemAmount = height / itemHeight
  const totalHeight = data.length * itemHeight

  const [positions, setPositions] = useState({ head: 0, tail: itemAmount })
  const outerWrapperRef = useRef<HTMLDivElement>(null)

  const calculateNewIndexes = () => {
    const el = outerWrapperRef.current
    if (!el) return

    const scrollTop = el.scrollTop
    const head = Math.max(0, Math.ceil(scrollTop / itemHeight))
    const tail = Math.min(data.length, head + itemAmount)

    if (head === positions.head && tail === positions.tail) return
    setPositions({ head, tail })
  }

  const visibleItems = useMemo(
    () => data.slice(positions.head, positions.tail),
    [data, positions.head, positions.tail]
  )

  if (!data.length) return null

  return (
    <div ref={outerWrapperRef} style={{ height, overflowY: "auto" }} onScroll={calculateNewIndexes}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            transform: `translateY(${positions.head * itemHeight}px)`,
          }}
        >
          {visibleItems.map((item) => (
            <React.Fragment key={getKey(item)}>{renderItem(item)}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

