import os
import sys
from pathlib import Path
import csv

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / "knihovna"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "knihovna.settings")

import django
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