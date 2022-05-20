const postSchema = require('@schemas/socialMedia-post-schema')
const updateLogs = require('./update-logs')
const pointsCongrats = require('./points-congrats')

const fetchPosts = async (client, approvedPosts, approvedPostsCount) => {
  const postArr = await postSchema.find()
  if (postArr) {
    postArr.forEach(async (post) => {
      if (post['approved'] == "article") {
        for (var i = 0; i < 5; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post article"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **5 BRPs** just added to your account from article post!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
        // post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "video") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post video"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **8 BRPs** just added to your account from video post!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "snapshot") {
        for (var i = 0; i < 2; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post snapshot"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **2 BRPs** just added to your account from snapshot post!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "design") {
        for (var i = 0; i < 3; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post poster design"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **3 BRPs** just added to your account from design post!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "deck") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post deck"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **8 BRPs** just added to your account from deck post!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "lecture") {
        for (var i = 0; i < 10; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post lecture video"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **10 BRPs** just added to your account from lecture post!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
      if (post['approved'] == "report") {
        for (var i = 0; i < 20; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && (
          updateLogs(post['userId'], "post report"),
          pointsCongrats(client, "948732804999553034", "964271022616502283", `<@${post['userId']}> **20 BRPs** just added to your account from report post!`),
          await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" }))
      }
    })
  }
}

module.exports = async (client, approvedPosts, approvedPostsCount) => {
  fetchPosts(client, approvedPosts, approvedPostsCount)
}