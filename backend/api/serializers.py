from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id', 
            'email', 
            'first_name', 
            'last_name', 
            'dob', 
            'id_number', 
            'account_number', 
            'account_balance',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['account_number', 'created_at', 'updated_at']

    def validate_email(self, value):
        if Customer.objects.filter(email=value).exists():
            raise serializers.ValidationError("A customer with this email already exists.")
        return value

    def validate_id_number(self, value):
        if Customer.objects.filter(id_number=value).exists():
            raise serializers.ValidationError("A customer with this ID number already exists.")
        return value


class CustomerBalanceSerializer(serializers.ModelSerializer):
    """Serializer specifically for updating only the balance"""
    class Meta:
        model = Customer
        fields = ['account_balance']
        
    def validate_account_balance(self, value):
        if value < 0:
            raise serializers.ValidationError("Account balance cannot be negative.")
        return value