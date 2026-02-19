from django.db import models

class Customer(models.Model):
    id = models.CharField(max_length=20, primary_key=True) # Using CharField to match frontend "CUST-001" format initially, or we can auto-generate
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('banned', 'Banned')
    ])
    verified = models.BooleanField(default=False)
    loyalty_tier = models.CharField(max_length=20, default='Bronze')
    avatar = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.CharField(max_length=20, primary_key=True) # PRD-001
    sku = models.CharField(max_length=50, unique=True, blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    supplier = models.CharField(max_length=100, blank=True)
    
    current_stock = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=0)
    max_stock = models.IntegerField(default=100)
    
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, default='in-stock') # in-stock, low-stock, out-of-stock
    location = models.CharField(max_length=100, blank=True)
    last_restocked = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    rating = models.IntegerField(default=5)
    reviews = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Order(models.Model):
    id = models.CharField(max_length=20, primary_key=True) # ORD-2024-001
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending') # pending, processing, shipped, delivered, cancelled
    
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=20) # paid, pending, refunded
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_address = models.TextField()
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    estimated_delivery = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in {self.order.id}"
