const postSchema = require('@schemas/socialMedia-post-schema')
const speakerInviteSchema = require('@schemas/speaker-invite-schema')
const updateLogs = require('./update-logs')
const pointsCongrats = require('./points-congrats')

const fetchPosts = async (client, approvedPosts, approvedPostsCount, speakerInvites, speakerInvitesCount) => {
  const postArr = await postSchema.find()
  const speakerInviteArr = await speakerInviteSchema.find()

  if(speakerInviteArr) {
    speakerInviteArr.forEach(async (invite) => {
      if(invite['speakerRole'] == 'host' && invite['approved'] == '1') {
        for (var i=0; i<10; i++) speakerInvites.push(invite['userId'])
        speakerInvitesCount.push(invite['userId'])
        // log the checkin directly
        invite['hasRewarded'] == "0" && (
          updateLogs(invite['userId'], "invite a host",
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${invite['userId']}> **10 BRPs** just added to your account from inviting a host! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await speakerInviteSchema.updateOne({ _id: invite['_id'] }, { hasRewarded: "1" }))
        )
      } else if (invite['speakerRole'] == 'mentor' && invite['approved'] == '1') {
        for (var i=0; i<30; i++) speakerInvites.push(invite['userId'])
        speakerInvitesCount.push(invite['userId'])
        // log the checkin directly
        invite['hasRewarded'] == "0" && (
          updateLogs(invite['userId'], "invite a mentor",
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${invite['userId']}> **30 BRPs** just added to your account from inviting a mentor! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await speakerInviteSchema.updateOne({ _id: invite['_id'] }, { hasRewarded: "1" }))
        )
      }
    })
  }

  if (postArr) {
    postArr.forEach(async (post) => {
      if (post['approved'] == "article") {
        for (var i = 0; i < 5; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post article"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **5 BRPs** just added to your account from article post! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
        // post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "video") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post video"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **8 BRPs** just added to your account from video post! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "snapshot") {
        for (var i = 0; i < 2; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post snapshot"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **2 BRPs** just added to your account from snapshot post! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "design") {
        for (var i = 0; i < 3; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post poster design"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **3 BRPs** just added to your account from design post! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "deck") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post deck"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **8 BRPs** just added to your account from deck post! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "lecture") {
        for (var i = 0; i < 10; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post lecture video"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **10 BRPs** just added to your account from lecture post! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "report") {
        for (var i = 0; i < 20; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post report"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **20 BRPs** just added to your account from report post! :partying_face: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
    })
  }
}

module.exports = async (client, approvedPosts, approvedPostsCount, speakerInvites, speakerInvitesCount) => {
  fetchPosts(client, approvedPosts, approvedPostsCount, speakerInvites, speakerInvitesCount)
}