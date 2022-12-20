
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.newpost, name="post"),
    path("index", views.page),
    path("pages/<str:pageName>", views.page, name="pageName"),
    path("profile/<str:usersName>", views.followingPage, name="usersName"),
    path("likeUnlikePost", views.likePost, name="likeUnlikePost"),
    path("updatePost", views.updatePost, name="updatePost"),
    path("followingFollowers", views.followingFollowers, name="followingFollowers"),
    path("followUser", views.followUser, name="followUser"),
    path("followingPosts", views.followingPosts, name="followingPosts"),
]
