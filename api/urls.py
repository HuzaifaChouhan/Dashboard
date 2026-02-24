# urls.py — Maps URL paths to API views
# The router auto-generates CRUD endpoints for each ViewSet
# e.g. router.register('products', ...) creates:
#   GET    /api/products/       → list all
#   POST   /api/products/       → create new
#   GET    /api/products/{id}/  → get one
#   PUT    /api/products/{id}/  → update
#   DELETE /api/products/{id}/  → delete

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, OrderViewSet, CustomerViewSet,
    CourseViewSet, StudentViewSet, EnrollmentViewSet,
    DepartmentViewSet, PatientViewSet, AppointmentViewSet,
    DashboardStatsView, UserProfileView
)

router = DefaultRouter()

# E-Commerce endpoints
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'customers', CustomerViewSet)

# Education endpoints
router.register(r'courses', CourseViewSet)
router.register(r'students', StudentViewSet)
router.register(r'enrollments', EnrollmentViewSet)

# Healthcare endpoints
router.register(r'departments', DepartmentViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),                                # All CRUD routes
    path('dashboard-stats/', DashboardStatsView.as_view()),        # GET ?category=ecommerce|education|healthcare
    path('user-profile/', UserProfileView.as_view()),              # GET → returns logged-in user's role
]
