# seed_data.py — Populates the database with sample data for all 3 categories
# Run with: python seed_data.py
#
# Creates: 3 users (admin/manager/viewer), 7 products, 4 customers, 5 orders,
#          5 courses, 8 students, 10 enrollments, 5 departments, 7 patients, 8 appointments
import os
import django
from datetime import datetime, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import (
    Product, Customer, Order, OrderItem, UserProfile,
    Course, Student, Enrollment,
    Department, Patient, Appointment
)
from django.contrib.auth.models import User
from django.utils import timezone

def run_seed():
    print('🌱 Seeding data...')

    # ===================== USERS & ROLES =====================
    users_data = [
        {'username': 'admin', 'email': 'admin@example.com', 'password': 'admin', 'role': 'super_admin'},
        {'username': 'manager', 'email': 'manager@example.com', 'password': 'manager123', 'role': 'manager'},
        {'username': 'viewer', 'email': 'viewer@example.com', 'password': 'viewer123', 'role': 'viewer'},
    ]
    for u in users_data:
        user, created = User.objects.get_or_create(username=u['username'], defaults={'email': u['email']})
        if created:
            user.set_password(u['password'])
            user.is_superuser = u['role'] == 'super_admin'
            user.is_staff = u['role'] in ('super_admin', 'manager')
            user.save()
        UserProfile.objects.get_or_create(user=user, defaults={'role': u['role']})
    print('✅ Users created: admin/admin, manager/manager123, viewer/viewer123')

    # ===================== E-COMMERCE =====================
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    Product.objects.all().delete()
    Customer.objects.all().delete()

    products_data = [
        {"id": "PRD-001", "name": "Wireless Headphones Pro", "description": "Premium noise cancellation with 30-hour battery life", "price": 199.99, "category": "Electronics", "stock": 150, "sku": "WHP-001", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", "status": "in-stock"},
        {"id": "PRD-002", "name": "Smart Watch Series 5", "description": "Fitness tracking & notifications", "price": 249.99, "category": "Electronics", "stock": 75, "sku": "SWS-005", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", "status": "in-stock"},
        {"id": "PRD-003", "name": "360° Bluetooth Speaker", "description": "Portable with 20h battery life", "price": 89.99, "category": "Electronics", "stock": 5, "sku": "BTS-360", "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", "status": "low-stock"},
        {"id": "PRD-004", "name": "Organic Green Tea", "description": "Premium grade organic tea leaves", "price": 24.99, "category": "Food & Beverage", "stock": 200, "sku": "OGT-100", "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop", "status": "in-stock"},
        {"id": "PRD-005", "name": "Yoga Mat Premium", "description": "Non-slip eco-friendly material", "price": 45.99, "category": "Sports", "stock": 0, "sku": "YMP-001", "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", "status": "out-of-stock"},
        {"id": "PRD-006", "name": "Laptop Stand Aluminum", "description": "Ergonomic adjustable stand", "price": 59.99, "category": "Accessories", "stock": 120, "sku": "LSA-001", "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", "status": "in-stock"},
        {"id": "PRD-007", "name": "Mechanical Keyboard", "description": "RGB backlit, Cherry MX switches", "price": 129.99, "category": "Electronics", "stock": 8, "sku": "MKB-001", "image": "https://images.unsplash.com/photo-1541140532154-b024d7e3434e?w=400&h=400&fit=crop", "status": "low-stock"},
    ]

    for p in products_data:
        Product.objects.create(id=p['id'], name=p['name'], description=p['description'], unit_price=p['price'], category=p['category'], current_stock=p['stock'], sku=p['sku'], image=p['image'], status=p['status'])
    print(f'✅ Created {len(products_data)} products')

    customers_data = [
        {"id": "CUST-001", "name": "John Doe", "email": "john.doe@email.com", "phone": "+1 (555) 123-4567", "address": "123 Main St, New York, NY 10001", "loyalty_tier": "Gold"},
        {"id": "CUST-002", "name": "Jane Smith", "email": "jane.smith@email.com", "phone": "+1 (555) 234-5678", "address": "456 Oak Ave, Los Angeles, CA 90001", "loyalty_tier": "Silver"},
        {"id": "CUST-003", "name": "Robert Johnson", "email": "robert.j@email.com", "phone": "+1 (555) 345-6789", "address": "789 Pine Rd, Chicago, IL 60601", "loyalty_tier": "Bronze"},
        {"id": "CUST-004", "name": "Emily Davis", "email": "emily.d@email.com", "phone": "+1 (555) 456-7890", "address": "321 Elm St, Houston, TX 77001", "loyalty_tier": "Gold"},
    ]

    for c in customers_data:
        Customer.objects.create(id=c['id'], name=c['name'], email=c['email'], phone=c['phone'], address=c['address'], loyalty_tier=c['loyalty_tier'])
    print(f'✅ Created {len(customers_data)} customers')

    orders_data = [
        {"id": "ORD-2024-001", "customer_id": "CUST-001", "status": "delivered", "payment_method": "Credit Card", "payment_status": "paid", "total_amount": 259.98, "items": [("PRD-001", 1), ("PRD-004", 2)]},
        {"id": "ORD-2024-002", "customer_id": "CUST-002", "status": "shipped", "payment_method": "PayPal", "payment_status": "paid", "total_amount": 189.99, "items": [("PRD-002", 1)]},
        {"id": "ORD-2024-003", "customer_id": "CUST-003", "status": "processing", "payment_method": "Debit Card", "payment_status": "paid", "total_amount": 425.50, "items": [("PRD-003", 2), ("PRD-001", 1)]},
        {"id": "ORD-2024-004", "customer_id": "CUST-004", "status": "pending", "payment_method": "Credit Card", "payment_status": "pending", "total_amount": 129.99, "items": [("PRD-007", 1)]},
        {"id": "ORD-2024-005", "customer_id": "CUST-001", "status": "delivered", "payment_method": "PayPal", "payment_status": "paid", "total_amount": 89.99, "items": [("PRD-003", 1)]},
    ]

    for o in orders_data:
        customer = Customer.objects.get(id=o['customer_id'])
        order = Order.objects.create(id=o['id'], customer=customer, status=o['status'], payment_method=o['payment_method'], payment_status=o['payment_status'], total_amount=o['total_amount'], shipping_address=customer.address)
        for prod_id, qty in o['items']:
            product = Product.objects.get(id=prod_id)
            OrderItem.objects.create(order=order, product=product, quantity=qty, price_at_purchase=product.unit_price)
    print(f'✅ Created {len(orders_data)} orders')

    # ===================== EDUCATION =====================
    Enrollment.objects.all().delete()
    Course.objects.all().delete()
    Student.objects.all().delete()

    courses_data = [
        {"id": "CRS-001", "name": "Python Full Stack Development", "description": "Learn Python, Django, React from scratch", "instructor": "Dr. Sarah Wilson", "category": "Programming", "duration": 120, "price": 499.99},
        {"id": "CRS-002", "name": "Data Science & Machine Learning", "description": "Hands-on ML with real-world projects", "instructor": "Prof. Michael Chen", "category": "Data Science", "duration": 160, "price": 599.99},
        {"id": "CRS-003", "name": "UI/UX Design Masterclass", "description": "Figma, prototyping, user research", "instructor": "Lisa Anderson", "category": "Design", "duration": 80, "price": 349.99},
        {"id": "CRS-004", "name": "Cloud Computing with AWS", "description": "Deploy scalable applications on AWS", "instructor": "James Baker", "category": "Cloud", "duration": 100, "price": 449.99},
        {"id": "CRS-005", "name": "Cybersecurity Fundamentals", "description": "Network security, ethical hacking", "instructor": "Dr. Alex Turner", "category": "Security", "duration": 90, "price": 399.99},
    ]

    for c in courses_data:
        Course.objects.create(id=c['id'], name=c['name'], description=c['description'], instructor=c['instructor'], category=c['category'], duration_hours=c['duration'], price=c['price'])
    print(f'✅ Created {len(courses_data)} courses')

    students_data = [
        {"id": "STU-001", "name": "Alice Brown", "email": "alice.b@university.edu", "phone": "+1 (555) 111-2233", "status": "active"},
        {"id": "STU-002", "name": "David Lee", "email": "david.l@university.edu", "phone": "+1 (555) 222-3344", "status": "active"},
        {"id": "STU-003", "name": "Emma Watson", "email": "emma.w@university.edu", "phone": "+1 (555) 333-4455", "status": "graduated"},
        {"id": "STU-004", "name": "Frank Miller", "email": "frank.m@university.edu", "phone": "+1 (555) 444-5566", "status": "active"},
        {"id": "STU-005", "name": "Grace Kim", "email": "grace.k@university.edu", "phone": "+1 (555) 555-6677", "status": "active"},
        {"id": "STU-006", "name": "Henry Park", "email": "henry.p@university.edu", "phone": "+1 (555) 666-7788", "status": "active"},
        {"id": "STU-007", "name": "Ivy Chen", "email": "ivy.c@university.edu", "phone": "+1 (555) 777-8899", "status": "inactive"},
        {"id": "STU-008", "name": "Jack Wilson", "email": "jack.w@university.edu", "phone": "+1 (555) 888-9900", "status": "active"},
    ]

    for s in students_data:
        Student.objects.create(id=s['id'], name=s['name'], email=s['email'], phone=s['phone'], status=s['status'])
    print(f'✅ Created {len(students_data)} students')

    enrollments_data = [
        {"id": "ENR-001", "student": "STU-001", "course": "CRS-001", "progress": 85, "status": "active", "grade": "A"},
        {"id": "ENR-002", "student": "STU-002", "course": "CRS-002", "progress": 45, "status": "active", "grade": ""},
        {"id": "ENR-003", "student": "STU-003", "course": "CRS-001", "progress": 100, "status": "completed", "grade": "A+"},
        {"id": "ENR-004", "student": "STU-004", "course": "CRS-003", "progress": 60, "status": "active", "grade": "B"},
        {"id": "ENR-005", "student": "STU-005", "course": "CRS-004", "progress": 30, "status": "active", "grade": ""},
        {"id": "ENR-006", "student": "STU-006", "course": "CRS-002", "progress": 100, "status": "completed", "grade": "A"},
        {"id": "ENR-007", "student": "STU-001", "course": "CRS-005", "progress": 20, "status": "active", "grade": ""},
        {"id": "ENR-008", "student": "STU-007", "course": "CRS-001", "progress": 10, "status": "dropped", "grade": ""},
        {"id": "ENR-009", "student": "STU-008", "course": "CRS-003", "progress": 100, "status": "completed", "grade": "A"},
        {"id": "ENR-010", "student": "STU-002", "course": "CRS-005", "progress": 75, "status": "active", "grade": "B+"},
    ]

    for e in enrollments_data:
        Enrollment.objects.create(id=e['id'], student_id=e['student'], course_id=e['course'], progress=e['progress'], status=e['status'], grade=e['grade'])
    print(f'✅ Created {len(enrollments_data)} enrollments')

    # ===================== HEALTHCARE =====================
    Appointment.objects.all().delete()
    Patient.objects.all().delete()
    Department.objects.all().delete()

    departments_data = [
        {"id": "DEPT-001", "name": "Cardiology", "head_doctor": "Dr. Richard Heart", "beds_total": 30, "beds_occupied": 22},
        {"id": "DEPT-002", "name": "Neurology", "head_doctor": "Dr. Brain Smart", "beds_total": 25, "beds_occupied": 18},
        {"id": "DEPT-003", "name": "Orthopedics", "head_doctor": "Dr. Bone Strong", "beds_total": 20, "beds_occupied": 15},
        {"id": "DEPT-004", "name": "Pediatrics", "head_doctor": "Dr. Kids Care", "beds_total": 35, "beds_occupied": 20},
        {"id": "DEPT-005", "name": "Emergency", "head_doctor": "Dr. Quick Help", "beds_total": 40, "beds_occupied": 35},
    ]

    for d in departments_data:
        Department.objects.create(id=d['id'], name=d['name'], head_doctor=d['head_doctor'], beds_total=d['beds_total'], beds_occupied=d['beds_occupied'])
    print(f'✅ Created {len(departments_data)} departments')

    patients_data = [
        {"id": "PAT-001", "name": "Maria Garcia", "email": "maria.g@email.com", "phone": "+1 555-1001", "age": 45, "gender": "female", "blood_group": "A+", "condition": "Cardiac Arrhythmia", "status": "active"},
        {"id": "PAT-002", "name": "James Wilson", "email": "james.w@email.com", "phone": "+1 555-1002", "age": 62, "gender": "male", "blood_group": "O+", "condition": "Knee Replacement", "status": "active"},
        {"id": "PAT-003", "name": "Sophie Lee", "email": "sophie.l@email.com", "phone": "+1 555-1003", "age": 8, "gender": "female", "blood_group": "B+", "condition": "Tonsillitis", "status": "active"},
        {"id": "PAT-004", "name": "Thomas Brown", "email": "thomas.b@email.com", "phone": "+1 555-1004", "age": 55, "gender": "male", "blood_group": "AB-", "condition": "Stroke Recovery", "status": "critical"},
        {"id": "PAT-005", "name": "Anna White", "email": "anna.w@email.com", "phone": "+1 555-1005", "age": 34, "gender": "female", "blood_group": "O-", "condition": "Fracture - Right Arm", "status": "active"},
        {"id": "PAT-006", "name": "Michael Davis", "email": "michael.d@email.com", "phone": "+1 555-1006", "age": 70, "gender": "male", "blood_group": "A-", "condition": "Heart Bypass", "status": "critical"},
        {"id": "PAT-007", "name": "Lisa Johnson", "email": "lisa.j@email.com", "phone": "+1 555-1007", "age": 28, "gender": "female", "blood_group": "B-", "condition": "Migraine", "status": "discharged"},
    ]

    for p in patients_data:
        Patient.objects.create(id=p['id'], name=p['name'], email=p['email'], phone=p['phone'], age=p['age'], gender=p['gender'], blood_group=p['blood_group'], condition=p['condition'], status=p['status'])
    print(f'✅ Created {len(patients_data)} patients')

    now = timezone.now()
    appointments_data = [
        {"id": "APT-001", "patient": "PAT-001", "doctor": "Dr. Richard Heart", "dept": "DEPT-001", "date": now - timedelta(hours=2), "status": "completed", "notes": "ECG normal, follow-up in 2 weeks"},
        {"id": "APT-002", "patient": "PAT-002", "doctor": "Dr. Bone Strong", "dept": "DEPT-003", "date": now + timedelta(hours=3), "status": "scheduled", "notes": "Pre-surgery assessment"},
        {"id": "APT-003", "patient": "PAT-003", "doctor": "Dr. Kids Care", "dept": "DEPT-004", "date": now - timedelta(hours=5), "status": "completed", "notes": "Prescribed antibiotics"},
        {"id": "APT-004", "patient": "PAT-004", "doctor": "Dr. Brain Smart", "dept": "DEPT-002", "date": now + timedelta(hours=1), "status": "scheduled", "notes": "MRI scan required"},
        {"id": "APT-005", "patient": "PAT-005", "doctor": "Dr. Bone Strong", "dept": "DEPT-003", "date": now - timedelta(days=1), "status": "completed", "notes": "Cast applied, review in 4 weeks"},
        {"id": "APT-006", "patient": "PAT-006", "doctor": "Dr. Richard Heart", "dept": "DEPT-001", "date": now + timedelta(hours=6), "status": "scheduled", "notes": "Pre-op consultation"},
        {"id": "APT-007", "patient": "PAT-001", "doctor": "Dr. Richard Heart", "dept": "DEPT-001", "date": now + timedelta(days=14), "status": "scheduled", "notes": "Follow-up appointment"},
        {"id": "APT-008", "patient": "PAT-007", "doctor": "Dr. Brain Smart", "dept": "DEPT-002", "date": now - timedelta(days=3), "status": "cancelled", "notes": "Patient requested reschedule"},
    ]

    for a in appointments_data:
        Appointment.objects.create(id=a['id'], patient_id=a['patient'], doctor=a['doctor'], department_id=a['dept'], appointment_date=a['date'], status=a['status'], notes=a['notes'])
    print(f'✅ Created {len(appointments_data)} appointments')

    print('\n🎉 Seeding complete! Database ready.')
    print('📋 Login credentials:')
    print('   Super Admin: admin / admin')
    print('   Manager:     manager / manager123')
    print('   Viewer:      viewer / viewer123')

if __name__ == '__main__':
    run_seed()
