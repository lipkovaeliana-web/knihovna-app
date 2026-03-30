from django.db import models


class Author(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Series(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Book(models.Model):
    LANGUAGE_CHOICES = [
        ('cs', 'Čeština'),
        ('en', 'Angličtina'),
    ]
    language = models.CharField(
        choices=LANGUAGE_CHOICES,
        max_length=2,
        default='cs',
    )
    is_read = models.BooleanField(default=False)

    name = models.CharField(max_length=500)
    serie = models.ForeignKey(Series, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.IntegerField(null=True, blank=True)
    author = models.ManyToManyField(Author)
    genre = models.ManyToManyField(Genre, blank=True)


for book in Book.objects.all():
    if book.language == 'CZ':
        book.language = 'cs'
    elif book.language == 'AJ':
        book.language = 'en'
    book.save()

    def __str__(self):
        return self.name

