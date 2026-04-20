import os
import sys
from pathlib import Path
import csv

# Get project base directory
BASE_DIR = Path(__file__).resolve().parent

# Add Django project path to system path
sys.path.insert(0, str(BASE_DIR / "knihovna"))

# Set Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "knihovna.settings")

import django
django.setup()

from books.models import Book, Author


# Open CSV file with book data
with open("knihy.csv", newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        # Create a new book from CSV title
        book = Book.objects.create(
            name=row["title"]
        )

        author_name = row["author"]

        # Skip unknown authors marked with "?"
        if author_name != "?":
            # Create author if it does not exist
            author, created = Author.objects.get_or_create(name=author_name)

            # Connect author to the book
            book.author.add(author)

print("Import completed! 🎉")