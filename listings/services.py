from b2sdk.v2 import InMemoryAccountInfo, B2Api
from django.conf import settings
import os


def upload_to_backblaze(file, filename):
    # Initialize Backblaze B2 API
    info = InMemoryAccountInfo()
    b2_api = B2Api(info)

    # Authenticate
    application_key_id = os.environ.get('APPlICATION_KEY_ID')
    application_key = os.environ.get('APPLICATION_KEY')
    b2_api.authorize_account('production', application_key_id, application_key)

    # Get the bucket object
    bucket = b2_api.get_bucket_by_name(os.environ.get('BUCKET_NAME'))

    # Upload the file's content directly to Backblaze
    file_content = file.read()  # Read file into memory (binary)
    uploaded_file = bucket.upload_bytes(file_content, filename)

    # Construct the public file URL
    file_url = f"https://f003.backblazeb2.com/file/{os.environ.get('BUCKET_NAME')}/{filename}"

    return file_url
