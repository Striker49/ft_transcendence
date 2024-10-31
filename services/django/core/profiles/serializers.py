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

class UserFriendshipSerializer(serializers.ModelSerializer):
	"""serialises a UserFriendship object"""

	friendship_id = serializers.ReadOnlyField(source='id')
	user1_username = serializers.ReadOnlyField(source='user1_ID.username')
	user2_username = serializers.ReadOnlyField(source='user2_ID.username')

	class Meta:
		model = models.UserFriendship
		fields = (
			'friendship_id',
			'user1_ID',
			'user1_username',
			'user2_ID',
			'user2_username',
			'type',
		)
  
class UserCustomAvatarSerializer(serializers.ModelSerializer):
	"""serialises a UserFriendship object"""

	image_url = serializers.ImageField(required=False)
	UID = serializers.ReadOnlyField(source='UID.id')

	class Meta:
		model = models.UserCustomAvatar
		fields = (
			'UID',
			'image_url',
		)