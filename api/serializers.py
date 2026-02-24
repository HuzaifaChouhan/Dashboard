from rest_framework import serializers
from .models import (
    Product, Order, OrderItem, Customer, UserProfile,
    Course, Student, Enrollment,
    Department, Patient, Appointment
)

# ===================== USER =====================
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = UserProfile
        fields = ['username', 'role']

# ===================== E-COMMERCE =====================
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price_at_purchase']

    def get_product_image(self, obj):
        if obj.product.image:
            return str(obj.product.image)
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.ReadOnlyField(source='customer.name')
    customer_email = serializers.ReadOnlyField(source='customer.email')
    class Meta:
        model = Order
        fields = '__all__'

# ===================== EDUCATION =====================
class CourseSerializer(serializers.ModelSerializer):
    enrollment_count = serializers.SerializerMethodField()
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
    student_name = serializers.ReadOnlyField(source='student.name')
    course_name = serializers.ReadOnlyField(source='course.name')
    class Meta:
        model = Enrollment
        fields = '__all__'

# ===================== HEALTHCARE =====================
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.name')
    department_name = serializers.ReadOnlyField(source='department.name')
    class Meta:
        model = Appointment
        fields = '__all__'
