import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    position: 'relative'
  },
  topShadow: {
    height: 5,
    WebkitBoxShadow: `inset 0px 2px 4px 0px ${Colors.subtleShadow}`
  },
  bottomShadow: {
    height: 5,
    WebkitBoxShadow: `inset 0px -2px 4px 0px ${Colors.subtleShadow}`
  }
}

@inject('session')
@observer
class Page extends Component {

  static propTypes = {
    tabId: PropTypes.string.isRequired,
    children: PropTypes.oneOf([PropTypes.array, PropTypes.object])
  }

  render () {
    const { children, tabId } = this.props
    let containerStyles = Styles.container
    const isShowing = this.props.session.ui.tab === tabId
    containerStyles.display = isShowing ? 'flex' : 'none'

    return (
      <div style={containerStyles}>
        <div style={Styles.topShadow}></div>
        {children}
        <div style={Styles.bottomShadow}></div>
      </div>
    )
  }

}

export default Page
