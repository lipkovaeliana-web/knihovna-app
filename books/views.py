from rest_framework import viewsets, filters
from .models import Book, Author
from .serializers import BookSerializer, AuthorSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']

    def get_queryset(self):
        queryset = Book.objects.all()

        genre = self.request.query_params.get('genre')
        is_read = self.request.query_params.get('is_read')
        author = self.request.query_params.get('author')

        if genre:
            queryset = queryset.filter(genre__id=genre)

        if is_read is not None:
            if is_read.lower() == 'true':
                queryset = queryset.filter(is_read=True)
            elif is_read.lower() == 'false':
                queryset = queryset.filter(is_read=False)
        if author:
            queryset = queryset.filter(author__id=author)

        return queryset.distinct()


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer