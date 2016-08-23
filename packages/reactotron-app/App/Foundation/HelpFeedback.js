import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { shell } from 'electron'

const Styles = {
  container: {
    color: Colors.foreground,
    marginBottom: 50
  },
  content: {
    ...AppStyles.Layout.hbox,
    alignItems: 'flex-start'
  },
  iconSize: 40,
  link: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
    cursor: 'pointer',
    backgroundColor: Colors.chrome,
    margin: 5,
    borderRadius: 8,
    width: 100,
    border: `1px solid ${Colors.chromeLine}`
  },
  icon: {
    marginBottom: 8,
    color: Colors.foregroundLight
  },
  text: {
  },
  spacer: {
    flex: 1
  }
}

const RepoIcon = require('react-icons/lib/go/mark-github')
const FeedbackIcon = require('react-icons/lib/go/comment')
const ReleaseIcon = require('react-icons/lib/go/squirrel')
const TwitterIcon = require('react-icons/lib/fa/twitter')

class HelpFeedback extends Component {

  constructor (props) {
    super(props)
    this.openRepo = () => shell.openExternal('https://github.com/reactotron/reactotron/tree/next')
    this.feedback = () => shell.openExternal('https://github.com/reactotron/reactotron/issues/new')
    this.checkUpdates = () => shell.openExternal('https://github.com/reactotron/reactotron/releases')
    this.twitter = () => shell.openExternal('https://twitter.com/reactotron')
  }

  render () {
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.link} onClick={this.openRepo}>
            <RepoIcon size={Styles.iconSize} style={Styles.icon} />
            <div style={Styles.text}>Repo</div>
          </div>

          <div style={Styles.link} onClick={this.feedback}>
            <FeedbackIcon size={Styles.iconSize} style={Styles.icon} />
            <div style={Styles.text}>Feedback</div>
          </div>

          <div style={Styles.link} onClick={this.checkUpdates}>
            <ReleaseIcon size={Styles.iconSize} style={Styles.icon} />
            <div style={Styles.text}>Updates</div>
          </div>

          <div style={Styles.link} onClick={this.twitter}>
            <TwitterIcon size={Styles.iconSize} style={Styles.icon} />
            <div style={Styles.text}>@reactotron</div>
          </div>

          <div style={Styles.spacer}></div>
        </div>
      </div>
    )
  }
}

export default HelpFeedback
