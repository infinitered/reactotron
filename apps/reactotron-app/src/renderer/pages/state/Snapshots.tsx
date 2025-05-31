import React, { useContext, useState } from "react"
import {
  ContentView,
  SnapshotRenameModal,
  StateContext,
  Header,
  EmptyState,
  Tooltip,
} from "reactotron-core-ui"
import type { Snapshot } from "reactotron-core-ui"
import styled from "styled-components"
import {
  MdCreate,
  MdDelete,
  MdFileUpload,
  MdNotificationsNone,
  MdImportExport,
  MdCallReceived,
  MdFileDownload,
} from "react-icons/md"
import { clipboard } from "../../util/ipc"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const SnapshotsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

const SnapshotContainer = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.line};
`
const SnapshotDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
`
const SnapshotName = styled.div`
  flex: 1;
  color: ${(props) => props.theme.tag};
  text-align: left;
`
const SnapshotAction = styled.div`
  color: ${(props) => props.theme.foreground};
  padding-left: 10px;
`
const SnapshotPreview = styled.div`
  animation: fade-up 0.25s;
  will-change: transform opacity;
  padding: 0 40px 30px 40px;
`

function SnapshotItem({
  snapshot,
  restoreSnapshot,
  removeSnapshot,
  openSnapshotRenameModal,
}: {
  snapshot: Snapshot
  restoreSnapshot: (snapshot: Snapshot) => void
  removeSnapshot: (snapshot: Snapshot) => void
  openSnapshotRenameModal: (snapshot: Snapshot) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SnapshotContainer>
      <SnapshotDetailRow
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <SnapshotName>{snapshot.name}</SnapshotName>
        <SnapshotAction
          data-tip="Copy to clipboard"
          data-for="copy-to-clipboard"
          onClick={(e) => {
            e.stopPropagation()
            clipboard.writeText(JSON.stringify(snapshot))
          }}
        >
          <MdCallReceived size={24} />
          <Tooltip id="copy-to-clipboard" />
        </SnapshotAction>
        <SnapshotAction
          data-tip="Restore Snapshot"
          data-for="restore-snapshot"
          onClick={(e) => {
            e.stopPropagation()
            restoreSnapshot(snapshot)
          }}
        >
          <MdFileUpload size={24} />
          <Tooltip id="restore-snapshot" />
        </SnapshotAction>
        <SnapshotAction
          data-tip="Rename Snapshot"
          data-for="rename-snapshot"
          onClick={(e) => {
            e.stopPropagation()
            openSnapshotRenameModal(snapshot)
          }}
        >
          <MdCreate size={24} />
          <Tooltip id="rename-snapshot" />
        </SnapshotAction>
        <SnapshotAction
          data-tip="Delete Snapshot"
          data-for="delete-snapshot"
          onClick={(e) => {
            e.stopPropagation()
            removeSnapshot(snapshot)
          }}
        >
          <MdDelete size={24} />
          <Tooltip id="delete-snapshot" />
        </SnapshotAction>
      </SnapshotDetailRow>
      {isOpen && (
        <SnapshotPreview>
          <ContentView value={snapshot.state} />
        </SnapshotPreview>
      )}
    </SnapshotContainer>
  )
}

function Snapshots() {
  const {
    snapshots,
    createSnapshot,
    restoreSnapshot,
    removeSnapshot,
    openSnapshotRenameModal,
    isSnapshotRenameModalOpen,
    closeSnapshotRenameModal,
    renameingSnapshot,
    renameSnapshot,
  } = useContext(StateContext)

  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Subscriptions",
            icon: MdNotificationsNone,
            isActive: false,
            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/state/subscriptions"
            },
          },
          {
            text: "Snapshots",
            icon: MdImportExport,
            isActive: true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
        ]}
        actions={[
          {
            tip: "Copy all snapshots to clipboard",
            icon: MdCallReceived,
            onClick: () => {
              clipboard.writeText(JSON.stringify(snapshots))
            },
          },
          {
            tip: "Add Snapshot",
            icon: MdFileDownload,
            onClick: () => {
              createSnapshot()
            },
          },
        ]}
      />
      <SnapshotsContainer>
        {snapshots.length === 0 ? (
          <EmptyState icon={MdImportExport} title="No Snapshots">
            To take a snapshot of your current redux or mobx-state-tree store, press the Download
            button in the top right corner of this window.
          </EmptyState>
        ) : (
          snapshots.map((snapshot) => (
            <SnapshotItem
              key={snapshot.id}
              snapshot={snapshot}
              restoreSnapshot={restoreSnapshot}
              removeSnapshot={removeSnapshot}
              openSnapshotRenameModal={openSnapshotRenameModal}
            />
          ))
        )}
      </SnapshotsContainer>
      <SnapshotRenameModal
        snapshot={renameingSnapshot}
        isOpen={isSnapshotRenameModalOpen}
        onClose={closeSnapshotRenameModal}
        onRenameSnapshot={renameSnapshot}
      />
    </Container>
  )
}

export default Snapshots
