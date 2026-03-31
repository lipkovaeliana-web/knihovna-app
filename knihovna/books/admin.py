from django.contrib import admin
from .models import Book, Author,Series, Genre


class BookAdmin(admin.ModelAdmin):
    list_display = ('name','language', 'is_read', 'serie', 'order')
    list_filter = ('language', 'is_read', 'genre', 'serie')
    search_fields = ('name',)
    filter_horizontal = ('author', 'genre')

class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)

class SeriesAdmin(admin.ModelAdmin):
    list_display = ('name',)

class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Book, BookAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Series, SeriesAdmin)
admin.site.register(Genre, GenreAdmin)