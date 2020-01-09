import { useContext } from "react";

import ReactotronContext from "../Reactotron";

function useTimeline() {
    const { commands } = useContext(ReactotronContext)
}
