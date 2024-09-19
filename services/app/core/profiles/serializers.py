from rest_framework import serializers
from profiles import models

class HelloSerializers(serializers.Serializer):
	"""Serializers a name field for testing our API view

	Args:
		serializers (_type_): _description_
	"""

	name = serializers.CharField(max_length=10)

class UserProfileSerializer(serializers.ModelSerializer):
    """serialises a user profile object"""
    
    class Meta:
        model = models.UserProfile
        fields = ('id', 'email', 'name', 'password')
        extra_kwargs = {
			'password': {
				'write_only': True,
				'style': {'input_type': 'password'}
			}
		}
        
    def create(self, validated_data):
        """Create and return a new user

		Args:
			validated_data (_type_): _description_
		"""
        user = models.UserProfile.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user
    
    def update(self, instance, validated_data):
        """handle updating user account

        Args:
            instance (_type_): _description_
            validated_data (_type_): _description_

        Returns:
            _type_: _description_
        """
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        return super().update(instance, validated_data)
