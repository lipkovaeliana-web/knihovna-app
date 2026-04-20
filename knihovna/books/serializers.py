from rest_framework import serializers
from .models import Book, Author


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        # Serializer for Author model
        model = Author
        fields = ['id', 'name']


class BookSerializer(serializers.ModelSerializer):
    # Display full author data when reading books
    author = AuthorSerializer(many=True, read_only=True)

    # Use author IDs when creating or updating books
    author_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Author.objects.all(),
        write_only=True,
        source='author'
    )

    class Meta:
        # Serializer for Book model
        model = Book

        # Include all model fields
        fields = '__all__'