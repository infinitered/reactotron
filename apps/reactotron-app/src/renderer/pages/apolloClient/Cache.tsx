import React, { useCallback, useContext, useEffect } from "react"
import styled from "styled-components"
import {
  Header,
  ReactotronContext,
  TreeView,
  ApolloClientContext,
  theme,
  Checkbox,
  Tooltip,
  ApolloUpdateCacheValueModal,
} from "reactotron-core-ui"
import { TbDatabaseDollar } from "react-icons/tb"
import { Title } from "../reactNative/components/Shared"
import { ApolloClientCacheUpdatePayload, CommandType } from "reactotron-core-contract"
import {
FaArrowLeft,
FaArrowRight,
  FaCopy,
FaEdit,
FaExternalLinkAlt,
FaTimes,
} from "react-icons/fa"
import { PiPushPinFill, PiPushPinSlash } from "react-icons/pi"
import { Link, useNavigate, useParams } from "react-router-dom"
import { clipboard, shell } from "electron"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const CacheContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 10px;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-left: 10px;
`

const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
`
export const ButtonContainer = styled.div`
  padding: 10px;
  cursor: pointer;
`

const ButtonContainerDisabled = styled.div`
  padding: 10px;
  cursor: not-allowed;
`

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const IconContainer = styled.span`
  padding-left: 10px;
`

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
  justify-content: flex-start;
`

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  padding: 10px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
`

const SpanContainer = styled.span``

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.constant};
`

const CacheKeyLink = styled(Link)`
  padding: 10px;
  text-decoration: none;
`

const SelectedCacheKeyLink = styled(CacheKeyLink)`
  background-color: ${(props) => props.theme.backgroundSubtleDark};
`

const CacheKeyLabel = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
`

const Highlight = styled.span`
  background-color: yellow;
  color: black;
`

const VerticalContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const PinnedSeparator = styled.div`
  border-top: 1px solid ${(props) => props.theme.chromeLine};
  margin: 10px 0;
`

const READ_ONLY_FIELDS = ["__typename", "id"]

const HighlightText = ({ text, searchTerm }) => {
  try {
    const parts = text.toString().split(new RegExp(`(${searchTerm})`, "gi"))
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <Highlight key={index}>{part}</Highlight>
          ) : (
            part
          )
        )}
      </>
    )
  } catch (error) {
    return text
  }
}

function Cache() {
  // This could go to the context? but we grab it on mount

  const { sendCommand, addCommandListener } = React.useContext(ReactotronContext)
  const {
    closeSearch,
    setSearch,
    search,
    viewedKeys,
    setViewedKeys,
    currentIndex,
    goForward,
    goBack,
    getCurrentKey,
    pinnedKeys,
    togglePin,
    data,
    setData,
    isEditOpen,
    closeEdit,
    openEdit,
  } = useContext(ApolloClientContext)

  // send polling apollo.request command every half second
  React.useEffect(() => {
    const interval = setInterval(() => {
      sendCommand("apollo.request", {})
    }, 1000)
    return () => clearInterval(interval)
  }, [sendCommand])

  React.useEffect(() => {
    addCommandListener((command) => {
      if (command.type === CommandType.ApolloClientResponse) {
        // TODO reorder the way things come in so recent is at top ?
        setData(command.payload)
        sendCommand("apollo.ack", {})
      }
    })
  }, [addCommandListener, sendCommand, setData])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [setSearch]
  )

  const { cacheKey: routeKey } = useParams()
  const navigate = useNavigate()
  /**
   * if we have unmounted via another tab press,
   * restore the last key we were viewing when user returns here
   */
  useEffect(() => {
    if (!routeKey) {
      const lastItem = getCurrentKey()
      if (lastItem) {
        navigate(`/apolloClient/cache/${lastItem}`)
      }
    }
  }, [routeKey, getCurrentKey, navigate])

  useEffect(() => {
    // Check if cacheKey is new
    const currentItem = getCurrentKey()
    if (routeKey && currentItem !== routeKey) {
      // TODO rename `setViewedKeys` to `addKeyToHistory`
      setViewedKeys(routeKey)
    }
  }, [routeKey, setViewedKeys, getCurrentKey])

  function openURL(url) {
    shell.openExternal(url)
  }

  const cacheKey = getCurrentKey() ?? routeKey
  const cacheData = data.cache[cacheKey] ?? undefined

  const forwardDisabled = currentIndex === viewedKeys.length - 1
  const backDisabled = currentIndex <= 0
  const ForwardButtonWrapper = forwardDisabled ? ButtonContainerDisabled : ButtonContainer
  const BackButtonWrapper = backDisabled ? ButtonContainerDisabled : ButtonContainer

  const clearSearch = () => {
    if (search === "") {
      closeSearch()
    } else {
      setSearch("")
    }
  }

  const handleEditKeyValue = useCallback(
    (fieldName: string) => {
      // identify the possible composite key fields
      const keyFields = identifyKeyFields(cacheKey, cacheData)
      const identifier = {}
      keyFields.forEach((keyField) => {
        identifier[keyField] = cacheData[keyField]
      })

      if (keyFields.length > 0) {
        const updates: ApolloClientCacheUpdatePayload = {
          // @ts-expect-error fix this
          typename: cacheData.__typename,
          identifier,
          // TODO how to determine the `id` field if not `id`?
          // keyField: "id",
          // // @ts-expect-error fix this
          // keyValue: cacheData.id,
          fieldName,
          fieldValue: cacheData[fieldName],
        }

        console.log("setting initial value", typeof updates.fieldValue)

        setInitialValue(updates)
        openEdit()
      } else {
        // we need to prompt the user to something to help identify the key for this object
        // otherwise we can't properly update the cache
      }
    },
    [cacheData, cacheKey, openEdit]
  )

  // TODO add these options to the context in order to not lose state on tab switch
  // TODO also add an option for the poll time?
  const [searchObjects, setSearchObjects] = React.useState(false)
  const [expandInitially, setExpandInitially] = React.useState(true)
  const [initialValue, setInitialValue] = React.useState<ApolloClientCacheUpdatePayload>({
    fieldValue: "",
    typename: "",
    identifier: {},
    fieldName: "",
  })

  const valueRenderer = (transformed: any, untransformed: any, ...keyPath: any) => {
    if (keyPath[0] === "__ref") {
      return (
        <StyledLink
          to={`/apolloClient/cache/${untransformed}`}
          data-tip
          data-for={`ref-for-${untransformed}`}
        >
          <SpanContainer>{untransformed || transformed}</SpanContainer>
          <Tooltip id={`ref-for-${untransformed}`} effect="solid">
            {/* @ts-expect-error fix this */}
            <TreeView value={{ ...data.cache[untransformed] }} expand={true} />
          </Tooltip>
        </StyledLink>
      )
    } else {
      let onClick
      if (typeof untransformed === "string" && untransformed.startsWith("http")) {
        onClick = () => openURL(untransformed)
      }

      if (searchObjects && search) {
        return (
          <SpanContainer onClick={onClick} style={{ cursor: onClick ? "pointer" : "auto" }}>
            <HighlightText text={untransformed || transformed} searchTerm={search} />
            {!!onClick && (
              <IconContainer>
                <FaExternalLinkAlt color={theme.foregroundDark} />
              </IconContainer>
            )}

            {/* TODO don't show edit button for __typename and any key fields */}
            {cacheKey === "ROOT_QUERY" ||
              (!READ_ONLY_FIELDS.includes(keyPath[0]) && (
                <ButtonContainer
                  onClick={() => handleEditKeyValue(keyPath[0])}
                  style={{ display: "inline", padding: "0 5px" }}
                >
                  <FaEdit size={18} color={theme.foregroundDark} />
                </ButtonContainer>
              ))}
          </SpanContainer>
        )
      } else {
        return (
          <SpanContainer onClick={onClick} style={{ cursor: onClick ? "pointer" : "auto" }}>
            {untransformed || transformed}
            {!!onClick && (
              <IconContainer>
                <FaExternalLinkAlt color={theme.foregroundDark} />
              </IconContainer>
            )}

            {/* TODO don't show edit button for __typename and any key fields */}
            {cacheKey === "ROOT_QUERY" ||
              (!READ_ONLY_FIELDS.includes(keyPath[0]) && (
                <ButtonContainer
                  onClick={() => handleEditKeyValue(keyPath[0])}
                  style={{ display: "inline", padding: "0 5px" }}
                >
                  <FaEdit size={18} color={theme.foregroundDark} />
                </ButtonContainer>
              ))}
          </SpanContainer>
        )
      }
    }
  }

  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Cache",
            icon: TbDatabaseDollar,
            isActive: true,

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
          /* TODO Add queries and mutations tabs up top */
          // {
          //   text: "Queries",
          //   icon: HiDocumentSearch,
          //   isActive: false,
          //   onClick: () => {
          //     // TODO: Couldn't get react-router-dom to do it for me so I forced it.
          //     window.location.hash = "#/apolloClient/queries"
          //   },
          // },
          // {
          //   text: "Mutations",
          //   icon: HiOutlinePencilAlt,
          //   isActive: false,
          //   onClick: () => {
          //     // TODO: Couldn't get react-router-dom to do it for me so I forced it.
          //     window.location.hash = "#/apolloClient/mutations"
          //   },
          // },
        ]}
      >
        <SearchContainer>
          <VerticalContainer>
            <SearchContainer>
              <SearchInput
                placeholder="Search..."
                autoFocus
                value={search}
                onChange={handleInputChange}
              />
              <ButtonContainer onClick={clearSearch}>
                <FaTimes size={24} />
              </ButtonContainer>
            </SearchContainer>
            <Row style={{ gap: "20px", paddingLeft: "10px" }}>
              <Checkbox
                label="Search object values"
                onToggle={() => setSearchObjects(!searchObjects)}
                isChecked={searchObjects}
              />
              <Checkbox
                label="Expand data initially"
                onToggle={() => setExpandInitially(!expandInitially)}
                isChecked={expandInitially}
              />
            </Row>
          </VerticalContainer>
        </SearchContainer>
      </Header>
      <CacheContainer>
        <RowContainer>
          <LeftPanel>
            {/* always show pinnedKeys */}
            {pinnedKeys.map((key) => {
              const LinkWrapper = key === cacheKey ? SelectedCacheKeyLink : CacheKeyLink
              return (
                <Row key={key}>
                  <LinkWrapper
                    key={key}
                    // onClick={() => pushViewedKey(key)}
                    to={`/apolloClient/cache/${key}`}
                  >
                    <CacheKeyLabel>
                      <HighlightText text={key} searchTerm={search} />
                    </CacheKeyLabel>
                  </LinkWrapper>

                  <ButtonContainer onClick={() => togglePin(key)}>
                    <PiPushPinSlash size={18} color={theme.foregroundDark} />
                  </ButtonContainer>
                </Row>
              )
            })}

            {pinnedKeys.length > 0 && <PinnedSeparator />}

            {Object.keys(data.cache)
              .filter((key) => {
                if (search) {
                  if (searchObjects) {
                    const searchDataJson = JSON.stringify(data.cache[key])
                    return searchDataJson.toLowerCase().includes(search.toLowerCase())
                  } else {
                    return key.toLowerCase().includes(search.toLowerCase())
                  }
                }

                // check key is not pinned
                if (pinnedKeys.includes(key)) {
                  return false
                }

                return key
              })
              .map((key: string) => {
                const LinkWrapper = key === cacheKey ? SelectedCacheKeyLink : CacheKeyLink
                return (
                  <Row key={key}>
                    <LinkWrapper key={key} to={`/apolloClient/cache/${key}`}>
                      <CacheKeyLabel>
                        {!searchObjects ? (
                          <HighlightText text={key} searchTerm={search} />
                        ) : (
                          <SpanContainer>{key}</SpanContainer>
                        )}
                      </CacheKeyLabel>
                    </LinkWrapper>

                    <ButtonContainer onClick={() => togglePin(key)}>
                      <PiPushPinFill size={18} color={theme.foregroundDark} />
                    </ButtonContainer>
                  </Row>
                )
              })}
          </LeftPanel>
          {cacheData && (
            <RightPanel>
<Row style={{ justifyContent: "space-between" }}>
              <Row>
                <BackButtonWrapper onClick={goBack}>
                  <FaArrowLeft
                    color={backDisabled ? theme.foregroundDarker : theme.foregroundLight}
                  />
                </BackButtonWrapper>
                <ForwardButtonWrapper onClick={goForward}>
                  <FaArrowRight
                    color={forwardDisabled ? theme.foregroundDarker : theme.foregroundLight}
                  />
                </ForwardButtonWrapper>
</Row>
{cacheData !== undefined && (
                <ButtonContainer
                  onClick={() => {
                    clipboard.writeText(JSON.stringify(cacheData, null, 2))
                  }}
                >
                  <FaCopy                     color={theme.foregroundLight}                   />
                </ButtonContainer>
)}
              </Row>
              <TopSection>
                <Title>Cache ID: {cacheKey}</Title>
              </TopSection>

              {cacheData && currentIndex >= -1 && (
                <TreeView
                  value={{ ...cacheData }}
                  expand={expandInitially}
                  valueRenderer={valueRenderer}
                />
              )}
            </RightPanel>
          )}
        </RowContainer>
      </CacheContainer>

      <ApolloUpdateCacheValueModal
        isOpen={isEditOpen}
        onClose={() => {
          closeEdit()
          setInitialValue({ fieldValue: "", typename: "", identifier: {}, fieldName: "" })
        }}
        onDispatchAction={(updates) => {
          console.log({ updates })
          sendCommand(CommandType.ApolloClientUpdateCache, updates)
        }}
        initialValue={initialValue}
        cacheKey={cacheKey}
      />
    </Container>
  )
}

export default Cache

function identifyKeyFields(cacheKey, cacheObject) {
  if (!cacheKey || !cacheObject) {
    return [] // Early exit if no data is provided
  }

  // Assuming the cacheKey format could be something like "User:john:01012000"
  const keyParts = cacheKey.split(":")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const typename = keyParts.shift() // Remove the typename part
  const identifiers = keyParts // Remaining parts are the identifiers

  const keyFields = []

  // Loop through each identifier and match it against the object's properties
  identifiers.forEach((identifier) => {
    for (const [key, value] of Object.entries(cacheObject)) {
      if (value && value.toString() === identifier && !keyFields.includes(key)) {
        keyFields.push(key) // Add matching key field if not already included
      }
    }
  })

  return keyFields // Return an array of key fields
}
