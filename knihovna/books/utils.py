from .models import Book

def fix_languages():
    for book in Book.objects.all():
        if book.language == 'CZ':
            book.language = 'cs'
        elif book.language == 'AJ':
            book.language = 'en'
        book.save()