import re
import uuid
import boto3
from botocore.config import Config
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from app.utils import ClinicView

class UploadView(APIView, ClinicView):
    """
    API View to handle secure, authenticated file uploads directly to Cloudflare R2.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return self.clinic_response(
                error={"file": ["No file was provided."]},
                message="File upload failed",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        category = request.data.get("category", "general")
        # Validate category names to avoid path injection
        if not re.match(r"^[a-zA-Z0-9_-]+$", category):
            category = "general"

        entity_id = request.data.get("id")
        if not entity_id or not re.match(r"^[a-zA-Z0-9_-]+$", entity_id):
            entity_id = str(uuid.uuid4())

        # Sanitize filename and validate extension
        filename = file_obj.name
        safe_name = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
        ext = safe_name.split('.')[-1].lower() if '.' in safe_name else ''

        if ext not in ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg']:
            return self.clinic_response(
                error={"file": ["Invalid file type. Only png, jpg, jpeg, webp, gif, and svg are allowed."]},
                message="File type not allowed",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Build clean key
        key = f"{category}/{entity_id}/{uuid.uuid4()}.{ext}"

        # Initialize boto3 S3 client for Cloudflare R2
        try:
            s3_client = boto3.client(
                "s3",
                endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                config=Config(signature_version="s3v4"),
                region_name="auto",
            )

            # Upload the file object
            s3_client.upload_fileobj(
                file_obj,
                Bucket=settings.R2_BUCKET_NAME,
                Key=key,
                ExtraArgs={"ContentType": file_obj.content_type}
            )

        except Exception as e:
            return self.clinic_response(
                error={"detail": str(e)},
                message="Failed to upload file to Cloudflare R2",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        url = f"{settings.R2_PUBLIC_URL_BASE}/{key}"
        return self.clinic_response(
            data={"url": url},
            message="File uploaded successfully",
            status_code=status.HTTP_201_CREATED
        )
