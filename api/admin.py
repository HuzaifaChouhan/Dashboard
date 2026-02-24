from django.contrib import admin
from .models import (
    Product, Order, OrderItem, Customer, UserProfile,
    Course, Student, Enrollment,
    Department, Patient, Appointment
)

# E-Commerce
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Customer)

# Users
admin.site.register(UserProfile)

# Education
admin.site.register(Course)
admin.site.register(Student)
admin.site.register(Enrollment)

# Healthcare
admin.site.register(Department)
admin.site.register(Patient)
admin.site.register(Appointment)
