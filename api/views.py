from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Sum, Count, Avg
from .models import (
    Product, Order, Customer, OrderItem, UserProfile,
    Course, Student, Enrollment,
    Department, Patient, Appointment
)
from .serializers import (
    ProductSerializer, OrderSerializer, CustomerSerializer, UserProfileSerializer,
    CourseSerializer, StudentSerializer, EnrollmentSerializer,
    DepartmentSerializer, PatientSerializer, AppointmentSerializer
)

# ===================== E-COMMERCE VIEWSETS =====================
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

# ===================== EDUCATION VIEWSETS =====================
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['name', 'instructor', 'category']

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['name', 'email']

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

# ===================== HEALTHCARE VIEWSETS =====================
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['name', 'email', 'condition']

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

# ===================== USER PROFILE =====================
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user, role='super_admin')
        return Response(UserProfileSerializer(profile).data)

# ===================== UNIFIED DASHBOARD STATS =====================
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        category = request.query_params.get('category', 'ecommerce')
        try:
            if category == 'education':
                return self._education_stats(request)
            elif category == 'healthcare':
                return self._healthcare_stats(request)
            else:
                return self._ecommerce_stats(request)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)

    def _ecommerce_stats(self, request):
        total_revenue = Order.objects.filter(payment_status='paid').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.count()
        products_sold = OrderItem.objects.aggregate(Sum('quantity'))['quantity__sum'] or 0
        active_customers = Customer.objects.filter(status='active').count()

        recent_orders = Order.objects.order_by('-order_date')[:5]
        recent_products = Product.objects.order_by('-last_restocked')[:5]

        inventory_by_category = Product.objects.values('category').annotate(
            stock=Sum('current_stock')
        ).order_by('-stock')

        ctx = {'request': request}

        return Response({
            'category': 'ecommerce',
            'kpi': [
                {'title': 'Total Revenue', 'value': total_revenue, 'prefix': '$', 'change': '+12.5%', 'isPositive': True, 'icon': 'DollarSign', 'color': 'from-green-500 to-emerald-600'},
                {'title': 'Total Orders', 'value': total_orders, 'change': '+8.2%', 'isPositive': True, 'icon': 'ShoppingCart', 'color': 'from-blue-500 to-cyan-600'},
                {'title': 'Products Sold', 'value': products_sold, 'change': '-3.1%', 'isPositive': False, 'icon': 'Package', 'color': 'from-purple-500 to-pink-600'},
                {'title': 'Active Customers', 'value': active_customers, 'change': '+15.3%', 'isPositive': True, 'icon': 'Users', 'color': 'from-orange-500 to-red-600'},
            ],
            'chart_data': [
                {'name': 'Jan', 'value': 4000, 'secondary': 240},
                {'name': 'Feb', 'value': 3000, 'secondary': 198},
                {'name': 'Mar', 'value': 5000, 'secondary': 300},
                {'name': 'Apr', 'value': 4500, 'secondary': 278},
                {'name': 'May', 'value': 6000, 'secondary': 389},
                {'name': 'Jun', 'value': 5500, 'secondary': 349},
            ],
            'chart_labels': {'value': 'Revenue ($)', 'secondary': 'Orders'},
            'inventory_data': [{'name': item['category'] or 'Uncategorized', 'stock': item['stock'] or 0} for item in inventory_by_category],
            'recent_items': OrderSerializer(recent_orders, many=True, context=ctx).data,
            'recent_products': ProductSerializer(recent_products, many=True, context=ctx).data,
            'notifications': [
                {'type': 'warning', 'message': f'{Product.objects.filter(status="low-stock").count()} products are running low on stock', 'time': '5 min ago'},
                {'type': 'success', 'message': f'{Order.objects.filter(status="delivered").count()} orders delivered today', 'time': '1 hour ago'},
                {'type': 'info', 'message': f'{Customer.objects.count()} total customers registered', 'time': '2 hours ago'},
            ]
        })

    def _education_stats(self, request):
        total_students = Student.objects.count()
        active_students = Student.objects.filter(status='active').count()
        total_courses = Course.objects.filter(status='active').count()
        total_enrollments = Enrollment.objects.count()
        completed = Enrollment.objects.filter(status='completed').count()
        completion_rate = round((completed / total_enrollments * 100) if total_enrollments > 0 else 0, 1)
        course_revenue = Course.objects.aggregate(total=Sum('price'))['total'] or 0
        avg_progress = Enrollment.objects.aggregate(avg=Avg('progress'))['avg'] or 0

        enrollments_by_course = Course.objects.annotate(
            enrolled=Count('enrollments')
        ).values('name', 'enrolled').order_by('-enrolled')

        recent_enrollments = Enrollment.objects.select_related('student', 'course').order_by('-enrolled_date')[:5]

        return Response({
            'category': 'education',
            'kpi': [
                {'title': 'Total Students', 'value': total_students, 'change': '+18.2%', 'isPositive': True, 'icon': 'GraduationCap', 'color': 'from-blue-500 to-indigo-600'},
                {'title': 'Completion Rate', 'value': completion_rate, 'suffix': '%', 'change': '+5.4%', 'isPositive': True, 'icon': 'Award', 'color': 'from-green-500 to-emerald-600'},
                {'title': 'Active Courses', 'value': total_courses, 'change': '+2', 'isPositive': True, 'icon': 'BookOpen', 'color': 'from-purple-500 to-pink-600'},
                {'title': 'Course Revenue', 'value': course_revenue, 'prefix': '$', 'change': '+22.1%', 'isPositive': True, 'icon': 'DollarSign', 'color': 'from-orange-500 to-amber-600'},
            ],
            'chart_data': [
                {'name': 'Jan', 'value': 45, 'secondary': 12},
                {'name': 'Feb', 'value': 52, 'secondary': 18},
                {'name': 'Mar', 'value': 61, 'secondary': 22},
                {'name': 'Apr', 'value': 58, 'secondary': 15},
                {'name': 'May', 'value': 73, 'secondary': 28},
                {'name': 'Jun', 'value': 80, 'secondary': 35},
            ],
            'chart_labels': {'value': 'Enrollments', 'secondary': 'Completions'},
            'inventory_data': [{'name': item['name'], 'stock': item['enrolled']} for item in enrollments_by_course],
            'recent_items': EnrollmentSerializer(recent_enrollments, many=True).data,
            'notifications': [
                {'type': 'success', 'message': f'{completed} students completed their courses', 'time': '10 min ago'},
                {'type': 'info', 'message': f'{active_students} students currently active', 'time': '30 min ago'},
                {'type': 'warning', 'message': f'Average progress is {round(avg_progress)}% — some students may need attention', 'time': '1 hour ago'},
            ]
        })

    def _healthcare_stats(self, request):
        total_patients = Patient.objects.count()
        active_patients = Patient.objects.filter(status='active').count()
        critical_patients = Patient.objects.filter(status='critical').count()
        total_appointments = Appointment.objects.count()
        completed_appointments = Appointment.objects.filter(status='completed').count()
        total_beds = Department.objects.aggregate(total=Sum('beds_total'))['total'] or 0
        occupied_beds = Department.objects.aggregate(total=Sum('beds_occupied'))['total'] or 0
        occupancy_rate = round((occupied_beds / total_beds * 100) if total_beds > 0 else 0, 1)

        dept_stats = Department.objects.values('name').annotate(
            patients=Count('appointments')
        ).order_by('-patients')

        recent_appointments = Appointment.objects.select_related('patient', 'department').order_by('-appointment_date')[:5]

        return Response({
            'category': 'healthcare',
            'kpi': [
                {'title': 'Total Patients', 'value': total_patients, 'change': '+9.3%', 'isPositive': True, 'icon': 'Heart', 'color': 'from-red-500 to-pink-600'},
                {'title': 'Appointments', 'value': total_appointments, 'change': '+12.8%', 'isPositive': True, 'icon': 'Calendar', 'color': 'from-blue-500 to-cyan-600'},
                {'title': 'Bed Occupancy', 'value': occupancy_rate, 'suffix': '%', 'change': '+4.2%', 'isPositive': False, 'icon': 'Bed', 'color': 'from-amber-500 to-orange-600'},
                {'title': 'Critical Cases', 'value': critical_patients, 'change': '-2', 'isPositive': True, 'icon': 'AlertTriangle', 'color': 'from-purple-500 to-indigo-600'},
            ],
            'chart_data': [
                {'name': 'Jan', 'value': 120, 'secondary': 95},
                {'name': 'Feb', 'value': 135, 'secondary': 110},
                {'name': 'Mar', 'value': 150, 'secondary': 125},
                {'name': 'Apr', 'value': 142, 'secondary': 118},
                {'name': 'May', 'value': 168, 'secondary': 140},
                {'name': 'Jun', 'value': 175, 'secondary': 155},
            ],
            'chart_labels': {'value': 'Patients', 'secondary': 'Appointments'},
            'inventory_data': [{'name': item['name'], 'stock': item['patients']} for item in dept_stats],
            'recent_items': AppointmentSerializer(recent_appointments, many=True).data,
            'notifications': [
                {'type': 'error', 'message': f'{critical_patients} patients in critical condition', 'time': '2 min ago'},
                {'type': 'warning', 'message': f'Bed occupancy at {occupancy_rate}%', 'time': '15 min ago'},
                {'type': 'success', 'message': f'{completed_appointments} appointments completed today', 'time': '1 hour ago'},
            ]
        })
