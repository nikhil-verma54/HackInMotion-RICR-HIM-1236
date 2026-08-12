from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from .serializers import ResumeUploadSerializer
from .services.pdf_parser import (
    extract_pdf_text,
    extract_docx_text,
)


class UploadResumeView(GenericAPIView):
    serializer_class = ResumeUploadSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume = serializer.validated_data["resume"]
        file_name = resume.name.lower()

        try:
            if file_name.endswith(".pdf"):
                text = extract_pdf_text(resume)

            elif file_name.endswith(".docx"):
                text = extract_docx_text(resume)

            else:
                return Response(
                    {
                        "success": False,
                        "error": "Only PDF and DOCX files are supported.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not text:
                return Response(
                    {
                        "success": False,
                        "error": "Could not extract text from the resume.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {
                    "success": True,
                    "filename": resume.name,
                    "text": text,
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "success": False,
                    "error": "Unable to process the resume.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )