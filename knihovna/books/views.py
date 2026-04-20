from rest_framework import viewsets, filters
from .models import Book, Author
from . import serializers


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = serializers.BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']

    def get_queryset(self):
        # Start with all books
        queryset = Book.objects.all()

        # Get filter values from query parameters
        genre = self.request.query_params.get('genre')
        is_read = self.request.query_params.get('is_read')
        author = self.request.query_params.get('author')

        # Filter books by genre
        if genre:
            queryset = queryset.filter(genre__id=genre)

        # Filter books by read status
        if is_read is not None:
            if is_read.lower() == 'true':
                queryset = queryset.filter(is_read=True)
            elif is_read.lower() == 'false':
                queryset = queryset.filter(is_read=False)

        # Filter books by author
        if author:
            queryset = queryset.filter(author__id=author)

        # Remove duplicate books from the queryset
        return queryset.distinct()


class AuthorViewSet(viewsets.ModelViewSet):
    # Return all authors ordered by name
    queryset = Author.objects.all().order_by("name")
    serializer_class = serializers.AuthorSerializer

    # Disable pagination for authors
    pagination_class = None