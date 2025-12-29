import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`

const SDrawer = styled.div`
    top: 60px;
    right: 0;
    height: calc(100vh - 60px);
    background-color: ${(props) => props.theme.background};
    border-left: 1px solid ${(props) => props.theme.border};
    display: grid;
    grid-template-columns: 350px 10px 1fr;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`

const RequestContainer = styled.div`
    pointer-events: auto;
    background-color: ${(props) => props.theme.backgroundSubtleLight};
    border-right: 1px solid ${(props) => props.theme.border};
`;

const RequestTableHeader = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    background-color: ${(props) => props.theme.backgroundSubtleDark};
    border-bottom: 2px solid ${(props) => props.theme.border};
    padding: 0 12px;
    font-weight: 600;
    font-size: 12px;
    color: ${(props) => props.theme.foregroundDark};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const RequestTableHeaderCell = styled.div`
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const RequestItem = styled.div`
    cursor: pointer;
    pointer-events: auto;
    height: 50px;
    border-bottom: 1px solid ${(props) => props.theme.border};
    transition: all 0.2s ease;
    color: ${(props) => props.theme.foreground};
    font-size: 13px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 12px;
    
    &:hover {
        background-color: ${(props) => props.theme.backgroundLighter};
    }
    
    &.active {
        background-color: ${(props) => props.theme.backgroundLighter};
        border-left: 3px solid ${(props) => props.theme.tag};
        padding-left: 9px;
        font-weight: 500;
    }
`;

const RequestTableCell = styled.div<{ method?: string; status?: number }>`
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    
    ${(props) => props.method && `
        color: ${(() => {
            const method = props.method?.toUpperCase();
            switch (method) {
                case 'GET': return '#61affe';
                case 'POST': return '#49cc90';
                case 'PUT': return '#fca130';
                case 'PATCH': return '#50e3c2';
                case 'DELETE': return '#f93e3e';
                default: return props.theme.foreground;
            }
        })()};
        font-weight: 600;
    `}
    
    ${(props) => props.status && `
        color: ${(() => {
            const status = props.status;
            if (status >= 200 && status < 300) return '#49cc90';
            if (status >= 300 && status < 400) return '#61affe';
            if (status >= 400 && status < 500) return '#fca130';
            if (status >= 500) return '#f93e3e';
            return props.theme.foregroundDark;
        })()};
        font-weight: 600;
    `}
`;

const RequestResponseContainer = styled.div`
    width: 100%;
    pointer-events: auto;
    overflow-y: hidden;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
`;

const RequestDataHeader = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-bottom: 1px solid ${(props) => props.theme.border};
    margin: 0;
    padding: 0;
    pointer-events: auto;
    background-color: ${(props) => props.theme.backgroundSubtleLight};
    
    li {
        list-style: none;
        cursor: pointer;
        pointer-events: auto;
        padding: 12px 16px;
        color: ${(props) => props.theme.foregroundDark};
        font-size: small;
        font-weight: 500;
        text-transform: capitalize;
        transition: all 0.2s ease;
        border-bottom: 2px solid transparent;
        
        &:hover {
            color: ${(props) => props.theme.foreground};
            background-color: ${(props) => props.theme.backgroundLighter};
        }
        
        &.active {
            color: ${(props) => props.theme.tag};
            border-bottom-color: ${(props) => props.theme.tag};
        }
    }
`;

const RequestAvailableTabsContainer = styled.div`
    display: flex;
`

const RequestResponseContainerBody = styled.div`
    padding: 20px;
    flex: 1;
    height: 0;
`;

const ResizeHandle = styled.div`
    width: 5px;
    height: 100%;
    background-color: ${(props) => props.theme.border};
    cursor: col-resize;
    transition: background-color 0.2s ease;
    position: absolute;
    left: 0;
    top: 0;
    
    &:hover {
        background-color: ${(props) => props.theme.tag};
    }
    
    &:active {
        background-color: ${(props) => props.theme.tag};
    }
`;

const Styles = {
    Container,
    SDrawer,
    RequestContainer,
    RequestResponseContainer,
    RequestItem,
    RequestTableHeader,
    RequestTableHeaderCell,
    RequestTableCell,
    RequestDataHeader,
    RequestAvailableTabsContainer,
    RequestResponseContainerBody,
    ResizeHandle,
}

export default Styles;

