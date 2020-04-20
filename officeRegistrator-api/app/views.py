import collections
import json

import jwt
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from app.serializers import CourseSerializer, StudentSerializer, TeacherSerializer, UserSerializer, NewsSerializer, \
    FileSerializer
from .models import Course, Student, Teacher, News, File
from django.contrib.auth.hashers import check_password
from django.contrib.auth.forms import PasswordChangeForm


class CourseListAPIView(APIView):
    def this_user(self, request):
        get = request.user
        try:
            user = Student.objects.get(user=get)
        except Student.DoesNotExist as next_s:
            try:
                user = Teacher.objects.get(user=get)
            except Teacher.DoesNotExist as next_t:
                return None
            return user
        return user

    def get(self, request):
        user = self.this_user(request)
        if user.__class__.__name__ == Student.__name__:
            courses = [c for c in Course.objects.all() if c in user.courses.all()]
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data)
        elif user.__class__.__name__ == Teacher.__name__:
            courses = [c for c in Course.objects.all() if c.teacher == user]
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data)

    def post(self, request):
        user = self.this_user(request)
        if user.__class__.__name__ == Teacher.__name__:
            serializer = CourseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors)
        return Response({'error': "Not Access"},
                        status=status.HTTP_406_NOT_ACCEPTABLE)


class StudentListAPIView(APIView):
    def this_user(self, request):
        get = request.user
        try:
            user = Student.objects.get(user=get)
        except Student.DoesNotExist as next_s:
            try:
                user = Teacher.objects.get(user=get)
            except Teacher.DoesNotExist as next_t:
                return None
            return user
        return user

    def get(self, request):
        user = self.this_user(request)
        if user.__class__.__name__ == Teacher.__name__:
            students = Student.objects.all()
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)

    def post(self, request):
        pass


class NewsListAPIView(APIView):
    def get(self, request):
        if request.user.is_anonymous:
            return Response({'error': "Not Access"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        news = News.objects.all()
        serializer = NewsSerializer(news, many=True)
        return Response(serializer.data)


class CurrentUser(APIView):
    def this_user(self, request):
        get = request.user
        try:
            user = Student.objects.get(user=get)
        except Student.DoesNotExist as next_s:
            try:
                user = Teacher.objects.get(user=get)
            except Teacher.DoesNotExist as next_t:
                return None
            return user
        return user

    def get(self, request):
        if request.user.is_anonymous:
            return Response({'error': "Not Access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            serializer = UserSerializer(request.user, many=False)
            data = serializer.data
            if self.this_user(request).__class__.__name__ == Teacher.__name__:
                data.update({"type": "Teacher"})
            elif self.this_user(request).__class__.__name__ == Student.__name__:
                data.update({"type": "Student"})
            return Response(data)

    def put(self, request):
        if request.user.is_anonymous:
            return Response({'error': "Not Access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            data = {
                "old_password": request.data.get("old_password"),
                "new_password1": request.data.get("new_password1"),
                "new_password2": request.data.get("new_password2"),
            }

            form = PasswordChangeForm(request.user, data)

            if form.is_valid():
                data = {
                    "id": request.user.id,
                    "username": request.data.get("username"),
                    "first_name": request.data.get("first_name"),
                    "last_name": request.data.get("last_name"),
                    "email": request.data.get("email")
                }
                serializer = UserSerializer(instance=User.objects.get(id=request.user.id),
                                            data=data, many=False)
                if serializer.is_valid():
                    serializer.save()
                    user = form.save()
                    update_session_auth_hash(request, user)  # Important!
                    return Response(serializer.data)
                return Response({"ERROR": serializer.errors})
            else:
                return Response({"ERROR": form.errors})


class CourseDetailAPIView(APIView):
    def this_user(self, request):
        get = request.user
        try:
            user = Student.objects.get(user=get)
        except Student.DoesNotExist as next_s:
            try:
                user = Teacher.objects.get(user=get)
            except Teacher.DoesNotExist as next_t:
                return None
            return user
        return user

    def get(self, request, course_id):
        user = self.this_user(request)
        if user:
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist as e:
                return Response({'error': str(e)})
            serializer = CourseSerializer(course)
            return Response(serializer.data)
        else:
            return Response({'error': 'Not Access'}, status=status.HTTP_401_UNAUTHORIZED)


class UserAPIView(APIView):
    def get(self, request, user_id):
        if request.user.is_anonymous:
            return Response({'error': 'Not Access'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                user = User.objects.get(id=user_id)
            except Course.DoesNotExist as e:
                return Response({'error': str(e)})
            serializer = UserSerializer(user)
            return Response(serializer.data)


@api_view(['GET', 'POST'])
def files_view(request, path, teacher):
    def this_user(get):
        try:
            to = Student.objects.get(user=get)
        except Student.DoesNotExist as next_s:
            try:
                to = Teacher.objects.get(user=get)
            except Teacher.DoesNotExist as next_t:
                return None
            return to
        return to

    if request.method == 'GET':
        user = this_user(request.user)
        if user.__class__.__name__ == Student.__name__:
            files = []
            for f in File.objects.all():
                if f in user.files.all() and f.path.startswith(path):
                    if teacher != 0 and f.owner.id == teacher:
                        files.append(f)
                    elif teacher == 0:
                        files.append(f)
            serializer = FileSerializer(files, many=True)
            data = serializer.data
            for el in data:
                el.update({"access": "Student"})
            return Response(data)
        elif user.__class__.__name__ == Teacher.__name__:
            files = []
            for f in File.objects.all():
                if f.owner == request.user and f.path.startswith(path):
                    files.append(f)
            serializer = FileSerializer(files, many=True)
            data = serializer.data
            for el in data:
                el.update({"access": "Teacher"})
            return Response(data)

    elif request.method == 'POST':
        user = this_user(request.user)
        if user.__class__.__name__ == Teacher.__name__:
            students = request.data.get('students')
            new_file = {
                'name': request.data.get('name'),
                'path': request.data.get('path'),
                'owner_id': request.data.get('owner_id')
            }
            serializer = FileSerializer(data=new_file)
            if serializer.is_valid():
                serializer.save()
                for s in students:
                    s = Student.objects.get(id=s.get('id'))
                    s.files.add(File.objects.get(name=request.data.get('name'), path=request.data.get('path')))
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print(serializer.errors)
            return Response({'error': serializer.errors},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'error': "Not Access"}, status=status.HTTP_406_NOT_ACCEPTABLE)
