# serializers.py — Converts Django model instances to/from JSON for the REST API
# Each serializer maps to a model and defines which fields are exposed

from rest_framework import serializers
from .models import (
    Product, Order, OrderItem, Customer, UserProfile,
    Course, Student, Enrollment,
    Department, Patient, Appointment
)


# --- User Profile ---
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')  # Pull username from related User

    class Meta:
        model = UserProfile
        fields = ['username', 'role']


# --- E-Commerce ---
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'  # Expose all fields


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')  # Get name from related Product
    product_image = serializers.SerializerMethodField()  # Custom method to safely get image URL

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price_at_purchase']

    def get_product_image(self, obj):
        """Convert ImageField to string URL safely (avoids serialization errors)."""
        return str(obj.product.image) if obj.product.image else None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  # Nested: show items within order
    customer_name = serializers.ReadOnlyField(source='customer.name')
    customer_email = serializers.ReadOnlyField(source='customer.email')

    class Meta:
        model = Order
        fields = '__all__'


# --- Education ---
class CourseSerializer(serializers.ModelSerializer):
    enrollment_count = serializers.SerializerMethodField()  # Computed: how many students enrolled

    class Meta:
        model = Course
        fields = '__all__'

    def get_enrollment_count(self, obj):
        return obj.enrollments.count()


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')  # From related Student
    course_name = serializers.ReadOnlyField(source='course.name')    # From related Course

    class Meta:
        model = Enrollment
        fields = '__all__'


# --- Healthcare ---
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.name')       # From related Patient
    department_name = serializers.ReadOnlyField(source='department.name') # From related Department

    class Meta:
        model = Appointment
        fields = '__all__'
