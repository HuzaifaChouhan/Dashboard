from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, OrderViewSet, CustomerViewSet,
    CourseViewSet, StudentViewSet, EnrollmentViewSet,
    DepartmentViewSet, PatientViewSet, AppointmentViewSet,
    DashboardStatsView, UserProfileView
)

router = DefaultRouter()
# E-Commerce
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'customers', CustomerViewSet)
# Education
router.register(r'courses', CourseViewSet)
router.register(r'students', StudentViewSet)
router.register(r'enrollments', EnrollmentViewSet)
# Healthcare
router.register(r'departments', DepartmentViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
]
