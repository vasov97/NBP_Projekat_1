module.exports = {
    matchUserByEmail : 'MATCH (user:User {email: {email}}) RETURN user',
    matchUserByUsername: 'MATCH (user:User {username:{username}}) RETURN user',
    createUser: 'CREATE (user:User {username :{username}, password : {password}, email : {email}}) RETURN user',
    likePost: "MATCH (user:User), (post:Post) WHERE user.username=$username AND post.title=$postTitle "
            + "MERGE (user)-[l:Likes]->(post) "
            + "ON CREATE SET l.date=$date "
            + "RETURN l",
    dislikePost:"MATCH (user:User),(post:Post) WHERE user.username=$username AND post.title=$postTitle "
            +   "OPTIONAL MATCH (user)-[l:Likes]-(post) DELETE l"
}


