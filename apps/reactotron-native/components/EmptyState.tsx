import { FunctionComponent } from "react"
import { H1, Text, YStack } from "tamagui"

export function EmptyState({
  children,
  icon: Icon,
  title,
}: {
  children?: React.ReactNode
  icon?: FunctionComponent<{ color?: string; size?: number }>
  title: string
}) {
  return (
    <YStack ai="center" bg="$background" f={1} jc="center">
      {Icon && <Icon size={100} />}
      <H1 mb="$4">{title}</H1>
      {typeof children === "string" ? (
        <Text lh="$4" maw={400} ta="center">
          {children}
        </Text>
      ) : (
        children
      )}
    </YStack>
  )
}
