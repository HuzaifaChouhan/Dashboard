# models.py — Defines all database tables for 3 categories + user roles

from django.db import models
from django.contrib.auth.models import User


# ============================================================
# USER PROFILE — Extends Django's User model with a role field
# Roles: super_admin (full access), manager (edit), viewer (read-only)
# ============================================================
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


# ============================================================
# E-COMMERCE MODELS — Products, Customers, Orders
# ============================================================

class Customer(models.Model):
    """Stores customer information for the e-commerce category."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. CUST-001
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
    loyalty_tier = models.CharField(max_length=20, default='Bronze')  # Bronze/Silver/Gold
    avatar = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Stores product/inventory data for the e-commerce category."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. PRD-001
    sku = models.CharField(max_length=50, unique=True, blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)       # Electronics, Food, etc.
    supplier = models.CharField(max_length=100, blank=True)
    current_stock = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=0)         # Alert threshold
    max_stock = models.IntegerField(default=100)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, default='in-stock')  # in-stock / low-stock / out-of-stock
    location = models.CharField(max_length=100, blank=True)
    last_restocked = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    rating = models.IntegerField(default=5)
    reviews = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Order(models.Model):
    """Stores order data — each order belongs to a customer."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. ORD-2024-001
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')  # pending/processing/shipped/delivered/cancelled
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=20)    # paid/pending/refunded
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_address = models.TextField()
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    estimated_delivery = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer.name}"


class OrderItem(models.Model):
    """Individual items within an order (many-to-many between Order and Product)."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in {self.order.id}"


# ============================================================
# EDUCATION MODELS — Courses, Students, Enrollments
# ============================================================

class Course(models.Model):
    """Stores course info for the education category."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. CRS-001
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    instructor = models.CharField(max_length=100)
    category = models.CharField(max_length=100)        # Programming, Design, etc.
    duration_hours = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('draft', 'Draft'), ('archived', 'Archived')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Student(models.Model):
    """Stores student info for the education category."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. STU-001
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
    """Links a student to a course with progress tracking."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. ENR-001
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_date = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)  # 0-100 percentage
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('completed', 'Completed'), ('dropped', 'Dropped')
    ])
    grade = models.CharField(max_length=5, blank=True)  # A+, A, B+, etc.

    def __str__(self):
        return f"{self.student.name} → {self.course.name}"


# ============================================================
# HEALTHCARE MODELS — Departments, Patients, Appointments
# ============================================================

class Department(models.Model):
    """Hospital departments with bed capacity tracking."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. DEPT-001
    name = models.CharField(max_length=100)
    head_doctor = models.CharField(max_length=100)
    beds_total = models.IntegerField(default=0)
    beds_occupied = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Patient(models.Model):
    """Stores patient info for the healthcare category."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. PAT-001
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'), ('female', 'Female'), ('other', 'Other')
    ])
    blood_group = models.CharField(max_length=5, blank=True)  # A+, O-, etc.
    condition = models.CharField(max_length=200, blank=True)   # Diagnosis
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'), ('discharged', 'Discharged'), ('critical', 'Critical')
    ])
    admission_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    """Doctor appointments — links a patient to a department."""
    id = models.CharField(max_length=20, primary_key=True)  # e.g. APT-001
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
