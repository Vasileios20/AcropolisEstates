from datetime import datetime
import uuid


def generate_unique_filename(folder, listing_id, idx):
    """
    Generate a unique filename for an image.
    Combines listing ID, index, timestamp, and a UUID to ensure uniqueness.
    """
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex[:8]
    return f"{folder}/{listing_id}/image_{idx + 1}_{timestamp}_{unique_id}.jpg"
