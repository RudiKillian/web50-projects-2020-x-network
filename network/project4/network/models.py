from unittest.util import _MAX_LENGTH
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):

    user = models.CharField(max_length=84)
    post = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField() 
    

    def serialize(self):
        return {
            "id":self.id,
            "user":self.user,
            "post":self.post,
            "timestamp":self.timestamp,
            "likes":self.likes,
        }

class postLikes(models.Model):

    postID = models.TextField()
    likedBy = models.CharField(max_length=84)

class usersFolowing(models.Model):

    
    usersFollowed = models.CharField(max_length=84)
    usersFollowing = models.CharField(max_length=84)

