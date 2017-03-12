import moment from 'moment'

export const clientCount = (numberOfClients = 0) => {
  if (numberOfClients > 0) {
    return `{right}{black-bg}{green-fg}${numberOfClients} Online{/}{/}{/}`
  } else {
    return `{right}{black-bg}{red-fg}${numberOfClients} Online{/}{/}{/}`
  }
}

export const timeStamp = () => {
  const t = moment()
  return `${t.format('HH:mm:')}{grey-fg}${t.format('ss.SS')}{/}`
}

export const formatClient = (connection = {}, prefix = '-') => {
  return `${prefix} {green-fg}[${connection.address}]{/} <${connection.userAgent}> <${connection.reactotronVersion}>`
}
