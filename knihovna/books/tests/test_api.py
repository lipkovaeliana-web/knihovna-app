from rest_framework.test import APITestCase
from rest_framework import status
from books.models import Book, Author


class BookAPITestCase(APITestCase):
    def test_create_book_success(self):
        # Create test author
        author = Author.objects.create(name="Test Author")

        # Prepare valid book data
        data = {
            "name": "Test Book",
            "language": "cs",
            "author_ids": [author.id],
            "is_read": False,
        }

        # Send POST request to create a new book
        response = self.client.post("/api/books/", data, format="json")

        # Check response status and number of books in database
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 1)

        # Check created book data
        book = Book.objects.first()
        self.assertEqual(book.name, "Test Book")

    def test_filter_books_by_is_read(self):
        # Create test author
        author = Author.objects.create(name="Test Author")

        # Create test books
        read_book = Book.objects.create(
            name="Read Book",
            language="cs",
            is_read=True
        )
        unread_book = Book.objects.create(
            name="Unread Book",
            language="cs",
            is_read=False
        )

        # Add author to books separately because author is ManyToManyField
        read_book.author.add(author)
        unread_book.author.add(author)

        # Send GET request with read status filter
        response = self.client.get("/api/books/?is_read=true")

        # Check filtered response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Read Book")

    def test_update_book_is_read(self):
        # Create test author
        author = Author.objects.create(name="Test Author")

        # Create unread test book
        book = Book.objects.create(
            name="Test Book",
            language="cs",
            is_read=False,
        )
        book.author.add(author)

        # Send PATCH request to update read status
        response = self.client.patch(
            f"/api/books/{book.id}/",
            {"is_read": True},
            format="json"
        )

        # Check response status
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Reload book from database and verify change
        book.refresh_from_db()
        self.assertTrue(book.is_read)