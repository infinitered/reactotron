import React, { FunctionComponent } from "react"
import { View } from "react-native"
import styled from "rn-css"

import { CommandType, CommandTypeKey } from "reactotron-core-contract"
import Checkbox from "../../components/Checkbox"
import Modal from "../../components/Modal"

const GROUPS = [
  {
    name: "Informational",
    items: [
      { value: CommandType.Log, text: "Log" },
      { value: CommandType.Image, text: "Image" },
      { value: CommandType.Display, text: "Custom Display" },
    ],
  },
  {
    name: "General",
    items: [
      { value: CommandType.ClientIntro, text: "Connection" },
      { value: CommandType.Benchmark, text: "Benchmark" },
      { value: CommandType.ApiResponse, text: "API" },
    ],
  },
  {
    name: "Async Storage",
    items: [{ value: CommandType.AsyncStorageMutation, text: "Mutations" }],
  },
  {
    name: "State & Sagas",
    items: [
      { value: CommandType.StateActionComplete, text: "Action" },
      { value: CommandType.SagaTaskComplete, text: "Saga" },
      { value: CommandType.StateValuesChange, text: "Subscription Changed" },
    ],
  },
]

const BulkActionContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`
const BulkAction = styled.Text`
  color: ${(props) => props.theme.tag};
  cursor: pointer;
`

const Slash = styled.Text`
  color: ${(props) => props.theme.foregroundLight};
`

const GroupName = styled.Text`
  border-bottom: 1px solid ${(props) => props.theme.highlight};
  color: ${(props) => props.theme.foregroundLight};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 2px;
`

interface Props {
  isOpen: boolean
  onClose: () => void
  hiddenCommands: CommandTypeKey[]
  setHiddenCommands: (hiddenCommands: CommandTypeKey[]) => void
}

const TimelineFilterModal: FunctionComponent<Props> = ({
  isOpen,
  onClose,
  hiddenCommands,
  setHiddenCommands,
}) => {
  const toggleAllOn = () => {
    // To turn everything on we need the list to be empty.
    setHiddenCommands([])
  }

  const toggleAllOff = () => {
    // To turn everything off we need the list to have all options.
    setHiddenCommands(
      GROUPS.reduce((itms, g) => {
        return [...itms, ...g.items.map((i) => i.value)]
      }, [])
    )
  }

  const buildCheckboxToggle = (value: CommandTypeKey) => {
    const isSelected = hiddenCommands.indexOf(value) === -1

    return () => {
      if (isSelected) {
        setHiddenCommands([...hiddenCommands, value])
      } else {
        setHiddenCommands([...hiddenCommands.filter((f) => f !== value)])
      }
    }
  }

  return (
    <Modal title="Timeline Filter" isOpen={isOpen} onClose={onClose}>
      <BulkActionContainer>
        <BulkAction onPress={toggleAllOn}>Check all</BulkAction>
        <Slash> / </Slash>
        <BulkAction onPress={toggleAllOff}>Uncheck all</BulkAction>
      </BulkActionContainer>
      <View>
        {GROUPS.map((section, sectionIdx) => {
          const options = section.items.map((item, itemIdx) => {
            const isChecked = hiddenCommands.indexOf(item.value) === -1
            const onToggle = buildCheckboxToggle(item.value)

            return (
              <Checkbox key={itemIdx} label={item.text} onToggle={onToggle} isChecked={isChecked} />
            )
          })

          return (
            <View key={sectionIdx}>
              <GroupName>{section.name}</GroupName>
              {options}
            </View>
          )
        })}
      </View>
    </Modal>
  )
}

export default TimelineFilterModal
