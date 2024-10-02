from rest_framework import serializers
from . import models

class CustomUserSerializer(serializers.ModelSerializer):
    """serialises a user profile object"""
    
    class Meta:
        model = models.CustomUser
        fields = ('id','created', 'email', 'name', 'profile_picture_path', 'password')
        extra_kwargs = {
			'password': {
				'write_only': True,
				'style': {'input_type': 'password'}
			}
		}
        
    def create(self, validated_data):
        """Create and return a new user
		"""
        user = models.CustomUser.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user
    
    def update(self, instance, validated_data):
        """handle updating user account
        """
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
            instance.save()
        
        return super().update(instance, validated_data)
