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
} from "reactotron-core-ui"
import { TbDatabaseDollar } from "react-icons/tb"
import { Title } from "../reactNative/components/Shared"
import { CommandType } from "reactotron-core-contract"
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaTimes } from "react-icons/fa"
import { PiPushPinFill, PiPushPinSlash } from "react-icons/pi"
import { Link, useNavigate, useParams } from "react-router-dom"
import { shell } from "electron"

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

let timer: ReturnType<typeof setTimeout>

function debounce(func: (...args: any) => any, timeout = 7000): void {
  clearTimeout(timer)
  timer = setTimeout(() => {
    // @ts-expect-error add typings for this
    func.apply(this, args)
  }, timeout)
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
  } = useContext(ApolloClientContext)

  // send polling apollo.request command every half second
  React.useEffect(() => {
    const interval = setInterval(() => {
      sendCommand("apollo.request", {})
    }, 1000)
    return () => clearInterval(interval)
  }, [sendCommand])

  // TODO rework this to be custom from the UI to send data from server to client
  // below is an example
  // const updateFragment = React.useCallback(() => {
  //   sendCommand("apollo.fragment.update", { message: "Title from server" })
  // }, [sendCommand])

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

  // TODO add these options to the context in order to not lose state on tab switch
  const [searchObjects, setSearchObjects] = React.useState(false)
  const [expandInitially, setExpandInitially] = React.useState(true)

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
        // actions={[
        //   {
        //     tip: "Search",
        //     icon: MdSearch,
        //     onClick: () => {
        //       toggleSearch()
        //     },
        //   },
        // ]}
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
            <Checkbox
              label="Include object values"
              onToggle={() => setSearchObjects(!searchObjects)}
              isChecked={searchObjects}
            />
            <Checkbox
              label="Expand data initially"
              onToggle={() => setExpandInitially(!expandInitially)}
              isChecked={expandInitially}
            />
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
          {cacheKey && (
            <RightPanel>
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
    </Container>
  )
}

export default Cache
