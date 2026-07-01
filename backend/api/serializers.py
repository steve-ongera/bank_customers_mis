from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model= Customer
        fields=[
            'id',
            'email',
            'first_name',
            'last_name',
            'dob',
            'id_number',
            'account_number'
            'account_balance',
            'created_at',
            'updated_at',
        ]
        read_only_fields=['account_number', 'created_at', 'updated_at']
        
    def validate_email(self, value):
        if Customer.objects.filter(email=value).exists:
            raise serializers.ValidationError(" A customer with this email exists.")
        return value
    
    def validate_account_number(self , value):
        if Customer.objects.filter(account_number=value).exists:
            raise serializers.ValidationError("A customer wit this account number exists.")
        return value