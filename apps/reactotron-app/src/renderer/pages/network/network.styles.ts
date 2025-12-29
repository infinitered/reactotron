import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
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
    overflow-y: auto;
    background-color: ${(props) => props.theme.backgroundSubtleLight};
    border-right: 1px solid ${(props) => props.theme.border};
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
    justify-content: flex-start;
    padding-left: .5vw;
    
    &:hover {
        background-color: ${(props) => props.theme.backgroundLighter};
    }
    
    &.active {
        background-color: ${(props) => props.theme.backgroundLighter};
        border-left: 3px solid ${(props) => props.theme.tag};
        padding-left: 13px;
        font-weight: 500;
    }
    
    p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: small;
    }
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

const RequestMethodStatus = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;
    padding: 8px 12px;
    padding-left: 16px;
    margin-right: 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
`;

const RequestAvailableTabsContainer = styled.div`
    display: flex;
`

const HttpMethod = styled.span<{ method?: string }>`
    color: ${(props) => {
        const method = props.method?.toUpperCase();
        switch (method) {
            case 'GET': return '#61affe';
            case 'POST': return '#49cc90';
            case 'PUT': return '#fca130';
            case 'PATCH': return '#50e3c2';
            case 'DELETE': return '#f93e3e';
            default: return props.theme.foreground;
        }
    }};
    font-weight: 700;
    letter-spacing: 0.5px;
`;

const StatusCode = styled.span<{ status?: number }>`
    color: ${(props) => {
        const status = props.status;
        if (!status) return props.theme.foregroundDark;
        if (status >= 200 && status < 300) return '#49cc90';
        if (status >= 300 && status < 400) return '#61affe';
        if (status >= 400 && status < 500) return '#fca130';
        if (status >= 500) return '#f93e3e';
        return props.theme.foregroundDark;
    }};
    font-weight: 700;
`;

const StatusSeparator = styled.span`
    color: ${(props) => props.theme.foregroundDark};
    opacity: 0.5;
`;

const Duration = styled.span`
    color: ${(props) => props.theme.foregroundLight};
    font-weight: 600;
    font-size: 12px;
`;

const RequestResponseContainerBody = styled.div`
    overflow-y: auto;
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
    RequestDataHeader,
    RequestAvailableTabsContainer,
    RequestResponseContainerBody,
    ResizeHandle,
    RequestMethodStatus,
    HttpMethod,
    StatusCode,
    StatusSeparator,
    Duration,
}

export default Styles;

