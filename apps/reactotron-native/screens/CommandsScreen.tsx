import { Wand2 } from "@tamagui/lucide-icons"
import { EmptyState } from "../components/EmptyState"

// TODO: actually implement all of commands

export function CommandsScreen() {
  return (
    <EmptyState icon={Wand2} title="No Custom Commands">
      When your app registers a custom command it will show here!
    </EmptyState>
  )
}
