document.addEventListener('DOMContentLoaded', function() {

    load_Page('All Posts');

    document.querySelector('#newPostForm').addEventListener('submit', event => {
        event.preventDefault();
        submit_post();
    });

    document.querySelector('#profilePage').addEventListener('click', () => load_Page('Profile Page'));
    
    document.querySelector('#followingPage').addEventListener('click', () => load_followingPage());

    

});

function submit_post() {

    console.log("Test");
    
    fetch('/post', {
        method: 'POST',
        body: JSON.stringify({
            post: document.querySelector('#post-body').value,

        }),


    })
}

function load_Profile(lnk) {

    let usersName = lnk.getAttribute('value');

    console.log(usersName);

    document.querySelector('#Posts-view').style.display = 'none';

    const profileView = document.querySelector('#Profile-view')

    let totalFollowers = 0;
    let totalFollowing = 0;
    let followingBool = false;
    
    fetch('followingFollowers', {
        method: 'POST',
        body: JSON.stringify({
            user: usersName
        })
    })
        .then(response => response.json())
        .then(data => {
            totalFollowers = data['totalFollowers']
            totalFollowing = data['totalFollowing']
            followingBool = data['followingBool']
            console.log(totalFollowers, totalFollowing, followingBool)

            if (followingBool != true)
            {
                document.querySelector('#Profile-view').innerHTML = `
                <h3 style="text-align:center">${usersName}</h3>
                <p style="text-align:center"><span id="followingCount"><b>Following : ${totalFollowing} </b></span id="followersCount"><span><b style="padding-left: 20px">Followers : ${totalFollowers}</b></span></p>
                <p style="text-align:center"><button id="followButton" class="btn btn-primary" onclick="follow_User('${usersName}', '${document.getElementById('profilePage').innerText}')">Follow</button></p>
                `;
            }
            else
            {
                document.querySelector('#Profile-view').innerHTML = `
                <h3 style="text-align:center">${usersName}</h3>
                <p style="text-align:center"><span id="followingCount"><b>Following : ${totalFollowing} </b></span id="followersCount"><span><b style="padding-left: 20px">Followers : ${totalFollowers}</b></span></p>
                <p style="text-align:center"><button id="followButton" class="btn btn-success")">Following</button></p>
                `;
            }

    })

    


    const view = document.querySelector('#Profile-posts')
    document.querySelector('#Profile-view').style.display = 'block';

    fetch(`/profile/${usersName}`)
    .then(response => response.json())
    .then(posts => {
      
    posts.forEach(post => {
        let div = document.createElement('div');
        
        div.innerHTML = `
        <span class="row" style="padding-left: 40px"><b>${post['id']}</b></span>
        <span class="row" style="padding-left: 40px"><a id="userLink" href="#" onclick='load_Profile(this)' value="${post['user']}">${post['user']}</a></span>
        <span class="row" style="padding-left: 40px">${post['post']}</span>
        <span class="row" style="padding-left: 40px">${post['timestamp']}</span>
        <div class="row" style="padding-left: 40px">
        <button id="likeButton-${post['id']}" class="btn btn-primary" onclick="like_Post('${post['id']}', '${post['user']}')">Likes : ${post['likes']}</button>
        <div style="padding-left:10px">
        </div>
        <div style="padding-bottom:20px"></div>
        `;
        
        view.appendChild(div);
    });

})
}

function load_Page(pageName) {
    
    //console.log(pageName);

    document.querySelector('#Profile-view').style.display = 'none';

    document.querySelector('#Posts-view').innerHTML = `<h3 style="text-align:center">${pageName}</h3>`;

    const view = document.querySelector('#Posts-view')
    document.querySelector('#Posts-view').style.display = 'block';

    fetch(`/pages/${pageName}`)
    .then(response => response.json())
    .then(posts => {
      
    posts.forEach(post => {
        let likes = post['likes'];
        let div = document.createElement('div');
        if (pageName == "All Posts")
        {
            console.log(post.user, document.getElementById('profilePage').innerText)
            if (post.user != document.getElementById('profilePage').innerText)
            {
                div.innerHTML = `
                <span class="row" style="padding-left: 40px"><b>${post['id']}</b></span>
                <span class="row" style="padding-left: 40px"><a id="userLink" href="#" onclick='load_Profile(this)' value="${post['user']}">${post['user']}</a></span>
                <span class="row" style="padding-left: 40px">${post['post']}</span>
                <span class="row" style="padding-left: 40px">${post['timestamp']}</span>
                <div class="row" style="padding-left: 40px">
                <button id="likeButton-${post['id']}" class="btn btn-primary" onclick="like_Post('${post['id']}', '${post['user']}')">Likes : ${post['likes']}</button>
                </div>
                <div style="padding-bottom:20px"></div>
                `;
            }
            else
            {
                div.innerHTML = `
                <span class="row" style="padding-left: 40px"><b>${post['id']}</b></span>
                <span class="row" style="padding-left: 40px"><a id="userLink">${post['user']}</a></span>
                <span id="postText" class="row" style="padding-left: 40px">${post['post']}</span>
                <textarea id="editTextArea" class="form-control" style="display: none"></textarea>
                <span class="row" style="padding-left: 40px">${post['timestamp']}</span>
                <span style="padding-left: 25px" id="ownPostLikes-${post['id']}">Likes : ${post['likes']}</button>
                <div class="row" style="padding-left: 40px">
                <button id="editButton-${post['id']}" class="btn btn-primary" onclick="edit_Post('${post['id']}', '${post['user']}', '${post['post']}')">Edit</button>
                <input id="submitEditButton-${post['id']}" type="submit" value="Confirm" class="btn btn-primary" onclick="update_Post('${post['id']}', '${post['user']}')" style="display: none"/>
                <div style="padding-left:10px">
                <button id="cancelEditButton-${post['id']}" class="btn btn-primary" onclick="cancel_Edit('${post['id']}')" style="display: none">Cancel</button>
                </div>
                <div style="padding-bottom:20px"></div>
                `;
            }
        }
        else if(pageName == "Profile Page")
        {
            document.querySelector('#Profile-view').style.display = 'none';
            document.querySelector('#Profile-posts').style.display = 'none';

            div.innerHTML = `
            <span class="row" style="padding-left: 40px"><b>${post['id']}</b></span>
            <span class="row" style="padding-left: 40px"><b>${post['user']}</b></span>
            <span class="row" style="padding-left: 40px">${post['post']}</span>
            <span class="row" style="padding-left: 40px">${post['timestamp']}</span>
            <div class="row" style="padding-left: 40px">
            <button id="editButton-${post['id']}" class="btn btn-primary" onclick="edit_Post('${post['id']}', '${post['user']}')">Edit</button>
            </div>
            <div style="padding-bottom:20px"></div>
            `;
        }
        else if(pageName = "Following")
        {
        
        }
        view.appendChild(div);
    });
        
    })
}

function load_followingPage()
{
    document.querySelector('#Posts-view').style.display = 'none';
    document.querySelector('#Profile-posts').style.display = 'none';
    document.querySelector('#following-Posts').style.display = 'block';

    document.querySelector('#Profile-view').innerHTML = `
                <h3 style="text-align:center">Following</h3>
                `;
    
    document.querySelector('#Profile-view').style.display = 'block';

    const view = document.querySelector('#following-Posts')
    fetch('/followingPosts')
    .then(response => response.json())
    .then(posts => {
      
    posts.forEach(post => {
        console.log(post['post'])
        let div = document.createElement('div');
        
        div.innerHTML = `
        <span class="row" style="padding-left: 40px"><b>${post['id']}</b></span>
        <span class="row" style="padding-left: 40px"><a id="userLink" href="#" onclick='load_Profile(this)' value="${post['user']}">${post['user']}</a></span>
        <span class="row" style="padding-left: 40px">${post['post']}</span>
        <span class="row" style="padding-left: 40px">${post['timestamp']}</span>
        <div class="row" style="padding-left: 40px">
        <button id="likeButton-${post['id']}" class="btn btn-primary" onclick="like_Post('${post['id']}', '${post['user']}')">Likes : ${post['likes']}</button>
        <div style="padding-left:10px">
        </div>
        <div style="padding-bottom:20px"></div>
        `;
       
        view.appendChild(div);
    });
        
    })

}

function add_post(contents)
{
    console.log(posts);
}

function like_Post(postID, UserName)
{
    
    console.log(postID, UserName);

    fetch('likeUnlikePost', {
        method: 'POST',
        body: JSON.stringify({
            id: postID,
            user: UserName
        })
    })
        .then(response => response.json())
        .then(data => {
            let liked = data['liked']
            let likes = data['likes']
            console.log(liked, likes)
            let totalLikes = document.getElementById(`likeButton-${postID}`)
            totalLikes.innerText = "Likes : " + likes
        })
    
}

function edit_Post(postID, UserName, post)
{
    document.querySelector('#postText').style.display = 'none';
    document.querySelector('#editTextArea').style.display = 'block';
    document.querySelector('#editTextArea').innerText = post;
    document.querySelector(`#editButton-${postID}`).style.display = 'none';
    document.querySelector(`#submitEditButton-${postID}`).style.display = 'block';
    document.querySelector(`#cancelEditButton-${postID}`).style.display = 'block';
}

function update_Post(postID, user)
{
    var text = document.getElementById("editTextArea");

    console.log(text.value)

    var updated_post = text.value;

    fetch('updatePost', {
        method: 'POST',
        body: JSON.stringify({
            id: postID,
            user: user,
            updated_post,
        })
    })
        .then(response => response.json())
        document.querySelector('#postText').innerText = updated_post;
        document.querySelector('#postText').style.display = 'block';
        document.querySelector('#editTextArea').style.display = 'none';
        document.querySelector('#editTextArea').innerText = null;
        document.querySelector(`#editButton-${postID}`).style.display = 'block';
        document.querySelector(`#submitEditButton-${postID}`).style.display = 'none';
        document.querySelector(`#cancelEditButton-${postID}`).style.display = 'none';
}

function follow_User(userFollowed, userFollowing)
{
    console.log(userFollowed, userFollowing)

    fetch('followUser', {
        method: 'POST',
        body: JSON.stringify({
            userToFollow:userFollowed,
            userThatsFollowing:userFollowing,
        })
    })
}

function cancel_Edit(postID)
{
    document.querySelector('#postText').style.display = 'block';
    document.querySelector('#editTextArea').style.display = 'none';
    document.querySelector('#editTextArea').innerText = null;
    document.querySelector(`#editButton-${postID}`).style.display = 'block';
    document.querySelector(`#submitEditButton-${postID}`).style.display = 'none';
    document.querySelector(`#cancelEditButton-${postID}`).style.display = 'none';
}

