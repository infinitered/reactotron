import * as React from "react"
import {
  Dimensions,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewProps,
  useWindowDimensions,
} from "react-native"

const NativeSafeAreaView = View

export type Edge = "top" | "right" | "bottom" | "left"
export type EdgeMode = "off" | "additive" | "maximum"

export type EdgeRecord = Partial<Record<Edge, EdgeMode>>
export type Edges = readonly Edge[] | Readonly<EdgeRecord>

export interface EdgeInsets {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Metrics {
  insets: EdgeInsets
  frame: Rect
}

export type InsetChangedEvent = NativeSyntheticEvent<Metrics>

export type InsetChangeNativeCallback = (event: InsetChangedEvent) => void

export interface NativeSafeAreaProviderProps extends ViewProps {
  children?: React.ReactNode
  onInsetsChange: InsetChangeNativeCallback
}

export interface NativeSafeAreaViewProps extends ViewProps {
  children?: React.ReactNode
  mode?: "padding" | "margin"
  edges?: Edges
}

export type NativeSafeAreaViewInstance = InstanceType<typeof NativeSafeAreaView>

export const SafeAreaView = View as unknown as NativeSafeAreaViewInstance

export const initialWindowMetrics: Metrics | null = null

/**
 * @deprecated
 */
export const initialWindowSafeAreaInsets: EdgeInsets | null = null

export function NativeSafeAreaProvider({
  children,
  style,
  onInsetsChange,
}: NativeSafeAreaProviderProps) {
  const window = useWindowDimensions()
  React.useEffect(() => {
    const insets = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }
    const frame = {
      x: 0,
      y: 0,
      width: window.width,
      height: window.height,
    }
    // @ts-ignore: missing properties
    onInsetsChange({ nativeEvent: { insets, frame } })
  }, [onInsetsChange, window.height, window.width])
  return <View style={style}>{children}</View>
}

const isDev = process.env.NODE_ENV !== "production"

export const SafeAreaInsetsContext = React.createContext<EdgeInsets | null>(null)
if (isDev) {
  SafeAreaInsetsContext.displayName = "SafeAreaInsetsContext"
}

export const SafeAreaFrameContext = React.createContext<Rect | null>(null)
if (isDev) {
  SafeAreaFrameContext.displayName = "SafeAreaFrameContext"
}

export interface SafeAreaProviderProps extends ViewProps {
  children?: React.ReactNode
  initialMetrics?: Metrics | null
  /**
   * @deprecated
   */
  initialSafeAreaInsets?: EdgeInsets | null
}

export function SafeAreaProvider({
  children,
  initialMetrics,
  initialSafeAreaInsets,
  style,
  ...others
}: SafeAreaProviderProps) {
  const parentInsets = useParentSafeAreaInsets()
  const parentFrame = useParentSafeAreaFrame()
  const [insets, setInsets] = React.useState<EdgeInsets | null>(
    initialMetrics?.insets ?? initialSafeAreaInsets ?? parentInsets ?? null
  )
  const [frame, setFrame] = React.useState<Rect>(
    initialMetrics?.frame ??
      parentFrame ?? {
        // Backwards compat so we render anyway if we don't have frame.
        x: 0,
        y: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }
  )
  const onInsetsChange = React.useCallback((event: InsetChangedEvent) => {
    const {
      nativeEvent: { frame: nextFrame, insets: nextInsets },
    } = event

    setFrame((curFrame) => {
      if (
        // Backwards compat with old native code that won't send frame.
        nextFrame &&
        (nextFrame.height !== curFrame.height ||
          nextFrame.width !== curFrame.width ||
          nextFrame.x !== curFrame.x ||
          nextFrame.y !== curFrame.y)
      ) {
        return nextFrame
      } else {
        return curFrame
      }
    })

    setInsets((curInsets) => {
      if (
        !curInsets ||
        nextInsets.bottom !== curInsets.bottom ||
        nextInsets.left !== curInsets.left ||
        nextInsets.right !== curInsets.right ||
        nextInsets.top !== curInsets.top
      ) {
        return nextInsets
      } else {
        return curInsets
      }
    })
  }, [])

  return (
    <NativeSafeAreaProvider
      style={[styles.fill, style]}
      onInsetsChange={onInsetsChange}
      {...others}
    >
      {insets != null ? (
        <SafeAreaFrameContext.Provider value={frame}>
          <SafeAreaInsetsContext.Provider value={insets}>{children}</SafeAreaInsetsContext.Provider>
        </SafeAreaFrameContext.Provider>
      ) : null}
    </NativeSafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
})

function useParentSafeAreaInsets(): EdgeInsets | null {
  return React.useContext(SafeAreaInsetsContext)
}

function useParentSafeAreaFrame(): Rect | null {
  return React.useContext(SafeAreaFrameContext)
}

const NO_INSETS_ERROR =
  "No safe area value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app."

export function useSafeAreaInsets(): EdgeInsets {
  const insets = React.useContext(SafeAreaInsetsContext)
  if (insets == null) {
    throw new Error(NO_INSETS_ERROR)
  }
  return insets
}

export function useSafeAreaFrame(): Rect {
  const frame = React.useContext(SafeAreaFrameContext)
  if (frame == null) {
    throw new Error(NO_INSETS_ERROR)
  }
  return frame
}

export type WithSafeAreaInsetsProps = {
  insets: EdgeInsets
}

export function withSafeAreaInsets<T>(
  WrappedComponent: React.ComponentType<T & WithSafeAreaInsetsProps>
): React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<unknown>> {
  return React.forwardRef((props: T, ref: React.Ref<unknown>) => {
    const insets = useSafeAreaInsets()
    return <WrappedComponent {...props} insets={insets} ref={ref} />
  })
}

/**
 * @deprecated
 */
export function useSafeArea(): EdgeInsets {
  return useSafeAreaInsets()
}

/**
 * @deprecated
 */
export const SafeAreaConsumer = SafeAreaInsetsContext.Consumer

/**
 * @deprecated
 */
export const SafeAreaContext = SafeAreaInsetsContext
