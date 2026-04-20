from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, AuthorViewSet


# Create API router for automatic URL generation
router = DefaultRouter()

# Register book endpoints
router.register(r'books', BookViewSet)

# Register author endpoints
router.register(r'authors', AuthorViewSet)


urlpatterns = [
    # Include all generated API routes
    path('', include(router.urls)),
]