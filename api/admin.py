from django.contrib import admin
from .models import Product, Order, OrderItem, Customer

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'unit_price', 'current_stock', 'category', 'status')
    search_fields = ('name', 'sku', 'category')
    list_filter = ('category', 'status')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'status', 'total_amount', 'payment_status', 'order_date')
    list_filter = ('status', 'payment_status')
    inlines = [OrderItemInline]

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'loyalty_tier', 'status')
    search_fields = ('name', 'email')
    list_filter = ('loyalty_tier', 'status')

admin.site.register(OrderItem)
