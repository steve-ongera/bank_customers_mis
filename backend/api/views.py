from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Customer
from .serializers import CustomerSerializer, CustomerBalanceSerializer

class CustomerListCreateView(generics.ListCreateAPIView):
    """
    GET: List all customers
    POST: Create a new customer
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific customer
    PUT/PATCH: Update a specific customer
    DELETE: Delete a specific customer
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    lookup_field = 'id'

class CustomerBalanceUpdateView(APIView):
    """
    PATCH: Update only the account balance of a customer
    """
    def patch(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Customer not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Use the balance-specific serializer
        serializer = CustomerBalanceSerializer(
            customer, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            # Return full customer data with updated balance
            full_serializer = CustomerSerializer(customer)
            return Response(full_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)