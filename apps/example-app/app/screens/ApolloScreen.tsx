import React from "react"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"
import { ListItem, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"

const CHAPTERS_QUERY = gql`
  query Chapters {
    chapters {
      id
      number
      title
    }
  }
`

const ChapterItem = ({
  chapter,
  onPress,
}: {
  chapter: { id: number; number: number; title: string }
  onPress?: () => void
}) => {
  const { number, title } = chapter
  let header, subheader

  if (number) {
    header = `Chapter ${number}`
    subheader = ` - ${title}`
  } else {
    header = title
    subheader = ""
  }

  return (
    <ListItem
      text={`${header}${subheader}`}
      onPress={onPress}
      containerStyle={{ paddingHorizontal: spacing.sm }}
    />
  )
}

interface ApolloScreenProps extends AppStackScreenProps<"Apollo"> {}

export const ApolloScreen: React.FC<ApolloScreenProps> = observer(function ApolloScreen() {
  const { data, loading } = useQuery(CHAPTERS_QUERY)
  const navigation = useNavigation()

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <FlatList
      style={$container}
      contentContainerStyle={$bottomContainerInsets}
      data={loading ? [] : data.chapters}
      renderItem={({ item }) => (
        <ChapterItem chapter={item} onPress={() => navigation.navigate("ApolloDetail", { item })} />
      )}
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
      keyExtractor={(chapter) => chapter.id.toString()}
    />
  )
})

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
