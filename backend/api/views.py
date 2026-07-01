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
    
    
class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrive specific customer
    PUT/PATCH: Update a specific customer
    DELETE: Delete a specific customer
    """
    queryset= Customer.objects.all()
    serializer_class = CustomerSerializer
    lookup_field ='id'
    
    
class CustomerBalanceUpdateView(APIView):
    """
    PATCH: Update only the account balance of specific customer

    """
    def patch(seld , request , id ):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Customer Does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CustomerSerializer(
            customer,
            data=request.data,
            partial=True,
            fields=['account_balance']
        )
        
        if serializer.is_valid():
            serializer.save
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    