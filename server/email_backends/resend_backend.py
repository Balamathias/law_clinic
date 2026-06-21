import logging
import os

import requests
from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend

logger = logging.getLogger(__name__)


class ResendEmailBackend(BaseEmailBackend):
    """
    Custom Django Email Backend for Resend.com API.
    In local development (settings.DEBUG = True), if RESEND_API_KEY is not configured,
    it automatically falls back to printing the emails to the console.
    """

    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(fail_silently=fail_silently, **kwargs)
        self.api_key = getattr(settings, "RESEND_API_KEY", None) or os.getenv("RESEND_API_KEY")
        if not self.api_key:
            self.api_key = None
        self.api_url = "https://api.resend.com/emails"

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        # Fallback to console backend in debug mode if API key is not configured
        if not self.api_key:
            if settings.DEBUG:
                logger.info(
                    "RESEND_API_KEY is not configured. Falling back to console email backend for local testing."
                )
                from django.core.mail.backends.console import EmailBackend as ConsoleEmailBackend

                console_backend = ConsoleEmailBackend(fail_silently=self.fail_silently)
                return console_backend.send_messages(email_messages)
            else:
                message = "RESEND_API_KEY is missing, and DEBUG is False. Cannot send emails via Resend."
                logger.error(message)
                if not self.fail_silently:
                    raise ValueError(message)
                return 0

        sent_count = 0
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}

        for message in email_messages:
            from_email = message.from_email or getattr(settings, "DEFAULT_FROM_EMAIL", "LawStack <noreply@lawstack.me>")

            # Extract HTML body from alternatives if it exists
            html_content = None
            for content, mimetype in getattr(message, "alternatives", []):
                if mimetype == "text/html":
                    html_content = content
                    break

            payload = {
                "from": from_email,
                "to": message.to,
                "subject": message.subject,
                "text": message.body,
            }

            if html_content:
                payload["html"] = html_content
            if message.cc:
                payload["cc"] = message.cc
            if message.bcc:
                payload["bcc"] = message.bcc
            if message.reply_to:
                payload["reply_to"] = message.reply_to

            try:
                response = requests.post(self.api_url, json=payload, headers=headers, timeout=10)
                if response.status_code in [200, 201]:
                    sent_count += 1
                else:
                    error_msg = f"Resend API error ({response.status_code}): {response.text}"
                    logger.error(error_msg)
                    if not self.fail_silently:
                        raise Exception(error_msg)
            except Exception as e:
                logger.error(f"Failed to send email through Resend: {str(e)}")
                if not self.fail_silently:
                    raise e

        return sent_count
