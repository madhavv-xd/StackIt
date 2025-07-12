from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserSerializer

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    full_name = request.data.get('full_name')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    
    # Manually create associated UserProfile
    UserProfile.objects.create(
        user=user,
        full_name=full_name,
        email=email
    )

    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)