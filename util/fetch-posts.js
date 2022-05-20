const postSchema = require('@schemas/socialMedia-post-schema')
const updateLogs = require('./update-logs')

const fetchPosts = async (approvedPosts, approvedPostsCount) => {
  const postArr = await postSchema.find()
  if (postArr) {
    postArr.forEach(async (post) => {
      if (post['approved'] == "article") {
        for (var i = 0; i < 5; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && updateLogs(post['userId'], "post article")
        post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "video") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && updateLogs(post['userId'], "post video")
        post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "snapshot") {
        for (var i = 0; i < 2; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && updateLogs(post['userId'], "post snapshot")
        post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "design") {
        for (var i = 0; i < 3; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && updateLogs(post['userId'], "post poster design")
        post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "deck") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && updateLogs(post['userId'], "post deck")
        post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "lecture") {
        for (var i = 0; i < 10; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && updateLogs(post['userId'], "post lecture video")
        post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
      if (post['approved'] == "report") {
        for (var i = 0; i < 20; i++) approvedPosts.push(post['userId'])
        approvedPostsCount.push(post['userId'])
        // log the checkin directly
        post['hasRewarded'] == "0" && updateLogs(post['userId'], "post report")
        post['hasRewarded'] == "0" && await postSchema.updateOne({ _id: post['_id'] }, { hasRewarded: "1" })
      }
    })
  }
}

module.exports = async (approvedPosts, approvedPostsCount) => {
  fetchPosts(approvedPosts, approvedPostsCount)
}