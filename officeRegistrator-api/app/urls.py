from django.urls import path

from app.views import CourseListAPIView, CurrentUser, NewsListAPIView, files_view, CourseDetailAPIView, \
    StudentListAPIView, UserAPIView
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('login/', obtain_jwt_token),
    path('courses/', CourseListAPIView.as_view()),
    path('courses/<int:course_id>/', CourseDetailAPIView.as_view()),
    path('user/', CurrentUser.as_view()),
    path('user/<int:user_id>/', UserAPIView.as_view()),
    path('user/students', StudentListAPIView.as_view()),
    path('news/', NewsListAPIView.as_view()),
    path('files/<int:teacher>/<path:path>/', files_view),
]
