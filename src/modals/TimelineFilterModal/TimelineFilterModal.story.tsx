import React from "react"

import TimelineFilterModal from "./index"
import { CommandType } from "../../types"

export default {
  title: "Timeline Filter Modal",
}

export const AllOn = () => (
  <TimelineFilterModal isOpen onClose={() => {}} setHiddenCommands={() => {}} hiddenCommands={[]} />
)

export const LogOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.Log]}
  />
)

export const ImageOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.Image]}
  />
)

export const CustomDisplayOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.Display]}
  />
)

export const ConnectionOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.ClientIntro]}
  />
)

export const BenchmarkOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.Benchmark]}
  />
)

export const APIOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.ApiResponse]}
  />
)

export const MutationsOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.AsyncStorageMutation]}
  />
)

export const ActionOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.StateActionComplete]}
  />
)

export const SagaOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.SagaTaskComplete]}
  />
)

export const SubscriptionOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[CommandType.StateValuesChange]}
  />
)

export const AllOff = () => (
  <TimelineFilterModal
    isOpen
    onClose={() => {}}
    setHiddenCommands={() => {}}
    hiddenCommands={[
      CommandType.Log,
      CommandType.Image,
      CommandType.Display,
      CommandType.ClientIntro,
      CommandType.Benchmark,
      CommandType.ApiResponse,
      CommandType.AsyncStorageMutation,
      CommandType.StateActionComplete,
      CommandType.SagaTaskComplete,
      CommandType.StateValuesChange,
    ]}
  />
)
