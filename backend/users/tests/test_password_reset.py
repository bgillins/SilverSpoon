from django.test import TestCase
from django.core import mail
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser

class PasswordResetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            email='brandongillins@gmail.com',
            username='brandongillins',
            password='testpassword123'
        )
        self.url = reverse('password_reset')

    def test_password_reset_email(self):
        # Send password reset request
        response = self.client.post(self.url, {'email': 'brandongillins@gmail.com'})
        
        # Check if the request was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Password reset email sent.")

        # Check if an email was sent
        self.assertEqual(len(mail.outbox), 1)

        # Check the email details
        email = mail.outbox[0]
        self.assertEqual(email.to, ['brandongillins@gmail.com'])
        self.assertEqual(email.subject, "Password Reset Request")
        self.assertIn("Click the following link to reset your password:", email.body)

    def test_password_reset_invalid_email(self):
        # Send password reset request with invalid email
        response = self.client.post(self.url, {'email': 'invalid@email.com'})
        
        # Check if the request was unsuccessful
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check if no email was sent
        self.assertEqual(len(mail.outbox), 0)