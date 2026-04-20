from django.db import models


class Author(models.Model):
    # Author name
    name = models.CharField(max_length=200)

    # Display author name in admin and shell
    def __str__(self):
        return self.name


class Series(models.Model):
    # Book series name
    name = models.CharField(max_length=200)

    # Display series name in admin and shell
    def __str__(self):
        return self.name


class Genre(models.Model):
    # Genre name
    name = models.CharField(max_length=100)

    # Display genre name in admin and shell
    def __str__(self):
        return self.name


class Book(models.Model):
    # Available language options
    LANGUAGE_CHOICES = [
        ('cs', 'Čeština'),
        ('en', 'Angličtina'),
    ]

    # Book language (default is Czech)
    language = models.CharField(
        choices=LANGUAGE_CHOICES,
        max_length=2,
        default='cs',
    )

    # Read / unread status
    is_read = models.BooleanField(default=False)

    # Book title
    name = models.CharField(max_length=500)

    # Optional book series
    serie = models.ForeignKey(
        Series,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Book order inside the series
    order = models.IntegerField(null=True, blank=True)

    # Book can have multiple authors
    author = models.ManyToManyField(Author)

    # Book can have multiple genres
    genre = models.ManyToManyField(Genre, blank=True)

    # Display book name in admin and shell
    def __str__(self):
        return self.name