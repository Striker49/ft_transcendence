from rest_framework import serializers
from .models import CustomUser
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from profiles.serializers import UserProfileSerializer
from profiles.models import UserProfile

class CustomUserSerializer(serializers.ModelSerializer):
    """serialises a user profile object"""
    
    class Meta:
        model = CustomUser
        fields = ('id', 'created','email', 'username', 'password', 'last_login')
        extra_kwargs = {
			'password': {
				'write_only': True,
				'style': {'input_type': 'password'}
			}
		}
        
    def create(self, validated_data):
        """Create and return a new user
		"""
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user
    
    def update(self, instance, validated_data):
        """handle updating user account
        """
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)


        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
 
class AuthCustomTokenSerializer(serializers.Serializer):
	email_or_username = serializers.CharField()
	password = serializers.CharField(label=_("Password"), style={'input_type': 'password'}, trim_whitespace=False)

	def validate(self, attrs):
		email_or_username = attrs.get('email_or_username')
		password = attrs.get('password')
		
		if email_or_username and password:
			try:
				validate_email(email_or_username)
				user_request = get_object_or_404(
					CustomUser,
					email=email_or_username
				)
				email_or_username = user_request.username
			except ValidationError:
				pass

			user = authenticate(username=email_or_username, password=password)
			if user:
				if not user.is_active:
					raise serializers.ValidationError(_('User account is disabled.'), code='authorization')
			else:
				raise serializers.ValidationError(_('Unable to log in with provided credentials.'), code='authorization')

		else:
			raise serializers.ValidationError(_('Must include "email or username" and "password"'), code='authorization')
		
		attrs['user'] = user
		return super().validate(attrs)

class RegistrationSerializer(serializers.ModelSerializer):

    profile=UserProfileSerializer(required=False)
    
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'profile')
        extra_kwargs = {
			'password': {
				'write_only': True,
				'style': {'input_type': 'password'}
			}
		}
        
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        user = CustomUser.objects.create_user(**validated_data)
        if profile_data:
            UserProfile.objects.create(UID=user, **profile_data)
        
        return user
