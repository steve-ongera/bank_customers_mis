from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Customer
from .serializers import CustomerSerializer


class CustomerListCreateView(generics.ListCreateAPIView):
    """"
    GET: List all customers
    POST: Create a new customer
    """
    queryset= Customer.objects.all()
    serializer_class = CustomerSerializer