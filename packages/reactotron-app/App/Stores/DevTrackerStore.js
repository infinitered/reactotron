import { computed, observable, action, asMap } from "mobx"

const TIME_NAME = 'devTrackerTimeConnected'
const ERROR_NAME = 'devTrackerErrorsCount'

class DevTracker {
    @observable connectedSeconds = 0
    @observable totalErrors = 0

    sessionInterval = null
    lastError = null

    constructor() {
        const storedSeconds = localStorage.getItem(TIME_NAME)
        const storedErrors = localStorage.getItem(ERROR_NAME)

        if (typeof storedSeconds === 'undefined' || storedSeconds === null) {
            localStorage.setItem(TIME_NAME, 0)
        } else {
            this.connectedSeconds = parseInt(storedSeconds, 10)
        }

        if (typeof storedErrors === 'undefined' || storedErrors === null) {
            localStorage.setItem(ERROR_NAME, 0)
        } else {
            this.totalErrors = parseInt(storedErrors, 10)
        }
    }

    @computed
    get errorsPerSecond() {
        if (this.connectedSeconds === 0) return 0

        return Math.round((this.totalErrors / this.connectedSeconds) * 100) / 100
    }

    @computed
    get formattedTime() {
        let timeLeft = this.connectedSeconds
        const days = Math.floor(timeLeft / 86400)
        timeLeft %= 86400
        let hours = Math.floor(timeLeft / 3600)
        timeLeft %= 3600
        let minutes = Math.floor(timeLeft / 60)
        let seconds = timeLeft % 60

        let timeString = []

        if (days > 0) {
            timeString.push(`${days} day${days > 1 ? 's' : ''}`)
        }

        if (hours > 0) {
            timeString.push(`${hours} hour${hours > 1 ? 's' : ''}`)
        }

        if (minutes > 0) {
            timeString.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
        }

        timeString.push(`${seconds} second${seconds > 1 ? 's' : ''}`)

        return timeString.join(', ')
    }

    @computed
    get errorsPerMinute() {
        if (this.connectedSeconds === 0) return 0

        // If we have been connected < a minute then we don't want to try and do predictions (which would be what happens when we divide by < 1)
        const connectedMinutes = this.connectedSeconds > 60 ? this.connectedSeconds / 60 : 1

        return Math.round((this.totalErrors / connectedMinutes) * 100) / 100
    }

    @computed
    get errorsPerHour() {
        if (this.connectedSeconds === 0) return 0

        // If we have been connected < a hour then we don't want to try and do predictions (which would be what happens when we divide by < 1)
        const connectedHours = this.connectedSeconds > 3600 ? this.connectedSeconds / 60 / 60 : 1

        return Math.round((this.totalErrors / connectedHours) * 100) / 100
    }

    @action
    connectionStarted = () => {
        if (!this.sessionInterval) {
            this.sessionInterval = setInterval(this.tick, 1000)
        }
    }

    @action
    connectionFinished = () => {
        if (!this.sessionInterval) return

        clearInterval(this.sessionInterval)
        this.sessionInterval = null
    }

    @action
    addError = () => {
        const currentDate = new Date()

        // If the last recorded error was less then 5 seconds ago lets not count again. This prevents getting double (or triple!) hit if an error causes another error
        if (this.lastError && currentDate.getTime() - this.lastError.getTime() < 5000) return

        this.lastError = currentDate
        this.totalErrors += 1

        localStorage.setItem(ERROR_NAME, this.totalErrors)
    }

    @action
    tick = () => {
        this.connectedSeconds += 1

        // TODO: Is this terrible to do once a second? Maybe? Should we throttle this?
        localStorage.setItem(TIME_NAME, this.connectedSeconds)
    }
}

export default DevTracker
