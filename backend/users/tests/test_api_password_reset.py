import time
from django.test import TestCase
from django.core import mail
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser
from django.test.utils import override_settings
from django.core.cache import cache
from rest_framework.throttling import AnonRateThrottle
import time
import logging

import time
from rest_framework.throttling import SimpleRateThrottle
import logging

logger = logging.getLogger(__name__)

class PasswordResetThrottle(SimpleRateThrottle):
    scope = 'password_reset'

    def get_cache_key(self, request, view):
        ident = ''.join(request.META.get(key, '') for key in ('HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'))
        return f"throttle_password_reset_{ident}"

    def allow_request(self, request, view):
        if self.rate is None:
            return True

        self.key = self.get_cache_key(request, view)
        if self.key is None:
            return True

        self.history = self.cache.get(self.key, [])
        self.now = time.time()

        while self.history and self.history[-1] <= self.now - self.duration:
            self.history.pop()

        logger.debug(f"History: {self.history}, Now: {self.now}, Duration: {self.duration}, Num requests: {self.num_requests}")

        if len(self.history) >= self.num_requests:
            logger.debug("Request not allowed")
            return False

        logger.debug("Request allowed")
        return self.throttle_success()

    def throttle_success(self):
        self.history.insert(0, self.now)
        self.cache.set(self.key, self.history, self.duration)
        return True

class APIPasswordResetTest(TestCase):
    @override_settings(
        REST_FRAMEWORK={
            'DEFAULT_THROTTLE_CLASSES': ['users.views.PasswordResetThrottle'],
            'DEFAULT_THROTTLE_RATES': {'password_reset': '3/min'}
        }
    )
    def test_password_reset_rate_limiting(self):
        for i in range(4):
            print(f"\nRequest {i+1}")
            response = self.client.post(self.url, {'email': 'test@example.com'})
            print(f"Status code: {response.status_code}")
            
            expected_status = status.HTTP_200_OK if i < 3 else status.HTTP_429_TOO_MANY_REQUESTS
            self.assertEqual(response.status_code, expected_status, f"Failed on request {i+1}")
            
            time.sleep(1)  # Ensure different timestamps

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123'
        )
        self.url = reverse('password_reset')  # Make sure this matches your URL configuration
        cache.clear()  # Clear the cache before each test

    def test_password_reset_valid_email(self):
        response = self.client.post(self.url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Password reset email sent.")
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "Password Reset Request")

    def test_password_reset_invalid_email(self):
        response = self.client.post(self.url, {'email': 'nonexistent@example.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_password_reset_email_content(self):
        response = self.client.post(self.url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        email = mail.outbox[0]
        self.assertIn("/reset-password/", email.body)

    def test_password_reset_view_missing_email(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_view_method_not_allowed(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)