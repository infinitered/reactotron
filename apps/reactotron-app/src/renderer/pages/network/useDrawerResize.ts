import { useEffect, useRef, useState } from "react"

interface UsePanelResizeOptions {
  initialLeftPanelWidth?: number
  minLeftPanelWidth?: number
  minRightPanelWidth?: number
  resizeHandleWidth?: number
  onUserResize?: () => void
}

export const useDrawerResize = (options: UsePanelResizeOptions = {}) => {
  const {
    initialLeftPanelWidth = 350,
    minLeftPanelWidth = 200,
    minRightPanelWidth = 200,
    resizeHandleWidth = 10,
    onUserResize,
  } = options

  const [isResizing, setIsResizing] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeftPanelWidth)

  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    setLeftPanelWidth(initialLeftPanelWidth)
  }, [initialLeftPanelWidth])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left

      const maxWidth = containerRect.width - minRightPanelWidth - resizeHandleWidth

      if (newWidth >= minLeftPanelWidth && newWidth <= maxWidth) {
        setLeftPanelWidth(newWidth)

        if (onUserResize) onUserResize()
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, minLeftPanelWidth, minRightPanelWidth, resizeHandleWidth, onUserResize])

  return {
    containerRef,
    leftPanelWidth,
    handleMouseDown,
  }
}
