// import ClientIntroCommand from "./ClientIntroCommand"

enum CommandTypes {
  ClientIntro = "client.intro",
}

function timelineCommandResolver(type: CommandTypes) {
  switch (type) {
    // case CommandTypes.ClientIntro:
    //   return ClientIntroCommand
    default:
      return null
  }
}

export default timelineCommandResolver
