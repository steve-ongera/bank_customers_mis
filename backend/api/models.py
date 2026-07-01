from django.db import models
import random 
import string 

def generate_account_number():
    return ''.join(random.choices(string.ascii_uppercase+string.digits, k=6))

class Customer(models.Model):
    email= models.EmailField(unique=True)
    first_name=models.CharField(max_length=100)
    last_name=models.CharField(max_length=100)
    dob=models.DateField()
    id_number=models.CharField(max_length=50 , unique=True)
    account_number =models.CharField(
        max_length=6,
        unique=True,
        default=generate_account_number,
        editable=False
    )
    account_balance=models.DecimalField(max_digits=15,decimal_places=2, default=0.00)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class meta:
        ordering=['-created_at']
    
    def __str__(self):
        return f"{self.first_name}{self.last_name} - {self.account_number}"
        
