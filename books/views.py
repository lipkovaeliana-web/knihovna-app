from rest_framework import viewsets, filters
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']

    def get_queryset(self):
        queryset = Book.objects.all()
        genre = self.request.query_params.get('genre')

        if genre:
            queryset = queryset.filter(genre=genre)

        return queryset