import { AlignJustify } from "@tamagui/lucide-icons"
import { EmptyState } from "../components/EmptyState"

// TODO: actually implement all of timeline

export function TimelineScreen() {
  return (
    <EmptyState icon={AlignJustify} title="No Activity">
      Once your app connects and starts sending events, they will appear here.
    </EmptyState>
  )
}
