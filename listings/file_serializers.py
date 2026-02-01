"""
Serializers for listing file management.
Handles file upload, validation, and metadata serialization.
"""
from rest_framework import serializers
from listings.models import ListingFile, ShortTermListingFile


# Allowed file extensions for listing documents
ALLOWED_FILE_EXTENSIONS = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx',
    'jpg', 'jpeg', 'png', 'gif',
    'txt', 'csv',
    'zip', 'rar',
]

# Max file size: 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024


def validate_file_size(file):
    """Validate that file size doesn't exceed maximum."""
    if file.size > MAX_FILE_SIZE:
        raise serializers.ValidationError(
            f"File size cannot exceed {MAX_FILE_SIZE / (1024 * 1024):.0f}MB"
        )
    return file


class ListingFileSerializer(serializers.ModelSerializer):
    """
    Serializer for ListingFile model.
    Handles file upload with validation and metadata.
    """
    uploaded_by_username = serializers.ReadOnlyField(
        source='uploaded_by.username'
    )
    file_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    file_type_display = serializers.CharField(
        source='get_file_type_display',
        read_only=True
    )

    class Meta:
        model = ListingFile
        fields = [
            'id',
            'listing',
            'file',
            'file_name',
            'file_type',
            'file_type_display',
            'description',
            'uploaded_by',
            'uploaded_by_username',
            'uploaded_at',
            'file_url',
            'file_size',
        ]
        read_only_fields = ['uploaded_by', 'uploaded_at', 'file_name']

    def get_file_url(self, obj):
        """Get the file URL."""
        if obj.file:
            return obj.file.url
        return None

    def get_file_size(self, obj):
        """Get file size in bytes."""
        if obj.file:
            try:
                return obj.file.size
            except (OSError, FileNotFoundError):
                return None
        return None

    def validate_file(self, file):
        """Validate file size and extension."""
        # Validate size
        validate_file_size(file)

        # Validate extension
        file_extension = file.name.split('.')[-1].lower()
        if file_extension not in ALLOWED_FILE_EXTENSIONS:
            raise serializers.ValidationError(
                f"File type '.{file_extension}' is not allowed. "
                f"Allowed types: {', '.join(ALLOWED_FILE_EXTENSIONS)}"
            )

        return file

    def create(self, validated_data):
        """Create ListingFile and set uploaded_by from request user."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


class ShortTermListingFileSerializer(serializers.ModelSerializer):
    """
    Serializer for ShortTermListingFile model.
    Handles file upload with validation and metadata.
    """
    uploaded_by_username = serializers.ReadOnlyField(
        source='uploaded_by.username'
    )
    file_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    file_type_display = serializers.CharField(
        source='get_file_type_display',
        read_only=True
    )

    class Meta:
        model = ShortTermListingFile
        fields = [
            'id',
            'listing',
            'file',
            'file_name',
            'file_type',
            'file_type_display',
            'description',
            'uploaded_by',
            'uploaded_by_username',
            'uploaded_at',
            'file_url',
            'file_size',
        ]
        read_only_fields = ['uploaded_by', 'uploaded_at', 'file_name']

    def get_file_url(self, obj):
        """Get the file URL."""
        if obj.file:
            return obj.file.url
        return None

    def get_file_size(self, obj):
        """Get file size in bytes."""
        if obj.file:
            try:
                return obj.file.size
            except (OSError, FileNotFoundError):
                return None
        return None

    def validate_file(self, file):
        """Validate file size and extension."""
        # Validate size
        validate_file_size(file)

        # Validate extension
        file_extension = file.name.split('.')[-1].lower()
        if file_extension not in ALLOWED_FILE_EXTENSIONS:
            raise serializers.ValidationError(
                f"File type '.{file_extension}' is not allowed. "
                f"Allowed types: {', '.join(ALLOWED_FILE_EXTENSIONS)}"
            )

        return file

    def create(self, validated_data):
        """
        Create ShortTermListingFile and set uploaded_by from request user.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


class ListingFileListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing files in list views.
    Excludes heavy fields like file content.
    """
    file_type_display = serializers.CharField(
        source='get_file_type_display',
        read_only=True
    )
    uploaded_by_username = serializers.ReadOnlyField(
        source='uploaded_by.username'
    )

    class Meta:
        model = ListingFile
        fields = [
            'id',
            'file_name',
            'file_type',
            'file_type_display',
            'description',
            'uploaded_by_username',
            'uploaded_at',
        ]


class ShortTermListingFileListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for short-term listing files in list views.
    Excludes heavy fields like file content.
    """
    file_type_display = serializers.CharField(
        source='get_file_type_display',
        read_only=True
    )
    uploaded_by_username = serializers.ReadOnlyField(
        source='uploaded_by.username'
    )

    class Meta:
        model = ShortTermListingFile
        fields = [
            'id',
            'file_name',
            'file_type',
            'file_type_display',
            'description',
            'uploaded_by_username',
            'uploaded_at',
        ]
