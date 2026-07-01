from django.urls import path 
from .views import CustomerListCreateView , CustomerDetailView , CustomerBalanceUpdateView

urlpatterns = [
    path("v1/customers/", CustomerListCreateView.as_view(), name="customer-list-create"),
    path("v1/customers/<int:id>/", CustomerDetailView.as_view() , name='customer-detail'),
    path("v1/customers/<int:id>/balance", CustomerBalanceUpdateView.as_view(), name="customer-balance-update"),
]
