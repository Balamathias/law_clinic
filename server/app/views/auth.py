import os

from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.db import IntegrityError
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from app.constants import APP_NAME
from app.models import User
from app.serializers import RegisterSerializer, TokenObtainPairSerializer
from app.utils import ClinicView, render_email_template, send_email_async


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def create(self, request, *args, **kwargs):
        try:
            email = request.data.get("email")
            if email and User.objects.filter(email=email).exists():
                response = {
                    "status": "Bad request",
                    "message": "Email already registered",
                    "code": status.HTTP_400_BAD_REQUEST,
                    "error": {"email": ["This email address is already in use."]},
                    "data": None,
                }
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            user.generate_otp()

            try:
                self.send_otp_email(user)
            except Exception as email_error:
                print(f"Error sending email: {email_error}")

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = {
                "message": "Registration successful. Please check your email for the OTP.",
                "status": "success",
                "code": status.HTTP_201_CREATED,
                "data": {
                    "user": serializer.data,
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                },
            }
            return Response(response, status=status.HTTP_201_CREATED, headers=headers)

        except ValidationError as e:
            print(e)
            errors = e.detail
            if "email" in errors:
                message = "Invalid email format or email already in use"
            else:
                message = "Registration failed"

            response = {
                "status": "Bad request",
                "message": message,
                "code": status.HTTP_400_BAD_REQUEST,
                "error": errors,
                "data": None,
            }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            if "email" in str(e).lower():
                response = {
                    "status": "Bad request",
                    "message": "Email already registered",
                    "code": status.HTTP_400_BAD_REQUEST,
                    "error": {"email": ["This email address is already in use."]},
                    "data": None,
                }
            else:
                response = {
                    "status": "Bad request",
                    "message": "Registration failed due to data conflict",
                    "code": status.HTTP_400_BAD_REQUEST,
                    "error": {"detail": str(e)},
                    "data": None,
                }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Too bad: ", e)
            user = User.objects.filter(email=request.data.get("email")).first()
            if user and (not user.is_active):
                try:
                    user.generate_otp()
                    self.send_otp_email(user)
                except Exception as resend_error:
                    print(f"Error resending OTP: {resend_error}")

                    response = {
                        "status": "Bad request",
                        "message": "Failed to resend OTP, please try again.",
                        "code": status.HTTP_400_BAD_REQUEST,
                        "error": {"message": "An error occurred while resending the OTP.", "detail": str(resend_error)},
                        "data": None,
                    }
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)

            response = {
                "status": "Bad request",
                "message": "Registration failed, please try again.",
                "code": status.HTTP_400_BAD_REQUEST,
                "error": {
                    "message": "An error occurred while processing your request. Please try again.",
                    "detail": str(e),
                },
                "data": None,
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        user = serializer.save()
        return user

    def send_otp_email(self, user):
        subject = f"{APP_NAME} - Your OTP for account verification"

        # Prepare context for the email template
        context = {
            "user_email": user.email,
            "otp": user.otp,
            "expiry_minutes": 15,
            "username": user.username or user.email.split("@")[0],
            "first_name": user.first_name,
            "last_name": user.last_name,
        }

        try:
            # Render the email template
            html_content, plain_text_content = render_email_template("otp_verification", context)

            # Create email message with both HTML and plain text versions
            email = EmailMultiAlternatives(subject, plain_text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
            email.attach_alternative(html_content, "text/html")
            send_email_async(email)
        except Exception as e:
            print(f"Error sending OTP email: {e}")


class VerifyOTPView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        otp_input = request.data.get("otp")
        email = request.data.get("email")

        if not otp_input or not email:
            return Response(data={"message": "OTP and email are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            if user.is_otp_valid(otp_input):
                user.is_active = True  # Activate the user
                user.otp = None  # Clear the OTP
                user.otp_created_at = None  # Clear OTP timestamp
                user.save()

                # Send welcome email after successful verification
                self.send_welcome_email(user)

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                response = {
                    "message": "OTP verified successfully. Account is now active.",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                }

                return Response(data=response, status=status.HTTP_200_OK)

            else:
                return Response(data={"message": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response(data={"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def send_welcome_email(self, user):
        subject = f"Welcome to {APP_NAME}!"

        context = {
            "username": user.username or user.email.split("@")[0],
            "first_name": user.first_name,
            "last_name": user.last_name,
            "account_url": f"{os.environ.get('FRONTEND_URL', 'https://lawstack.me')}/dashboard",
        }

        html_content, plain_text_content = render_email_template("welcome", context)

        email = EmailMultiAlternatives(subject, plain_text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
        email.attach_alternative(html_content, "text/html")
        send_email_async(email)


class ResendOTPView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")

        if not email:
            return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

            if user.is_active:
                return Response({"message": "User is already active."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate and send new OTP
            user.generate_otp()
            self.send_otp_email(user)

            return Response({"message": "OTP has been resent."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        except ValueError as e:
            response = {
                "status": "Bad request",
                "message": "Wait for at least two minutes before requesting for a new code.",
                "code": status.HTTP_400_BAD_REQUEST,
                "error": {"detail": str(e)},
                "data": None,
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def send_otp_email(self, user):
        subject = f"Your OTP for account verification for {APP_NAME}"

        context = {
            "user_email": user.email,
            "otp": user.otp,
            "expiry_minutes": 15,
            "username": user.username or user.email.split("@")[0],
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_resend": True,
        }

        html_content, plain_text_content = render_email_template("otp_verification", context)

        email = EmailMultiAlternatives(subject, plain_text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
        email.attach_alternative(html_content, "text/html")
        send_email_async(email)


class RequestPasswordResetView(APIView, ClinicView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return self.clinic_response(
                error="Email is required.", message="Email is required.", status_code=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return self.clinic_response(
                error="User not found.", message="No user with this email.", status_code=status.HTTP_404_NOT_FOUND
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Build reset link
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"

        # Send reset email
        subject = f"Reset your {APP_NAME} password"
        context = {
            "username": user.username or user.email.split("@")[0],
            "first_name": user.first_name,
            "last_name": user.last_name,
            "reset_link": reset_link,
            "APP_NAME": APP_NAME,
        }

        try:
            html_content, plain_text_content = render_email_template("password_reset", context)
        except Exception:
            # Fallback template if render_email_template fails or template doesn't exist
            plain_text_content = f"Hello, please click the link to reset your password: {reset_link}"
            html_content = f"<p>Hello, please click the link to reset your password:</p><p><a href='{reset_link}'>{reset_link}</a></p>"

        email_msg = EmailMultiAlternatives(subject, plain_text_content, settings.DEFAULT_FROM_EMAIL, [user.email])
        email_msg.attach_alternative(html_content, "text/html")
        send_email_async(email_msg)

        return self.clinic_response(message="Password reset link sent to your email.", status_code=status.HTTP_200_OK)


class ValidateResetTokenView(APIView, ClinicView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request, uid, token):
        try:
            pk = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=pk)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return self.clinic_response(
                error="Invalid link.",
                message="The password reset link is invalid or expired.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if default_token_generator.check_token(user, token):
            return self.clinic_response(message="Token is valid.", status_code=status.HTTP_200_OK)
        return self.clinic_response(
            error="Invalid or expired token.",
            message="The password reset link is invalid or expired.",
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class ConfirmPasswordResetView(APIView, ClinicView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request, uid, token):
        password = request.data.get("password")
        if not password:
            return self.clinic_response(
                error="Password is required.", message="Password is required.", status_code=status.HTTP_400_BAD_REQUEST
            )

        try:
            pk = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=pk)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return self.clinic_response(
                error="Invalid link.",
                message="The password reset link is invalid or expired.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return self.clinic_response(
                error="Invalid or expired token.",
                message="The password reset link is invalid or expired.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password)
        user.save()

        # Generate JWT tokens for auto-login
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return self.clinic_response(
            data={
                "access": access_token,
                "refresh": refresh_token,
                "message": "Password reset confirmed successfully.",
            },
            message="Password reset confirmed successfully.",
            status_code=status.HTTP_200_OK,
        )


class ObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            try:
                username = request.data.get("username") or request.data.get("email", "")

                user = User.objects.filter(username=username).first() or User.objects.filter(email=username).first()

                if user:
                    request.session.create()
                    request.user = user

                    user_logged_in.send(sender=user.__class__, request=request, user=user)

                    user.last_login = timezone.now()
                    user.save(update_fields=["last_login"])

                    self.send_login_notification(user, request)
            except Exception as e:
                print(f"Error sending login notification: {e}")

        return response

    def send_login_notification(self, user, request):
        """Send an email notification about the new login"""
        # Extract device and browser info
        user_agent = request.META.get("HTTP_USER_AGENT", "Unknown")
        device = "Mobile" if "Mobile" in user_agent else "Desktop"
        browser = self._get_browser_info(user_agent)

        # Get IP address and location
        ip_address = self._get_client_ip(request)
        location = self._get_location_from_ip(ip_address)

        # Prepare context for email template
        context = {
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "login_time": timezone.now().strftime("%Y-%m-%d %H:%M:%S %Z"),
            "device": device,
            "browser": browser,
            "location": location,
            "ip_address": ip_address,
            "security_url": f"{os.environ.get('FRONTEND_URL', 'https://lawstack.ai')}/dashboard/settings/security",
            "APP_NAME": APP_NAME,
        }

        # Send email notification
        subject = f"New Login to Your {APP_NAME} Account"
        html_content, plain_text_content = render_email_template("login_notification", context)

        email = EmailMultiAlternatives(
            subject, plain_text_content, settings.DEFAULT_FROM_EMAIL, [user.email], headers={"X-Use-Gmail": True}
        )
        email.attach_alternative(html_content, "text/html")
        send_email_async(email, fail_silently=True)

    def _get_browser_info(self, user_agent):
        """Extract browser information from user agent"""
        if "Chrome" in user_agent and "Edg" not in user_agent:
            return "Google Chrome"
        elif "Firefox" in user_agent:
            return "Mozilla Firefox"
        elif "Safari" in user_agent and "Chrome" not in user_agent:
            return "Safari"
        elif "Edg" in user_agent:
            return "Microsoft Edge"
        elif "MSIE" in user_agent or "Trident/" in user_agent:
            return "Internet Explorer"
        else:
            return "Unknown Browser"

    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR", "Unknown")
        return ip

    def _get_location_from_ip(self, ip_address):
        """Get approximate location from IP address"""
        try:
            import requests

            response = requests.get(f"https://ipapi.co/{ip_address}/json/")
            data = response.json()
            if response.status_code == 200:
                city = data.get("city", "Unknown city")
                region = data.get("region", "Unknown region")
                country = data.get("country_name", "Unknown country")
                return f"{city}, {region}, {country}"
            return "Unknown location"
        except Exception:
            return "Unknown location"


class RefreshTokenView(TokenRefreshView):
    permission_classes = (AllowAny,)


class LogoutView(APIView, ClinicView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return self.clinic_response(
                data={"message": "Logout successful"}, message="Logout successful", status_code=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return self.clinic_response(
                data={"message": "Bad request"}, message="Bad request", status_code=status.HTTP_400_BAD_REQUEST
            )
