import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.http import JsonResponse
from . import forms
from .models import User, Post, postLikes, usersFolowing
import time
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import User, Post


def index(request):
    # Authenticated users view their main page
    if request.user.is_authenticated:
        return render(request, "network/index.html")

    # Else promt user to sign in to profile
    else:
        return HttpResponseRedirect(reverse("login"))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
def newpost(request):
    if request.method != "POST":
            return JsonResponse({"error": "POST request is required."}, status=400)
    data = json.loads(request.body)
    Post(user = request.user,
    post = data.get("post", ""),
    timestamp = ("timestamp", ""),
    likes = 0).save()
    return JsonResponse({"success": "message posted successfully!"})

@login_required
@csrf_exempt
def likePost(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post_id = data.get('id')
        post = Post.objects.get(id=post_id)
        userName = User.objects.get(username=request.user)        
        liked = True
        isLikedBy = postLikes.objects.filter(postID=post_id, likedBy=userName)
        if isLikedBy.count() == 0:
            postLikes(postID = post_id,
            likedBy = userName).save()
        totalLiked = postLikes.objects.filter(postID=post_id)    
        likes = totalLiked.count()
        post.likes = likes
        post.save()
        return JsonResponse({'status': 201, 'liked': liked, 'likes': likes})
        

def page(request, pageName):

    if pageName == "All Posts":
        posts = Post.objects.all()
    elif pageName == "Profile Page":
        posts = Post.objects.filter(user=request.user)
    else:
        return JsonResponse({"error": "Invalid Page."}, status=400)

    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

def followingPage(request, usersName):
    posts = Post.objects.filter(user=usersName)
    return JsonResponse([post.serialize() for post in posts], safe=False)

@login_required
@csrf_exempt
def updatePost(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post_id = data.get('id')
        updatedPost = data.get('updated_post')
        postToUpdate = Post.objects.get(id=post_id)
        postToUpdate.post = updatedPost
        postToUpdate.save()
        return JsonResponse({"success": "Post updated successfully!"})

@login_required
@csrf_exempt
def followingFollowers(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = data.get('user')
        followers = usersFolowing.objects.filter(usersFollowed=user)
        following = usersFolowing.objects.filter(usersFollowing=user)
        isFollowing = usersFolowing.objects.filter(usersFollowed=user, usersFollowing=request.user)
        followingBool = False
        if (isFollowing.count() > 0):
            followingBool = True
        totalFollowers = followers.count()
        totalFollowing = following.count()
        return JsonResponse({'totalFollowers': totalFollowers, 'totalFollowing': totalFollowing, 'followingBool': followingBool})
            
@login_required
@csrf_exempt
def followUser(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        usersFolowing(usersFollowed = data.get("userToFollow", ""),
        usersFollowing = data.get("userThatsFollowing", "")).save()
        return JsonResponse({"success": "user successfully followed!"})

@login_required
@csrf_exempt
def followingPosts(request):
   posts = Post.objects.all()
   following = usersFolowing.objects.filter(usersFollowing = request.user)
   
   for user in following:
        for post in posts:
            if post.user == user.usersFollowed:
                followingP = Post.objects.filter(user=post.user)
                return JsonResponse([post.serialize() for post in followingP], safe=False)
   
