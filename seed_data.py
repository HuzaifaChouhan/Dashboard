import os
import django
from datetime import datetime, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Product, Customer, Order, OrderItem
from django.contrib.auth.models import User

def run_seed():
    print('Seeding data...')

    # Create Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin')
        print('Superuser created: admin/admin')

    # Clear existing data
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    Product.objects.all().delete()
    Customer.objects.all().delete()

    # Products
    products_data = [
        {
            "id": "PRD-001",
            "name": "Wireless Headphones Pro",
            "description": "Premium noise cancellation with 30-hour battery life",
            "price": 199.99,
            "category": "Electronics",
            "stock": 150,
            "sku": "WHP-001",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            "status": "in-stock"
        },
        {
            "id": "PRD-002",
            "name": "Smart Watch Series 5",
            "description": "Fitness tracking & notifications",
            "price": 249.99,
            "category": "Electronics",
            "stock": 75,
            "sku": "SWS-005",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
            "status": "in-stock"
        },
        {
            "id": "PRD-003",
            "name": "360° Bluetooth Speaker",
            "description": "Portable with 20h battery life",
            "price": 89.99,
            "category": "Electronics",
            "stock": 5,
            "sku": "BTS-360",
            "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
            "status": "low-stock"
        },
        {
            "id": "PRD-004",
            "name": "Organic Green Tea",
            "description": "Premium grade organic tea leaves",
            "price": 24.99,
            "category": "Food & Beverage",
            "stock": 200,
            "sku": "OGT-100",
            "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop",
            "status": "in-stock"
        },
        {
            "id": "PRD-005",
            "name": "Yoga Mat Premium",
            "description": "Non-slip eco-friendly material",
            "price": 45.99,
            "category": "Sports",
            "stock": 0,
            "sku": "YMP-001",
            "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
            "status": "out-of-stock"
        }
    ]

    created_products = []
    for p_data in products_data:
        product = Product.objects.create(
            id=p_data['id'],
            name=p_data['name'],
            description=p_data['description'],
            unit_price=p_data['price'],
            category=p_data['category'],
            current_stock=p_data['stock'],
            sku=p_data['sku'],
            image=p_data['image'],
            status=p_data['status']
        )
        created_products.append(product)
    print(f'Created {len(created_products)} products.')

    # Customers
    customers_data = [
        {
            "id": "CUST-001",
            "name": "John Doe",
            "email": "john.doe@email.com",
            "phone": "+1 (555) 123-4567",
            "address": "123 Main St, New York, NY 10001",
            "loyalty_tier": "Gold",
            "avatar": "https://picsum.photos/seed/john/40/40.jpg"
        },
        {
            "id": "CUST-002",
            "name": "Jane Smith",
            "email": "jane.smith@email.com",
            "phone": "+1 (555) 234-5678",
            "address": "456 Oak Ave, Los Angeles, CA 90001",
            "loyalty_tier": "Silver",
            "avatar": "https://picsum.photos/seed/jane/40/40.jpg"
        },
        {
            "id": "CUST-003",
            "name": "Robert Johnson",
            "email": "robert.j@email.com",
            "phone": "+1 (555) 345-6789",
            "address": "789 Pine Rd, Chicago, IL 60601",
            "loyalty_tier": "Bronze",
            "avatar": "https://picsum.photos/seed/robert/40/40.jpg"
        }
    ]

    created_customers = []
    for c_data in customers_data:
        customer = Customer.objects.create(
            id=c_data['id'],
            name=c_data['name'],
            email=c_data['email'],
            phone=c_data['phone'],
            address=c_data['address'],
            loyalty_tier=c_data['loyalty_tier'],
            avatar=c_data['avatar']
        )
        created_customers.append(customer)
    print(f'Created {len(created_customers)} customers.')

    # Orders
    orders_data = [
        {
            "id": "ORD-2024-001",
            "customer_id": "CUST-001",
            "status": "delivered",
            "payment_method": "Credit Card",
            "payment_status": "paid",
            "total_amount": 259.98,
            "items": [("PRD-001", 1), ("PRD-004", 2)]
        },
        {
            "id": "ORD-2024-002",
            "customer_id": "CUST-002",
            "status": "shipped",
            "payment_method": "PayPal",
            "payment_status": "paid",
            "total_amount": 189.99,
            "items": [("PRD-002", 1)]
        },
        {
            "id": "ORD-2024-003",
            "customer_id": "CUST-003",
            "status": "processing",
            "payment_method": "Debit Card",
            "payment_status": "paid",
            "total_amount": 425.50,
            "items": [("PRD-003", 2), ("PRD-001", 1)]
        }
    ]

    for o_data in orders_data:
        customer = Customer.objects.get(id=o_data['customer_id'])
        order = Order.objects.create(
            id=o_data['id'],
            customer=customer,
            status=o_data['status'],
            payment_method=o_data['payment_method'],
            payment_status=o_data['payment_status'],
            total_amount=o_data['total_amount'],
            shipping_address=customer.address
        )
        
        for prod_id, qty in o_data['items']:
            product = Product.objects.get(id=prod_id)
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                price_at_purchase=product.unit_price
            )
    print(f'Created {len(orders_data)} orders.')

if __name__ == '__main__':
    run_seed()
