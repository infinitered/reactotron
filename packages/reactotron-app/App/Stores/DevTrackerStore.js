import { computed, observable, action, asMap } from "mobx"

const TIME_NAME = 'devTrackerTimeConnected'
const ERROR_NAME = 'devTrackerErrorsCount'

class DevTracker {
    @observable storedTime = 0
    @observable currentErrors = 0

    @observable sessionStarted = null

    constructor() {
        const currentDevTime = localStorage.getItem(TIME_NAME)
        const currentErrors = localStorage.getItem(ERROR_NAME)

        if (typeof currentDevTime === 'undefined' || currentDevTime === null) {
            localStorage.setItem(TIME_NAME, 0)
        } else {
            this.storedTime = parseInt(currentDevTime, 10)
        }

        if (typeof currentErrors === 'undefined' || currentErrors === null) {
            localStorage.setItem(ERROR_NAME, 0)
        } else {
            this.currentErrors = parseInt(currentErrors, 10)
        }
    }

    @computed
    get connectionTime() {
        let currentSessionTime = 0

        if (this.sessionStarted) {
            const currentTime = new Date()
            currentSessionTime = (currentTime.getTime() - this.sessionStarted.getTime()) / 1000
        }

        return this.storedTime + Math.floor(currentSessionTime)
    }

    @computed
    get errorsPerSecond() {
        const currentConnectionTime = this.connectionTime

        if (currentConnectionTime === 0) return 0

        return this.currentErrors / currentConnectionTime
    }

    @action
    connectionStarted = () => {
        if (!this.sessionStarted) {
            this.sessionStarted = new Date()
        }
    }

    @action
    connectionFinished = () => {
        if (!this.sessionStarted) return

        const currentTime = new Date()
        const connectionLength = Math.floor((currentTime.getTime() - this.sessionStarted.getTime()) / 1000)
        this.sessionStarted = null

        this.storedTime += connectionLength
        localStorage.setItem(TIME_NAME, this.storedTime)
    }

    @action
    addError = () => {
        this.currentErrors += 100

        localStorage.setItem(ERROR_NAME, this.currentErrors)
    }
}

export default DevTracker
