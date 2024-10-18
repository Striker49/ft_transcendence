from rest_framework import serializers
from profiles import models

class UserProfileSerializer(serializers.ModelSerializer):
    """serialises a user profile object"""
    username = serializers.ReadOnlyField(source='UID.username')
    email = serializers.ReadOnlyField(source='UID.email')
    UID = serializers.ReadOnlyField(source='UID.id')
    
    class Meta:
        model = models.UserProfile
        fields = (
            'UID',
            'id',
            'first_name', 
            'last_name', 
            'avatar_path',
            'bio',
            'lang',
            'username',
            'email',
            )
