import * as React from "react"

interface Props {
  suggestions: Array<string>
  forwardedRef: any
  onChange: (e: any) => void
}

interface State {
  activeSuggestion: number
  filteredSuggestions: Array<string>
  showSuggestions: boolean
  userInput: string
}

class Autocomplete extends React.Component<Props, State> {
  state = {
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: "",
  }

  // Event fired when the input value is changed
  onChange = (e: any) => {
    const { suggestions, onChange } = this.props
    const userInput = e.currentTarget.value

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      // tslint:disable-next-line:trailing-comma
      suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    )

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    })
    onChange(e)
  }

  // Event fired when the user clicks on a suggestion
  onClick = (e: any) => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    })
  }

  // Event fired when the user presses a key down
  onKeyDown = (e: any) => {
    const { activeSuggestion, filteredSuggestions } = this.state

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      })
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 })
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 })
    }
  }

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: { activeSuggestion, filteredSuggestions, showSuggestions, userInput },
      props: { forwardedRef, ...rest },
    } = this

    let suggestionsListComponent

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active"
              }

              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              )
            })}
          </ul>
        )
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        )
      }
    }

    return (
      <>
        <input
          type="text"
          {...rest}
          ref={forwardedRef}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
      </>
    )
  }
}

export default Autocomplete
