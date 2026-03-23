from django.db import models


class Author(models.Model):
    author_name = models.CharField(max_length=200)

    def __str__(self):
        return self.author_name


class Series(models.Model):
    serie_name = models.CharField(max_length=200)

    def __str__(self):
        return self.serie_name


class Book(models.Model):
    name = models.CharField(max_length=500)
    serie = models.ForeignKey(Series, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.IntegerField(null=True, blank=True)
    author = models.ManyToManyField(Author)

    def __str__(self):
        return self.name
