import csv
import os
import django

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',"knihovna.settings")
django.setup()

from books.models import Book, Author

with open("knihy.csv", newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        book = Book.objects.create(
            name=row["title"]
        )
        author_name = row["author"]

        if author_name != "?":
            author, created = Author.objects.get_or_create(name=author_name)
            book.author.add(author)
print("Hotovo!🎉")