import { Database } from "@tamagui/lucide-icons"
import { EmptyState } from "../components/EmptyState"

export function SubscriptionScreen() {
  return (
    <EmptyState icon={Database} title="No Subscriptions">
      You can subscribe to state changes in your redux or mobx-state-tree store by pressing
    </EmptyState>
  )
}
