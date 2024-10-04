from rest_framework import serializers
from profiles import models

class UserProfileSerializer(serializers.ModelSerializer):
    """serialises a user profile object"""
    
    class Meta:
        model = models.UserProfile
        fields = (
            'id', 
            'first_name', 
            'last_name', 
            'avatar_path',
            'bio',
            'lang',
            )
