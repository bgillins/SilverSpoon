from django.test import TestCase
from django.core import mail
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser
from django.test.utils import override_settings


class APIPasswordResetTest(TestCase):
    @override_settings(REST_FRAMEWORK={
        'DEFAULT_THROTTLE_RATES': {'password_reset': '3/minute'}
    })
    def test_password_reset_rate_limiting(self):
        for _ in range(3):
            response = self.client.post(self.url, {'email': 'test@example.com'})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # This request should be throttled
        response = self.client.post(self.url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

        # Ensure the throttled request didn't send an email
        self.assertEqual(len(mail.outbox), 3)
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123'
        )
        self.url = reverse('password_reset')  # Make sure this matches your URL configuration

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