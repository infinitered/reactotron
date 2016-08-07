import gemoji from 'gemoji'
import R from 'ramda'

// A way to add extra spacing for emoji characters. As it
// turns out, the emojis are double-wide code points, but
// the terminal renders it as a single slot.  I literally
// understand nothing anymore.  Seems to work great tho!
const keys = R.keys(gemoji.unicode)
const emojiPattern = '(' + keys.join('|') + ')+'
const emojiRegex = new RegExp(emojiPattern, 'g')
export const addSpaceForEmoji = (str) => str.replace(emojiRegex, '$1 ')
