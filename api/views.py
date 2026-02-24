# views.py — API endpoints (ViewSets for CRUD, DashboardStatsView for analytics)
#
# How it works:
# - ViewSets auto-generate GET/POST/PUT/DELETE endpoints
# - DashboardStatsView returns KPIs, chart data, and notifications based on ?category= param
# - UserProfileView returns the logged-in user's role

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


# ============================================================
# CRUD VIEWSETS — Auto-generate list/create/update/delete APIs
# e.g. ProductViewSet → GET /api/products/, POST /api/products/, etc.
# ============================================================

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Support file uploads + JSON
    search_fields = ['name', 'description', 'sku']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Optional filter: /api/orders/?customer_id=CUST-001"""
        qs = super().get_queryset()
        cid = self.request.query_params.get('customer_id')
        return qs.filter(customer__id=cid) if cid else qs


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]


# ============================================================
# USER PROFILE — Returns the role of the logged-in user
# ============================================================
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Auto-create profile if it doesn't exist (first login)
        profile, _ = UserProfile.objects.get_or_create(
            user=request.user, defaults={'role': 'super_admin'}
        )
        return Response(UserProfileSerializer(profile).data)


# ============================================================
# DASHBOARD STATS — Unified endpoint for all 3 categories
# Usage: GET /api/dashboard-stats/?category=ecommerce
# Returns: { kpi, chart_data, chart_labels, recent_items, notifications }
# ============================================================
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Route to the right stats method based on ?category= param."""
        category = request.query_params.get('category', 'ecommerce')
        try:
            handler = {
                'education': self._education_stats,
                'healthcare': self._healthcare_stats,
            }.get(category, self._ecommerce_stats)
            return handler(request)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)

    def _ecommerce_stats(self, request):
        """KPIs: revenue, orders, products sold, active customers."""
        revenue = Order.objects.filter(payment_status='paid').aggregate(s=Sum('total_amount'))['s'] or 0
        orders = Order.objects.count()
        sold = OrderItem.objects.aggregate(s=Sum('quantity'))['s'] or 0
        customers = Customer.objects.filter(status='active').count()

        # Stock levels grouped by product category
        stock_data = Product.objects.values('category').annotate(
            stock=Sum('current_stock')
        ).order_by('-stock')

        ctx = {'request': request}
        return Response({
            'category': 'ecommerce',
            'kpi': [
                {'title': 'Total Revenue', 'value': revenue, 'prefix': '$', 'change': '+12.5%', 'isPositive': True, 'icon': 'DollarSign', 'color': 'from-green-500 to-emerald-600'},
                {'title': 'Total Orders', 'value': orders, 'change': '+8.2%', 'isPositive': True, 'icon': 'ShoppingCart', 'color': 'from-blue-500 to-cyan-600'},
                {'title': 'Products Sold', 'value': sold, 'change': '-3.1%', 'isPositive': False, 'icon': 'Package', 'color': 'from-purple-500 to-pink-600'},
                {'title': 'Active Customers', 'value': customers, 'change': '+15.3%', 'isPositive': True, 'icon': 'Users', 'color': 'from-orange-500 to-red-600'},
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
            'inventory_data': [{'name': i['category'] or 'Uncategorized', 'stock': i['stock'] or 0} for i in stock_data],
            'recent_items': OrderSerializer(Order.objects.order_by('-order_date')[:5], many=True, context=ctx).data,
            'recent_products': ProductSerializer(Product.objects.order_by('-last_restocked')[:5], many=True, context=ctx).data,
            'notifications': [
                {'type': 'warning', 'message': f'{Product.objects.filter(status="low-stock").count()} products are running low on stock', 'time': '5 min ago'},
                {'type': 'success', 'message': f'{Order.objects.filter(status="delivered").count()} orders delivered today', 'time': '1 hour ago'},
                {'type': 'info', 'message': f'{Customer.objects.count()} total customers registered', 'time': '2 hours ago'},
            ]
        })

    def _education_stats(self, request):
        """KPIs: students, completion rate, active courses, revenue."""
        total_students = Student.objects.count()
        active_students = Student.objects.filter(status='active').count()
        total_courses = Course.objects.filter(status='active').count()
        total_enrollments = Enrollment.objects.count()
        completed = Enrollment.objects.filter(status='completed').count()
        completion_rate = round((completed / total_enrollments * 100) if total_enrollments > 0 else 0, 1)
        revenue = Course.objects.aggregate(t=Sum('price'))['t'] or 0
        avg_progress = Enrollment.objects.aggregate(a=Avg('progress'))['a'] or 0

        # How many students per course
        by_course = Course.objects.annotate(enrolled=Count('enrollments')).values('name', 'enrolled').order_by('-enrolled')

        return Response({
            'category': 'education',
            'kpi': [
                {'title': 'Total Students', 'value': total_students, 'change': '+18.2%', 'isPositive': True, 'icon': 'GraduationCap', 'color': 'from-blue-500 to-indigo-600'},
                {'title': 'Completion Rate', 'value': completion_rate, 'suffix': '%', 'change': '+5.4%', 'isPositive': True, 'icon': 'Award', 'color': 'from-green-500 to-emerald-600'},
                {'title': 'Active Courses', 'value': total_courses, 'change': '+2', 'isPositive': True, 'icon': 'BookOpen', 'color': 'from-purple-500 to-pink-600'},
                {'title': 'Course Revenue', 'value': revenue, 'prefix': '$', 'change': '+22.1%', 'isPositive': True, 'icon': 'DollarSign', 'color': 'from-orange-500 to-amber-600'},
            ],
            'chart_data': [
                {'name': 'Jan', 'value': 45, 'secondary': 12}, {'name': 'Feb', 'value': 52, 'secondary': 18},
                {'name': 'Mar', 'value': 61, 'secondary': 22}, {'name': 'Apr', 'value': 58, 'secondary': 15},
                {'name': 'May', 'value': 73, 'secondary': 28}, {'name': 'Jun', 'value': 80, 'secondary': 35},
            ],
            'chart_labels': {'value': 'Enrollments', 'secondary': 'Completions'},
            'inventory_data': [{'name': i['name'], 'stock': i['enrolled']} for i in by_course],
            'recent_items': EnrollmentSerializer(Enrollment.objects.select_related('student', 'course').order_by('-enrolled_date')[:5], many=True).data,
            'notifications': [
                {'type': 'success', 'message': f'{completed} students completed their courses', 'time': '10 min ago'},
                {'type': 'info', 'message': f'{active_students} students currently active', 'time': '30 min ago'},
                {'type': 'warning', 'message': f'Average progress is {round(avg_progress)}%', 'time': '1 hour ago'},
            ]
        })

    def _healthcare_stats(self, request):
        """KPIs: patients, appointments, bed occupancy, critical cases."""
        total_patients = Patient.objects.count()
        critical = Patient.objects.filter(status='critical').count()
        total_appts = Appointment.objects.count()
        completed_appts = Appointment.objects.filter(status='completed').count()
        beds_total = Department.objects.aggregate(t=Sum('beds_total'))['t'] or 0
        beds_used = Department.objects.aggregate(t=Sum('beds_occupied'))['t'] or 0
        occupancy = round((beds_used / beds_total * 100) if beds_total > 0 else 0, 1)

        # Appointments per department
        by_dept = Department.objects.values('name').annotate(patients=Count('appointments')).order_by('-patients')

        return Response({
            'category': 'healthcare',
            'kpi': [
                {'title': 'Total Patients', 'value': total_patients, 'change': '+9.3%', 'isPositive': True, 'icon': 'Heart', 'color': 'from-red-500 to-pink-600'},
                {'title': 'Appointments', 'value': total_appts, 'change': '+12.8%', 'isPositive': True, 'icon': 'Calendar', 'color': 'from-blue-500 to-cyan-600'},
                {'title': 'Bed Occupancy', 'value': occupancy, 'suffix': '%', 'change': '+4.2%', 'isPositive': False, 'icon': 'Bed', 'color': 'from-amber-500 to-orange-600'},
                {'title': 'Critical Cases', 'value': critical, 'change': '-2', 'isPositive': True, 'icon': 'AlertTriangle', 'color': 'from-purple-500 to-indigo-600'},
            ],
            'chart_data': [
                {'name': 'Jan', 'value': 120, 'secondary': 95}, {'name': 'Feb', 'value': 135, 'secondary': 110},
                {'name': 'Mar', 'value': 150, 'secondary': 125}, {'name': 'Apr', 'value': 142, 'secondary': 118},
                {'name': 'May', 'value': 168, 'secondary': 140}, {'name': 'Jun', 'value': 175, 'secondary': 155},
            ],
            'chart_labels': {'value': 'Patients', 'secondary': 'Appointments'},
            'inventory_data': [{'name': i['name'], 'stock': i['patients']} for i in by_dept],
            'recent_items': AppointmentSerializer(Appointment.objects.select_related('patient', 'department').order_by('-appointment_date')[:5], many=True).data,
            'notifications': [
                {'type': 'error', 'message': f'{critical} patients in critical condition', 'time': '2 min ago'},
                {'type': 'warning', 'message': f'Bed occupancy at {occupancy}%', 'time': '15 min ago'},
                {'type': 'success', 'message': f'{completed_appts} appointments completed today', 'time': '1 hour ago'},
            ]
        })
