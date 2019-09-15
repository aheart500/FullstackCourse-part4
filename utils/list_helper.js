const dummy = (blogs) =>{
    return 1
}


const totalLikes = (blogPosts) =>{
    return blogPosts.reduce((total,post)=>{
        return total += post.likes
    },0)
}


const favoriteBlog = (blogs) => {
    const mostLikes = Math.max(...blogs.map(blog => blog.likes))
    let mostLikedPost = blogs.find(blog => blog.likes === mostLikes)
    mostLikedPost = {
        title : mostLikedPost.title,
        author : mostLikedPost.author,
        likes : mostLikes
    }
    return mostLikedPost
}

const mostBlogs = (blogs) =>{
    let authorsObject = {}
    blogs.forEach(blog => {
        if(authorsObject[blog.author]){
            authorsObject = {
                ...authorsObject,
                [blog.author] : authorsObject[blog.author] +1 
            }
        }else{
            authorsObject = {
                ...authorsObject,
                [blog.author] : 1
            }
        }
    })
    let max = 0
    let mostBloggingAuthor = {}
    for (let author in authorsObject){
        if(authorsObject[author]> max){
            mostBloggingAuthor={
                author : author,
                blogs : authorsObject[author]
            }
            max = authorsObject[author]
        }
    }
    return mostBloggingAuthor
}
const mostLikes = (blogs) => {
    let authorsObject  = {}
    blogs.forEach(blog => {
        if(authorsObject[blog.author]){
            authorsObject = {
                ...authorsObject,
                [blog.author] : authorsObject[blog.author] + blog.likes
            }
        }else{
            authorsObject = {
                ...authorsObject,
                [blog.author] : blog.likes
            }
        }
    })
    let max = 0
    let mostLikedAuthor = {}
    for (let author in authorsObject){
        if(authorsObject[author]> max){
            mostLikedAuthor={
                author : author,
                likes : authorsObject[author]
            }
            max = authorsObject[author]
        }
    }
    return mostLikedAuthor
}


module.exports = {dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes}

