module.exports={
    matchAllPostComments: 'MATCH (user)-[:Comments]->(comm:Comment)-[:IsCommentOf]->(post:Post {title:$title}) '
                        + 'RETURN comm,user.username',
    createComment:"MATCH (user:User),(post:Post) WHERE user.username=$username AND post.title=$title "
               + "CREATE (user)-[c:Comments]->(comm:Comment{text:$text})-[:IsCommentOf]->(post) "
               + "RETURN c as commentId",
    deleteComment:"MATCH (comm:Comment) WHERE ID(comm)=$commId DETACH DELETE comm"
}