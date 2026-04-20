from .models import Book


def fix_languages():
    # Map old language abbreviations to new standardized values
    language_map = {
        'CZ': 'cs',
        'AJ': 'en',
    }

    for book in Book.objects.all():
        # Update only books with old language values
        if book.language in language_map:
            book.language = language_map[book.language]
            book.save()