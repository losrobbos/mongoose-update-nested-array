// method 1: by accessing subdocuments through parent
// const postUpdated = await Post.findById(postId)
// postUpdated.likes.push(liker)
// await postUpdated.save()

// method 2: update query
// const postUpdated = await Post.findByIdAndUpdate(req.params.id,
//   {
//     $addToSet: { likes: liker }
//   },
//   {
//     new: true,
//   });


// ### UPDATE POST
// POST {{BASE_URL}}/post/63ef2defd0ea87b0b4f51381/likes
// Content-Type: application/json

// {
//   "liker": "63ef2d2b08eeda56361f44eb"
// }


