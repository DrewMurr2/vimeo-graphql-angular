const { gql } = require("apollo-server");
const typeDefs = gql `
  type Query {
    videos: [Video]
  }
  type Video {
    uri: String,
    name: String,
    description: String,
    type: String,
    link: String,
    duration: Int,
    width: Int,
    language: String,
    height: Int,
    embed: Embed
  }
  type Embed {
    buttons: Button,
    logos: Logo,
    title: Title,
    playbar: Boolean,
    volumn: Boolean,
    speed: Boolean,
    color: String
    uri: String,
    html: String!,
    badges: Badge
  }
  type Button {
    like: Boolean,
    watchlater: Boolean,
    share: Boolean,
    embed: Boolean,
    hd: Boolean,
    fullscreen: Boolean,
    scaling: Boolean
  }
  type Logo {
    vimeo: Boolean,
    custom: Custom
  }
  type Custom {
    active: Boolean,
    link: String,
    sticky: Boolean
  }
  type Title {
    name: String,
    owner: String,
    portrait: String
  }
  type Badge {
    hdr: Boolean,
    live: Live,
    staff_pick: Staff,
    vod: Boolean,
    wekend_challenge: Boolean
  }
  type Live {
    streaming: Boolean,
    archived: Boolean
  }
  type Staff {
    normal: Boolean,
    best_of_the_month: Boolean,
    best_of_the_year: Boolean,
    premiere: Boolean
  }
  type Response {
    response : String 
  }
  type Mutation {
    createVideo(file: Upload!, videoName: String!, videoDescription: String! ): Response #video URI
    deleteVideo(videoURI: ID) : Response
    updateVideo(file: Upload!, videoURI: ID) : Response
  }
`
module.exports = typeDefs;