from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display= ['account_number','first_name', 'last_name','email', 'account_balance']
    search_fields = ['account_number', 'email', 'id_number']
    readonly_fields=['account_number', 'created_at', 'updated_at']
