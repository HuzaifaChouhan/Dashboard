from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Sum, Count, F
from django.utils import timezone
from datetime import timedelta
from .models import Product, Order, Customer, OrderItem
from .serializers import ProductSerializer, OrderSerializer, CustomerSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['category', 'status', 'supplier']
    search_fields = ['name', 'description', 'sku']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'payment_status', 'payment_method']
    search_fields = ['id', 'customer__name', 'customer__email']

    def get_queryset(self):
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer__id=customer_id)
        return queryset

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['name', 'email', 'phone']

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # KPI Data
        total_revenue = Order.objects.filter(payment_status='paid').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.count()
        products_sold = OrderItem.objects.aggregate(Sum('quantity'))['quantity__sum'] or 0
        active_users = Customer.objects.filter(status='active').count()

        # Recent Orders
        recent_orders = Order.objects.order_by('-order_date')[:5]
        recent_orders_data = OrderSerializer(recent_orders, many=True).data

        # Top Products
        # Simplified: just recent products for now as "Top Products" logic requires more aggregation
        recent_products = Product.objects.order_by('-last_restocked')[:5]
        recent_products_data = ProductSerializer(recent_products, many=True).data

        # Sales Chart Data (Last 6 months simplified)
        sales_data = [
            {'name': 'Jan', 'sales': 4000, 'orders': 240},
            {'name': 'Feb', 'sales': 3000, 'orders': 198},
            {'name': 'Mar', 'sales': 5000, 'orders': 300},
            {'name': 'Apr', 'sales': 4500, 'orders': 278},
            {'name': 'May', 'sales': 6000, 'orders': 389},
            {'name': 'Jun', 'sales': 5500, 'orders': 349},
        ]

        # Inventory Data (stock by category)
        inventory_by_category = Product.objects.values('category').annotate(
            stock=Sum('current_stock')
        ).order_by('-stock')

        inventory_data = [
            {'name': item['category'] or 'Uncategorized', 'stock': item['stock'] or 0}
            for item in inventory_by_category
        ]

        return Response({
            'kpi': {
                'total_revenue': total_revenue,
                'total_orders': total_orders,
                'products_sold': products_sold,
                'active_users': active_users
            },
            'recent_orders': recent_orders_data,
            'recent_products': recent_products_data,
            'sales_data': sales_data,
            'inventory_data': inventory_data
        })
