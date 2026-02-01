"""
ViewSets for listing file management.
Provides CRUD operations for listing files with proper
permissions and validation.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404

from listings.models import (
    ListingFile, ShortTermListingFile, Listing, ShortTermListing
)
from listings.file_serializers import (
    ListingFileSerializer,
    ShortTermListingFileSerializer
)
from re_drf_api.permissions import IsAdminUser


class BaseFileViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet for file management.
    Provides common functionality for both Listing and ShortTerm files.
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAdminUser]

    # To be overridden by subclasses
    file_model = None
    parent_model = None
    parent_lookup_field = 'listing_id'
    serializer_class = None

    def get_queryset(self):
        """Filter files by parent listing."""
        listing_id = self.kwargs.get(self.parent_lookup_field)
        if listing_id:
            return self.file_model.objects.filter(listing_id=listing_id)
        return self.file_model.objects.none()

    def get_parent_object(self):
        """Get the parent listing object."""
        listing_id = self.kwargs.get(self.parent_lookup_field)
        return get_object_or_404(self.parent_model, pk=listing_id)

    def perform_create(self, serializer):
        """
        Create file and associate with listing.
        Auto-set uploaded_by to current user.
        """
        listing = self.get_parent_object()
        serializer.save(
            listing=listing,
            uploaded_by=self.request.user
        )

    def list(self, request, *args, **kwargs):
        """
        List all files for a listing.
        GET /api/listings/{listing_id}/files/
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'files': serializer.data
        })

    def create(self, request, *args, **kwargs):
        """
        Upload a new file.
        POST /api/listings/{listing_id}/files/

        Required fields:
        - file: The file to upload
        - file_type: Type of document (e.g., 'offer', 'contract')

        Optional fields:
        - description: Notes about the file
        """
        listing = self.get_parent_object()

        # Create serializer with listing in context
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save(listing=listing, uploaded_by=request.user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def retrieve(self, request, *args, **kwargs):
        """
        Get details of a specific file.
        GET /api/listings/{listing_id}/files/{file_id}/
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Update file metadata (not the file itself).
        PUT/PATCH /api/listings/{listing_id}/files/{file_id}/

        Can update:
        - file_type
        - description

        Cannot update:
        - file (to replace file, delete and upload new)
        - listing
        - uploaded_by
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        """
        Delete a file.
        DELETE /api/listings/{listing_id}/files/{file_id}/
        """
        instance = self.get_object()

        # Delete the actual file from storage
        if instance.file:
            try:
                instance.file.delete(save=False)
            except Exception as e:
                # Log error but continue with deletion
                print(f"Error deleting file: {e}")

        # Delete the database record
        instance.delete()

        return Response(
            {'message': 'File deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=True, methods=['get'])
    def download(self, request, *args, **kwargs):
        """
        Download a file.
        GET /api/listings/{listing_id}/files/{file_id}/download/
        """
        instance = self.get_object()

        if not instance.file:
            raise Http404("File not found")

        try:
            # Open file and return as download
            file_handle = instance.file.open('rb')
            response = FileResponse(
                file_handle,
                content_type='application/octet-stream'
            )
            response['Content-Disposition'] = (
                f'attachment; filename="{instance.file_name}"'
            )
            return response
        except FileNotFoundError:
            raise Http404("File not found on server")


class ListingFileViewSet(BaseFileViewSet):
    """
    ViewSet for managing files associated with regular listings.

    Endpoints:
    - GET    /api/listings/{listing_id}/files/           - List all files
    - POST   /api/listings/{listing_id}/files/           - Upload new file
    - GET    /api/listings/{listing_id}/files/{id}/      - Get file details
    - PUT    /api/listings/{listing_id}/files/{id}/      - Update file metadata
    - PATCH  /api/listings/{listing_id}/files/{id}/      - Partial update
    - DELETE /api/listings/{listing_id}/files/{id}/      - Delete file
    - GET    /api/listings/{listing_id}/files/{id}/download/ - Download file
    """
    queryset = ListingFile.objects.all()
    serializer_class = ListingFileSerializer
    file_model = ListingFile
    parent_model = Listing
    parent_lookup_field = 'listing_id'


class ShortTermListingFileViewSet(BaseFileViewSet):
    """
    ViewSet for managing files associated with short-term listings.

    Endpoints:
    - GET    /api/short-term-listings/{listing_id}/files/
             List all files
    - POST   /api/short-term-listings/{listing_id}/files/
             Upload new file
    - GET    /api/short-term-listings/{listing_id}/files/{id}/
             Get file details
    - PUT    /api/short-term-listings/{listing_id}/files/{id}/
             Update file metadata
    - PATCH  /api/short-term-listings/{listing_id}/files/{id}/
             Partial update
    - DELETE /api/short-term-listings/{listing_id}/files/{id}/
             Delete file
    - GET    /api/short-term-listings/{listing_id}/files/{id}/download/
             Download file
    """
    queryset = ShortTermListingFile.objects.all()
    serializer_class = ShortTermListingFileSerializer
    file_model = ShortTermListingFile
    parent_model = ShortTermListing
    parent_lookup_field = 'listing_id'
