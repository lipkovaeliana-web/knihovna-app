from rest_framework.test import APITestCase
from rest_framework import status
from books.models import Book, Author


class BookAPITestCase(APITestCase):
    def test_create_book_success(self):
        author = Author.objects.create(name="Test Author")

        data = {
            "name": "Test Book",
            "language": "cs",
            "author_ids": [author.id],
            "is_read": False,
        }

        response = self.client.post("/api/books/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 1)

        book = Book.objects.first()
        self.assertEqual(book.name, "Test Book")

    def test_filter_books_by_is_read(self):
        author = Author.objects.create(name="Test Author")

        Book.objects.create(name="Read Book", language="cs", is_read=True)
        unread_book = Book.objects.create(name="Unread Book", language="cs", is_read=False)

        # author je ManyToMany, přidávám autora zvlášť
        read_book = Book.objects.get(name="Read Book")
        read_book.author.add(author)

        unread_book.author.add(author)

        response = self.client.get("/api/books/?is_read=true")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Read Book")

    def test_update_book_is_read(self):
        author = Author.objects.create(name="Test Author")

        book = Book.objects.create(
            name="Test Book",
            language="cs",
            is_read=False,
        )
        book.author.add(author)

        response = self.client.patch(
            f"/api/books/{book.id}/",
            {"is_read": True},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        book.refresh_from_db()
        self.assertTrue(book.is_read)