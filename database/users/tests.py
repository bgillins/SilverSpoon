from django.test import TestCase

# Create a test for the LoginView
class LoginViewTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword')

    def test_login_with_valid_credentials(self):
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'testpassword'})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'User logged in successfully')
