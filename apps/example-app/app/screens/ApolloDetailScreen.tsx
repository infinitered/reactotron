import React from "react"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"
import { ListItem, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { gql, useQuery } from "@apollo/client"
import { observer } from "mobx-react-lite"

const SECTIONS_QUERY = gql`
  query Sections($id: Int!) {
    chapter(id: $id) {
      sections {
        number
        title
      }
    }
  }
`

interface Section {
  number: number
  title: string
}

interface SectionItemProps {
  chapter: {
    __typename: string
    id: number
    number: number | null
    title: string
  }
  section: Section
  onPress?: () => void
}

const SectionItem: React.FC<SectionItemProps> = ({ chapter, section, onPress }) => (
  <ListItem
    text={`${chapter.number}.${section.number}: ${section.title}`}
    onPress={onPress}
    containerStyle={{ paddingHorizontal: spacing.sm }}
  />
)

interface ApolloDetailScreenProps extends AppStackScreenProps<"ApolloDetail"> {}

export const ApolloDetailScreen: React.FC<ApolloDetailScreenProps> = observer(
  function ApolloScreen({ route }) {
    const id = route.params.item.id

    const { data, loading } = useQuery(SECTIONS_QUERY, {
      variables: { id },
    })

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

    return (
      <FlatList
        style={$container}
        contentContainerStyle={$bottomContainerInsets}
        data={loading ? [] : data.chapter.sections}
        renderItem={({ item }) => <SectionItem section={item} chapter={route.params.item} />}
        ListHeaderComponent={() => {
          return (
            <View>
              <Text
                text="Reactotron can intercept and inspect Apollo client queries"
                style={$subheading}
                preset="subheading"
              />
              <Text text="Like this example from the GraphQL example app:" style={$subheading} />
              <View style={$bottomBorder} />
            </View>
          )
        }}
        keyExtractor={(section) => section.number.toString()}
      />
    )
  }
)

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $text: TextStyle = {
  color: colors.text,
}
const $subheading: TextStyle = {
  ...$text,
  margin: spacing.sm,
}

const $bottomBorder: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: colors.text,
  marginHorizontal: spacing.sm,
}
