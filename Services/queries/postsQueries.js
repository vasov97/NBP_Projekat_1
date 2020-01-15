module.exports={
    createPost: 'MATCH (user:User {username:{username}})'+
                'CREATE (post:Post {title:{title}, ingredients : {ingredients}, description : {description}, createdAt : {createdAt}})'+
                'CREATE (user)-[r:Posted]->(post) RETURN r',
    connectPostTypes: 'MATCH (post:Post {title:{title}})'+
                      'MERGE (type:Type {type:{type}})'+
                      'CREATE (post)-[r:IsOf]->(type)',
    getNewestPosts:'MATCH(post:Post) RETURN post ORDER BY post.createdAT LIMIT 25',
    matchPostByUser:'MATCH (user:User {username: {username}})-[:Posted]->(post) RETURN post',
    matchPostByTitle:'MATCH (post:Post {title: {title}}) RETURN post',
    matchPostByType:'MATCH (post:Post)-[:IsOf]->(type:Type) WHERE post.title=$postTitle RETURN type',
    matchTypesByPost:"MATCH (post:Post)-[:IsOf]->(type:Type) WHERE post.title=$postTitle RETURN type",
    matchMostLikedPosts:"MATCH (user:User)-[l:Likes]->(post:Post) "
                    +   "RETURN post, COUNT(l) as numberOfLikes "
                    +   "ORDER BY numberOfLikes DESC "
                    +   "LIMIT $topN",
    getNumOfLikes:"MATCH (user:User)-[l:Likes]->(post:Post) "
                + "WHERE post.title = {title} "
                + "RETURN COUNT(l) as numOfLikes",

    deletePost:"MATCH (post:Post) WHERE post.title=$postTitle DETACH DELETE post",

    editPost:"MATCH (post:Post) WHERE post.title=$postTitle "
            +"SET post.description=$postDescription, post.ingredients=$ingredients RETURN post",

    deleteTypeInPost:"MATCH (post:Post {title:$title}),(t:Type {type:$typeName}) "
                    +"OPTIONAL MATCH (post)-[r:IsOf]->(t) "
                    +"DELETE r",

    addTypeToPost:"MATCH (post:Post {title:$postTitle})  "
                + "MERGE (type:Type {type:$typeName})"
                + "MERGE (post)-[r:IsOf]->(type)",
   
    isPostLiked:"MATCH (user:User), (post:Post) "
                + "WHERE user.username = $username AND post.title = $title "
                + "RETURN EXISTS ((user)-[:Likes]->(post)) AS isLiked",
    getUserFromPost:"MATCH (user:User)-[:Posted]->(post:Post) "
                + "WHERE post.title = $title "
                + "RETURN user"
}