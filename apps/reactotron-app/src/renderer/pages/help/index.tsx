import React from "react"
import { ipcRenderer, shell } from "electron"
import { Header } from "reactotron-core-ui"
import styled from "styled-components"
import {
  GoRepo as RepoIcon,
  GoComment as FeedbackIcon,
  GoSquirrel as ReleaseIcon,
  GoGear as SettingsIcon,
} from "react-icons/go"
import { FaTwitter as TwitterIcon } from "react-icons/fa"
import { MdCompareArrows as ReverseTunnelIcon } from "react-icons/md"
import { CgSmartphoneShake as ShakeDeviceIcon } from "react-icons/cg"
import { IoReloadOutline as ReloadAppIcon } from "react-icons/io5"
import { getApplicationKeyMap } from "react-hotkeys"
import ReactTooltip from "react-tooltip"
import KeybindGroup from "./components/KeybindGroup"
import { reactotronLogo } from "../../images"

const projectJson = require("../../../../package.json")

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const HelpContainer = styled.div`
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
`

const LogoImage = styled.img`
  height: 128px;
  margin: 20px 0;
`

const Title = styled.div`
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 2px;
  color: ${(props) => props.theme.foregroundLight};
  border-bottom: 1px solid ${(props) => props.theme.highlight};
`

const ConnectContainer = styled.div`
  display: flex;
  align-items: flex-start;
  color: ${(props) => props.theme.foreground};
  margin-bottom: 50px;
`
const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  flex: 1;
  background-color: ${(props) => props.theme.chrome};
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.chromeLine};
`
const ItemIconContainer = styled.div`
  color: ${(props) => props.theme.foregroundLight};
  margin-bottom: 8px;
`
const AndroidDeviceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 10px;
  color: ${(props) => props.theme.foreground};
`

const AndroidDeviceButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0px;
`
const Text = styled.div`
  margin-right: 4px;
  color: ${(props) => props.theme.foregroundDark};
`
const DeviceID = styled.div`
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 0px;
  color: ${(props) => props.theme.tag};
`
const HighlightedText = styled.div`
  display: inline-block;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.highlight};
  padding: 2px;
  color: ${(props) => props.theme.tag};
  background-color: ${(props) => props.theme.line};
`
const PortSettingsTitle = styled.div`
  font-size: 18px;
  margin: 10px 0;
  padding-bottom: 2px;
  color: ${(props) => props.theme.foregroundLight};
  border-bottom: 1px solid ${(props) => props.theme.highlight};
`
const PortSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.chromeLine};
  background-color: ${(props) => props.theme.chrome};
`
const PortArgsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`
const ArgContainer = styled.div`
  &:not(:last-child) {
    margin-right: 12px;
  }
`
const ArgName = styled.div`
  margin-bottom: 8px;
`
const ArgInput = styled.input`
  padding: 10px 12px;
  outline: none;
  border-radius: 4px;
  width: 100px;
  border: none;
  font-size: 16px;
`
const PortSettingsIconContainer = styled.div`
  float: right;
  color: ${(props) => props.theme.foregroundLight};
  margin-left: 10px;
`

function openRepo() {
  shell.openExternal("https://github.com/infinitered/reactotron")
}

function openFeedback() {
  shell.openExternal("https://github.com/infinitered/reactotron/issues/new")
}

function openUpdates() {
  shell.openExternal("https://github.com/infinitered/reactotron/releases")
}

function openTwitter() {
  shell.openExternal("https://twitter.com/reactotron")
}

function Keybinds() {
  const keyMap = getApplicationKeyMap()

  const groupedKeyMap = Object.keys(keyMap).reduce((groups, k) => {
    const keybind = keyMap[k]

    let newGroup = groups.find((g) => g.name === keybind.group)

    if (!newGroup) {
      newGroup = { name: keybind.group, keybinds: [] }
      groups.push(newGroup)
    }

    newGroup.keybinds.push(keybind)

    return groups
  }, [])

  return groupedKeyMap.map((group) => <KeybindGroup key={group.name} group={group} />)
}

function Help() {
  const [androidDevices, setAndroidDevices] = React.useState([])
  const [portsVisible, setPortsVisible] = React.useState(false)
  const [reactotronPort, setReactotronPort] = React.useState(9090)
  const [metroPort, setMetroPort] = React.useState(8081)

  // When the page loads, get the list of devices from ADB to help users debug android issues.
  React.useEffect(() => {
    ipcRenderer.on("device-list", (_event, arg) => {
      arg = arg.replace(/(\r\n|\n|\r)/gm, "\n").trim() // Fix newlines
      const rawDevices = arg.split("\n")
      rawDevices.shift() // Remove the first line
      const devices = rawDevices.map((device) => {
        const [id, state] = device.split("\t")
        return { id, state }
      })
      setAndroidDevices(devices)
    })

    ipcRenderer.send("get-device-list")

    var msg = {
      title: "Awesome!",
      message:
        "Check this out!<br>Check this out!<br>Check this out!<br>Check this out!<br>Check this out!<br>Check this out!<br>",
      detail:
        "PI is equal to 3! - 0.0<br>PI is equal to 3! - 0.0<br>PI is equal to 3! - 0.0<br>PI is equal to 3! - 0.0<br>",
      width: 440,
      // height : 160, window will be autosized
      timeout: 6000,
      focus: true, // set focus back to main window
    }
    ipcRenderer.send("electron-toaster-message", msg)

    return () => {
      ipcRenderer.removeAllListeners("device-list")
    }
  }, [])

  return (
    <Container>
      <Header title={`Using Reactotron ${projectJson.version}`} isDraggable />
      <HelpContainer>
        <LogoContainer>
          <LogoImage src={reactotronLogo} />
        </LogoContainer>
        <Title>Let&apos;s Connect!</Title>
        <ConnectContainer>
          <ItemContainer onClick={openRepo}>
            <ItemIconContainer>
              <RepoIcon size={40} />
            </ItemIconContainer>
            Repo
          </ItemContainer>
          <ItemContainer onClick={openFeedback}>
            <ItemIconContainer>
              <FeedbackIcon size={40} />
            </ItemIconContainer>
            Feedback
          </ItemContainer>
          <ItemContainer onClick={openUpdates}>
            <ItemIconContainer>
              <ReleaseIcon size={40} />
            </ItemIconContainer>
            Updates
          </ItemContainer>
          <ItemContainer onClick={openTwitter}>
            <ItemIconContainer>
              <TwitterIcon size={40} />
            </ItemIconContainer>
            @reactotron
          </ItemContainer>
        </ConnectContainer>

        <Title>{androidDevices.length} Android Devices Connected via USB:</Title>
        <PortSettingsIconContainer
          data-tip="Advanced Port Settings"
          onClick={() => setPortsVisible(!portsVisible)}
        >
          <SettingsIcon size={20} />
          <ReactTooltip multiline place="bottom" />
        </PortSettingsIconContainer>
        <Text>
          This shows all android devices connected to your machine via the{" "}
          <HighlightedText>adb devices</HighlightedText> command.
        </Text>
        <Text>
          Android devices can sometimes be tricky to connect to reactotron. Many issues can be
          resolved by clicking "Reverse Tunnel" and then "Reload App".
        </Text>
        <AndroidDeviceListContainer>
          {portsVisible && (
            <PortSettingsContainer>
              <PortSettingsTitle>Advanced Reverse Tunneling Settings:</PortSettingsTitle>
              <Text>
                Adjust these values to the ports you are using for Reactotron and Metro. Most users
                will not need to change these values.
              </Text>
              <PortArgsContainer>
                <ArgContainer key="reactotron-port">
                  <ArgName>Reactotron Port:</ArgName>
                  <ArgInput
                    type="text"
                    placeholder={reactotronPort}
                    value={reactotronPort}
                    onChange={(e) => setReactotronPort(e.target.value)}
                  />
                </ArgContainer>
                <ArgContainer key="metro-port">
                  <ArgName>Metro Port:</ArgName>
                  <ArgInput
                    type="text"
                    placeholder={metroPort}
                    value={metroPort}
                    onChange={(e) => setMetroPort(e.target.value)}
                  />
                </ArgContainer>
              </PortArgsContainer>
            </PortSettingsContainer>
          )}
          {androidDevices.map((device) => (
            <div key={device.id}>
              <DeviceID>{device.id}</DeviceID>
              <AndroidDeviceButtonsContainer>
                <ItemContainer
                  onClick={() =>
                    ipcRenderer.send("reverse-tunnel-device", device.id, reactotronPort, metroPort)
                  }
                  data-tip={`This will allow reactotron to connect to your device via USB<br />by running adb reverse tcp:${reactotronPort} tcp:${reactotronPort}<br /><br />Reload your React Native app after pressing this.`}
                >
                  <ItemIconContainer>
                    <ReverseTunnelIcon size={40} />
                  </ItemIconContainer>
                  Reverse Tunnel
                  <ReactTooltip multiline place="bottom" />
                </ItemContainer>
                <ItemContainer
                  onClick={() => ipcRenderer.send("reload-app", device.id)}
                  data-tip="This will reload the React Native app currently running on this device.<br />If you get the React Native red screen, relaunch the app from the build process."
                >
                  <ItemIconContainer>
                    <ReloadAppIcon size={40} />
                  </ItemIconContainer>
                  Reload App
                  <ReactTooltip multiline place="bottom" />
                </ItemContainer>
                <ItemContainer
                  onClick={() => ipcRenderer.send("shake-device", device.id)}
                  data-tip="This will shake the device to bring up<br /> the React Native developer menu."
                >
                  <ItemIconContainer>
                    <ShakeDeviceIcon size={40} />
                  </ItemIconContainer>
                  Shake
                  <ReactTooltip multiline place="bottom" />
                </ItemContainer>
              </AndroidDeviceButtonsContainer>
            </div>
          ))}
        </AndroidDeviceListContainer>
        <Title>Keystrokes</Title>
        {Keybinds()}
      </HelpContainer>
    </Container>
  )
}

export default Help
