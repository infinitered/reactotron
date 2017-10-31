import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import getCommandComponent from '../Commands'
import TimelineHeader from './TimelineHeader'
import { map, isNil, filter } from 'ramda'
import AppStyles from '../Theme/AppStyles'
import Empty from '../Foundation/EmptyState'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  commands: {
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  }
}

const propertyExist = (r, ...properties) => {
  for(let key of properties) {
      if (r[key]) r = r[key];
      else return false;
  }

  return true;
};

const matchProperty = (r, regexp, ...properties) => {
  for(let key of properties) {
      if (r[key]) r = r[key];
      else return false;
  }

  return r.match && r.match(regexp) !== null;
};

const buildTree = (L, previousTree) => {
    if (!previousTree) previousTree = {};

    return L.reduce((tree, c) => {
      if(propertyExist(c, "type")) {
        if (!tree[c.type]) tree[c.type] = [];
        tree[c.type].push(c);
      }

      if (propertyExist(c, "payload", "preview")) {
        if (!tree[c.payload.preview]) tree[c.payload.preview] = [];
        tree[c.payload.preview].push(c);
      }

      if (propertyExist(c, "payload", "name")) {
        if (!tree[c.payload.name]) tree[c.payload.name] = [];
        tree[c.payload.name].push(c);
      }

      return tree;
    }, previousTree);
};

@inject('session')
@observer
class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            currentlyShowing: props.session.commands,
            searchTree: buildTree(props.session.commands),
        };
    }
  // fires when we will update
  componentWillUpdate () {
    const node = this.refs.commands
    // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
    // remember our height, position, and if we're at the top
    this.scrollHeight = node.scrollHeight
    this.scrollTop = node.scrollTop
    this.isPinned = this.scrollTop === 0
  }

  // fires after we did update
  componentDidUpdate () {
    // should we be pinned to top, let's not auto-scroll
    if (this.isPinned) return
    const node = this.refs.commands
    // scroll to the place we were before
    // TODO: this falls apart as we reach max queue size as the scrollHeigh no longer changes
    node.scrollTop = this.scrollTop + node.scrollHeight - this.scrollHeight
  }

  componentWillReceiveProps(nextProps) {
      let {commands: current} = this.props.session,
          {commands: next}    = nextProps.session;

      if (current.length === next.length) {
          return;
      }

      this.setState({
          searchTree: buildTree(next.slice(current.length), this.state.searchTree),
      });
  }

  renderEmpty () {
    return (
      <Empty icon='reorder' title='No Activity'>
        <p>Once your app connects and starts sending events, they will appear here.</p>
      </Empty>
    )
  }

  onFilter = (t) => {
    let {commands} = this.props.session;

    if (this.state.inputValue) {
        commands = t.length < this.state.inputValue.length 
            ? commands
            : this.state.currentlyShowing;
    }
    
    let regexp = new RegExp(t.replace(/\s/, "."), "i");
    this.setState({
        inputValue: t,
        currentlyShowing: filter((c) => this.filterCommands(regexp, c), commands),
    });
  }

  filterCommands = (regexp, c) => {
      return matchProperty(c, regexp, "type")
        || matchProperty(c, regexp, "payload", "preview")
        || matchProperty(c, regexp, "payload", "name");
  }

  render () {
    // grab the commands, but sdrawkcab
    const commands = this.props.session.commands
    const isEmpty = commands.length === 0

    const renderItem = command => {
      const CommandComponent = getCommandComponent(command)
      if (isNil(CommandComponent)) return null
      return <CommandComponent key={command.messageId} command={command} />
    }

    return (
      <div style={Styles.container}>
        <TimelineHeader onFilter={this.onFilter} />
        {isEmpty && this.renderEmpty()}
        <div style={Styles.commands} ref='commands'>
          {map(renderItem, this.state.currentlyShowing)}
        </div>
      </div>
    )
  }
}

export default Timeline
