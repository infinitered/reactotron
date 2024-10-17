import React, { useCallback, useContext, useMemo } from "react"
import styled from "styled-components"
import { Header, ReactotronContext, TreeView, ApolloClientContext, theme } from "reactotron-core-ui"
import { MdSearch, MdWarning } from "react-icons/md"
import { HiDocumentSearch, HiOutlinePencilAlt } from "react-icons/hi"
import lodashDebounce from "lodash.debounce"
import { TbDatabaseDollar } from "react-icons/tb"
import { Title } from "../reactNative/components/Shared"
import { OverlayButton } from "./components/Button"
import { CommandType } from "reactotron-core-contract"
import { FaTimes } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"

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
  justify-content: space-between;
`

const WarningContainer = styled.div`
  display: flex;
  color: ${(props) => props.theme.warning};
  background-color: ${(props) => props.theme.backgroundDarker};
  border-top: 1px solid ${(props) => props.theme.chromeLine};
  align-items: center;
  padding: 0 20px;
`
const WarningDescription = styled.div`
  margin-left: 20px;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-right: 10px;
`
const SearchLabel = styled.p`
  padding: 0 10px;
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
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

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

let timer: ReturnType<typeof setTimeout>

function debounce(func: (...args: any) => any, timeout = 7000): void {
  clearTimeout(timer)
  timer = setTimeout(() => {
    // @ts-expect-error add typings for this
    func.apply(this, args)
  }, timeout)
}

const INITIAL_DATA = {
  id: "x",
  lastUpdateAt: new Date(),
  queries: [],
  mutations: [],
  cache: [],
}

function Cache() {
  const [data, setData] = React.useState<any>(INITIAL_DATA)
  const { sendCommand, addCommandListener } = React.useContext(ReactotronContext)
  const { isSearchOpen, toggleSearch, closeSearch, setSearch, search } =
    useContext(ApolloClientContext)

  // const sendMessage = React.useCallback(() => {
  //   sendCommand("apollo.request", {})
  // }, [sendCommand])

  // send polling apollo.request command every half second
  React.useEffect(() => {
    const interval = setInterval(() => {
      sendCommand("apollo.request", {})
    }, 1000)
    return () => clearInterval(interval)
  }, [sendCommand])

  // const updateFragment = React.useCallback(() => {
  //   sendCommand("apollo.fragment.update", { message: "Title from server" })
  // }, [sendCommand])

  const resyncData = React.useCallback(() => {
    debounce(() => {
      sendCommand("apollo.request", {})
    })
  }, [sendCommand])

  React.useEffect(() => {
    addCommandListener((command) => {
      if (command.type === CommandType.ApolloClientResponse) {
        // TODO reorder the way things come in so recent is at top
        // see https://github.com/expo/dev-plugins/blob/main/packages/apollo-client/webui/src/App.tsx#L44-L46
        setData(command.payload)
        sendCommand("apollo.ack", {})
        resyncData()
      }
    })
  }, [addCommandListener, sendCommand, resyncData])

  React.useEffect(() => {
    sendCommand("apollo.request", {})
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [setSearch]
  )

  // const { searchString, handleInputChange } = useDebouncedSearchInput(search, setSearch, 300)

  let { cacheKey } = useParams()
  const cacheData = data.cache[cacheKey] ?? "No data found"

  const valueRenderer = (transformed: any, untransformed: any, ...keyPath: any) => {
    if (keyPath[0] === "__ref") {
      return (
        <StyledLink to={`/apolloClient/cache/${untransformed}`}>
          <SpanContainer>{untransformed || transformed}</SpanContainer>
        </StyledLink>
      )
    } else {
      return <SpanContainer>{untransformed || transformed}</SpanContainer>
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
        actions={[
          {
            tip: "Search",
            icon: MdSearch,
            onClick: () => {
              toggleSearch()
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput autoFocus value={search} onChange={handleInputChange} />
            <ButtonContainer>
              <FaTimes size={24} />
            </ButtonContainer>
          </SearchContainer>
        )}
      </Header>
      <CacheContainer>
        <WarningContainer>
          <MdWarning size={60} />
          <WarningDescription>This is preview feature.</WarningDescription>
        </WarningContainer>
        <RowContainer>
          <LeftPanel>
            {Object.keys(data.cache)
              .filter((key) => {
                if (search) {
                  return key.toLowerCase().includes(search.toLowerCase())
                }

                return key
              })
              .map((key: string) => {
                const LinkWrapper = key === cacheKey ? SelectedCacheKeyLink : CacheKeyLink
                return (
                  <LinkWrapper to={`/apolloClient/cache/${key}`}>
                    <CacheKeyLabel key={key}>{key}</CacheKeyLabel>
                  </LinkWrapper>
                )
              })}
          </LeftPanel>
          {cacheKey && (
            <RightPanel>
              <TopSection>
                <Title>Cache ID: {cacheKey}</Title>
                <Link to="/apolloClient/cache">
                  <FaTimes size={24} color={theme.foregroundDark} />
                </Link>
              </TopSection>

              <TreeView value={{ [cacheKey]: cacheData }} level={5} valueRenderer={valueRenderer} />
            </RightPanel>
          )}
        </RowContainer>
      </CacheContainer>
    </Container>
  )
}

export default Cache

// const useDebouncedSearchInput = (
//   initialValue: string,
//   setSearch: (search: string) => void,
//   delay: number = 300
// ) => {
//   const [searchString, setSearchString] = React.useState<string>(initialValue)
//   const debouncedOnChange = useMemo(() => debounce(setSearch, delay), [delay, setSearch])

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { value } = e.target
//       setSearchString(value)
//       debouncedOnChange()
//     },
//     [debouncedOnChange]
//   )

//   return {
//     searchString,
//     handleInputChange,
//   }
// }
