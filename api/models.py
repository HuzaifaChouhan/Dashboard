from django.db import models
from django.contrib.auth.models import User

# ===================== USER PROFILE =====================
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('manager', 'Manager'),
        ('viewer', 'Viewer'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')

    def __str__(self):
        return f"{self.user.username} ({self.role})"


# ===================== E-COMMERCE =====================
class Customer(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('inactive', 'Inactive'), ('banned', 'Banned')
    ])
    verified = models.BooleanField(default=False)
    loyalty_tier = models.CharField(max_length=20, default='Bronze')
    avatar = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
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
    status = models.CharField(max_length=20, default='in-stock')
    location = models.CharField(max_length=100, blank=True)
    last_restocked = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    rating = models.IntegerField(default=5)
    reviews = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Order(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=20)
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


# ===================== EDUCATION =====================
class Course(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    instructor = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    duration_hours = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('draft', 'Draft'), ('archived', 'Archived')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Student(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('inactive', 'Inactive'), ('graduated', 'Graduated')
    ])

    def __str__(self):
        return self.name

class Enrollment(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_date = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)  # 0-100 percentage
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('completed', 'Completed'), ('dropped', 'Dropped')
    ])
    grade = models.CharField(max_length=5, blank=True)

    def __str__(self):
        return f"{self.student.name} → {self.course.name}"


# ===================== HEALTHCARE =====================
class Department(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    head_doctor = models.CharField(max_length=100)
    beds_total = models.IntegerField(default=0)
    beds_occupied = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Patient(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'), ('female', 'Female'), ('other', 'Other')
    ])
    blood_group = models.CharField(max_length=5, blank=True)
    condition = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('discharged', 'Discharged'), ('critical', 'Critical')
    ])
    admission_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Appointment(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, default='scheduled', choices=[
        ('scheduled', 'Scheduled'), ('completed', 'Completed'),
        ('cancelled', 'Cancelled'), ('no-show', 'No Show')
    ])
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.patient.name} - Dr. {self.doctor}"
