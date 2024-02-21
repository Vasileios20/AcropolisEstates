# Contents

* [Manual Testing](#manual-testing)
* [Bugs](#bugs)

## Manual Testing

| # | Endpoint | Method | Expected outcome | Pass/Fail |
| -- | --- | --- | --- | --- |
| | Listings | | | |
| 1 | /listings | GET | A list of all properties | ✅ |
| 2 | /listings | POST* | Create a new listing | ✅ |
| 3 | /listings/:id | GET | A listing with its details | ✅ |
| 4 | /listings/:id | PUT | Update listing's details | ✅ |
| 5 | /listings/:id | DELETE | Delete a listing | ✅ |
| 6 | /listings/:id/images/:id | DELETE | Delete a listing's image | ✅ |
| | Wishlist | | | |
| 7 | /wishlist | GET | A list of user's (owner) wishlist items | ✅ |
| 8 | /wishlist | POST | Add a listing to the user's wishlist | ✅ |
| 9 | /wishlist/:id | DELETE | Delete a listing from user's wishlist | ✅ |
| | Contact | | | |
| 10 | /contact | GET | A contact form | ✅ |
| 11 | /contact | POST | Create a new message | ✅ |
| 12 | /contact_list (Admin only) | GET | A list of all the messages | ✅ |
| 13 | /contact_list/:id (Admin only) | GET | The message selected | ✅ |
| | Profiles | | | |
| 14 | /profiles | GET | A list of all the profiles | ✅ |
| 15 | /profiles/:id | GET | Profile's details | ✅ |
| 16 | /profiles/:id | PUT | If owner update the profile | ✅ |
| 17 | /profiles/:id | DELETE | If owner delete the profile | ✅ |

*POST method for /listings has been tested with Postman as I had to upload multiple images.

[/listings POST](/documentation/testing/POST_listings.png)

## BUGS

BUG: Not displaying image size errors.

FIX: I had to adjust the ImagesSerializer from :

```python
def validate_image(self, value):

        if value.size > 1024 * 1024 * 2:

            raise serializers.ValidationError("Image too large")

        if value.images.width > 4096:

            raise serializers.ValidationError("Image dimensions too large")

        if value.images.height > 4096:

            raise serializers.ValidationError("Image dimensions too large")

        return value
```

to :

```python
def validate_images(self, value):

        for image in value:

            if image.size > 1024 * 1024 * 2:

                raise serializers.ValidationError("Image too large")

            width, height = get_image_dimensions(image)

            if width > 4096:

                raise serializers.ValidationError("Image width too large")

            if height > 4096:

                raise serializers.ValidationError("Image height too large")

        return value
```

___

BUG: When try to logout after refresh the page it would auto login with the last user

FIX: It was missing "/" at backend logout url (Thanks Jason from Code Institute tutor support that spotting the error and
explaining to me what was the hint (Response from API was from the default logout view, that is bugged))

```python
path("dj-rest-auth/logout/", logout_route),
```

___
