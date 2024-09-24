# Contents

* [PEP8](#pep8)
* [Manual Testing](#manual-testing)
* [Bugs](#bugs)

## PEP8

During developement I had enabled the autopep8 extension to format the files on save.
I also had enabled the Flake8 linter and I had no errors or warnings.

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

* [CSS](#css)
* [ESlint](#eslint)
* [Lighthouse](#lighthouse)
* [User Stories](#user-stories)
* [Manual Testing](#manual-testing)
* [Bugs](#bugs)

## CSS

All files has been checked and gave no errors.

![CSS](/documentation/CSS_validation.png)

## ESlint

[ESlint](https://eslint.org/) - Has been used during developement and had no errors.

![ESlint](/documentation/Eslint.png)

In the ContactForm.js and in the useEffect hook dependencies array I had to disable-next-line. If contactData is included in the dependency array,
the useEffect hook will run indefinitely, so I had to remove it.

```javascript
 useEffect(() => {
    if (currentUser) {
      // If the current user exists, fetch the user profile data.
      const fetchProfileData = async () => {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          // Set the contactData state with the user's name and email address.
          setContactData({
            ...contactData,
            name: currentUser.username,
            email: data.email_address,
          });
        } catch (err) {
          // console.log(err);
        }
      };
      fetchProfileData();
    }
    // if contactData is included in the dependency array,
    // the useEffect hook will run indefinitely
    // eslint-disable-next-line
  }, [id, history]);

```

## Lighthouse

![Lighthouse](/documentation/Lighthouse.png)

Lighthouse testing has been performed on all pages. No significants dropdowns other than the listings page
performance that contain large images (user's uploads).

## User Stories

|User story||PASS|
|--|--|--|
|As a registered user I can sign in using my username and password so that I can access my account.| | :heavy_check_mark: |
|As a user I can create a new account so that I can access all the features for signed up users| | :heavy_check_mark: |
|As a user I can add properties to my wishlist by clicking a button on the property details page so that I can keep track of properties I'm interested in.| | :heavy_check_mark: |
|As an admin I can upload new property listings, including details such as property type, address, postcode, city, pricing, surface, levels, bedrooms, floor, kitchens, bathrooms, living rooms, heating system, energy class, construction year, availability so that the website has up-to-date and accurate listings| | :heavy_check_mark: |
|As an admin I can edit existing property listings so that I can update property's details| | :heavy_check_mark: |
|As an admin I can delete property listings so that the website has up-to-date and accurate listings| | :heavy_check_mark: |
|As a user I can search for properties using a search bar so that I can find properties I'm interested in| | :heavy_check_mark: |
|As a user I can apply filters for rent or sale so that I can get a list of properties that I'm interested in| | :heavy_check_mark: |
|As a user I can filter properties based on location parameters such as address, postcode or city so that I can get a more accurate list of properties that I'm interested in| | :heavy_check_mark: |
|As a user I can set a price range for my property search so that I can get a more accurate list of properties that I'm interested in| | :heavy_check_mark: |
|As a user I can specify a surface range for my property search so that I can get a more accurate list of properties that I'm interested in| | :heavy_check_mark: |
|As a user I can send a message to the website admin using a contact form so that I can ask enquiries I have| | :heavy_check_mark: |
|As an admin I can view all user messages in a page so that I can have a list with all the messages| | :heavy_check_mark: |
|AAs an admin I can filter user messages so that I can get a list with messages that meet specific criteria, facilitating efficient organization and targeted response|| :heavy_check_mark: |
|As I user I can navigate to a page so that I can I see a list of all the properties| | :heavy_check_mark: |
|As a user I can keep scrolling through the properties list on the site, that are loaded for me automatically so that I don't have to click on "next page"| | :heavy_check_mark: |
|As a logged in user I can edit my profile so that I can change my details| | :heavy_check_mark: |
|As a logged in user I can update my username so that I can change my display name| | :heavy_check_mark: |
|As a logged in user I can update my password so that I can change keep my profile secure| | :heavy_check_mark: |
|As a user I can view a navbar from every page so that I can navigate easily between pages| | :heavy_check_mark: |
|As a user I can navigate through pages quickly so that I can view content seamlessly without page refresh| | :heavy_check_mark: |
|As a user I can tell if I am logged in or not so that I can log in if I need to| | :heavy_check_mark: |
|As a logged out user I can see sign in and sign up options so that I can sign in/sign up| | :heavy_check_mark: |

## Manual Testing

| # | Feature | Expected Outcome | Testing Performed | Pass/Fail |
| :---: | :--- | :---: | :---: | :---: |
| | Navbar (All users) | | | |
| 1 | Navbar - Home | Redirect to home page | click button | ✅ |
| 2 | Navbar - About | redirect to about page | click button | ✅ |
| 3 | Navbar - Contact | Redirect to contact form page | click button | ✅ |
| 4 | Navbar - Listings | Redirect to listings page | click button | ✅ |
| | Navbar (Logged out user) | | | |
| 5 | Navbar - Sign in | Redirect to sign in page | click button | ✅ |
| 6 | Navbar - Sign up | Redirect to sign up page | click button | ✅ |
| | Navbar (Logged in user) | | | |
| 7 | Navbar - Wishlist | Redirect to wishlist page | click button | ✅ |
| 8 | Navbar - Avatar/username | redirect to profile page | click button | ✅ |
| 9 | Navbar - Sign out | Sign out and redirect to home page | click button | ✅ |
| | Navbar (Staff member) | | | |
| 10 | Navbar - Add listing | redirect to create listing from page | click button | ✅ |
| 11 | Navbar - Messages | redirect to messages(contact_list) page | click button | ✅ |
| | Sign up Page | | | |
| 12 | All fields filled correctly | Create account and redirect to sign in page | click Sign up button | ✅ |
| 13 | Leave blank username field | Display error: This field may not be blank. | click Sign up button | ✅ |
| 14 | Leave blank password field | Display error: This field may not be blank. | click Sign up button | ✅ |
| 15 | Leave empty confirm password field | Display error: This field may not be blank. | click Sign up button | ✅ |
| 16 | Set different confirm password | Display error: The two password fields didn't match. | click Sign up button | ✅ |
| 17 | Give username that already exists | Display error: A user with that username already exists. | click Sign up button | ✅ |
| | Sign in Page | | | |
| 18 | All fields filled | Sign in and redirect to previous page | click Sign in button | ✅ |
| 19 | Leave blank username field | Display error: Must include ""username"" and ""password"". | click Sign in button | ✅ |
| 20 | Leave blank password field | Display error: This field may not be blank. | click Sign in button | ✅ |
| 21 | Try username with first letter capital/ all letters capital | Display error: Unable to log in with provided credentials. | click Sign in button | ✅ |
| | Listings Page | | | |
| 22 | Infinite scroll | Scroll down and populate more listings | Scrolled down | ✅ |
| 23 | Click on image | Redirect to listing page | click on image | ✅ |
| 24 | Click on listing details | Redirect to listing page | click on details | ✅ |
| | Listing Page | | | |
| 25 | Display all images in modal | Display all images in modal | click on an image | ✅ |
| | Listing Page (logged out) | | | |
| 26 | Add to list button | Redirect to sign in page | click button | ✅ |
| | Listing Page (logged in) | | | |
| 27 | Add to wishlist button | Add listing to wishlist, display message: Added to wishlist | click button | ✅ |
| 28 | Remove from wishlist button | Remove listing from wishlist, display message: Removed from wishlist | click button | ✅ |
| | Listing Page (logged in staff member) | | | |
| 29 | Display owner, created at, updated at, carret down(dropdown menu) | Display owner, created at, updated at | sign in as admin, navigate to listing page | ✅ |
| 30 | Display dropdown menu | Display edit and delete icons | click caret down button | ✅ |
| 31 | Dropdown menu edit icon | Redirect to edit listing page | click edit icon | ✅ |
| 32 | Dropdown menu delete icon | Delete listing, redirect to listings page | click delete icon | ✅ |
| | Contact Form | | | |
| 33 | Contact form success | Display success message, redirect to home page | complete all fields and send | ✅ |
| 34 | Input field empty | Display error message | name left blank | ✅ |
| 35 | Input field empty | Display error message | email left blank | ✅ |
| 36 | Input field empty | Display error message | subject left blank | ✅ |
| 37 | Input field empty | Display error message | message left blank | ✅ |
| | Contact Form (logged in user) | | | |
| 38 | name field | placeholder logged in user's username | navigated as logged in user to contact form | ✅ |
| 39 | email field | placeholder logged in user's email | navigated as logged in user to contact form | ✅ |
| | Messages (staff member only) | | | |
| 40 | Infinite scroll | Scroll down and populate more listings | Scrolled down | ✅ |
| | Messages Page (search bar) | | | |
| 41 | name, email subject search field | Display messages that contain query | typed keyword that exists in more than on message (name, email, subject), press send | ✅ |
| 42 | date from | Display messages for a specific day | chose a date that received messages, press send | ✅ |
| 43 | date from - date to | Display messages for the range specified | chose date from and date to, press send | ✅ |
| 44 | click on a message sender | Redirect to ContactMessage page and display the message with all the details | click on a message sender | ✅ |
| 45 | click on a message email | Redirect to ContactMessage page and display the message with all the details | click on a message email | ✅ |
| 46 | click on a message subject | Redirect to ContactMessage page and display the message with all the details | click on a message subject | ✅ |
| 47 | click on a message message | Redirect to ContactMessage page and display the message with all the details | click on a message message | ✅ |
| 48 | click on a message date | Redirect to ContactMessage page and display the message with all the details | click on a message date | ✅ |
| | ContactMessage Page | | | |
| 49 | Display message with all the details | Display message with all the details | Navigate to ContactMessage Page by clicking on a message from Messages page | ✅ |
| | Add listing | | | |
| 50 | Form success | Create listing and redirect to listing's page | complete all fields and press create | ✅ |
| 51 | Field sale type select | Select options for Rent or Sale | click on sale type field | ✅ |
| 52 | Field Property type select | Select options for Apartment, House, Land or Commercial | click on property type field | ✅ |
| 53 | Field Construction year select | Select options from 1900 to current year | click on construction year field | ✅ |
| 54 | Field Energy class select | Select options from A to G | click on energy class field | ✅ |
| 55 | Field Availability | Display calendar to choose date | click on availability field | ✅ |
| | Add listing (Form errors)* | | | |
| 56 | Blank any field | Display error message: This field may not be blank. | Left blank one of each fields and press create | ✅ |
| 57 | Availability field | Display error: | Left blank availability field and press create | ✅ |
| 58 | ** Fields Address number, price, surface, levels, bedrooms, floor, kitchens, bathrooms and living rooms are number only fields | Display error message: a valid integer is required | Left blank one of each fields and press create | ✅ |
| 59 | ** Fields Address number, price, surface, levels, bedrooms, floor, kitchens, bathrooms and living rooms are number only fields | Display error message: This field must be a positive number | Typed negative value on one of each fields and press create | ✅ |
| | Edit listing | | | |
| 61 | Existing images checkbox | Delete selected image | Checked an image and click delete button | ✅ |
| 62 | Submit button | Button text: Update | Navigate to the edit listing page | ✅ |
| 63 | * The rest of the fields same as Add listing | | | ✅ |
| | SearchBar | | | |
| 64 | Options rent/buy | When select any of the two redirect to Listings page and display matching listings | Selected rent, click Search | ✅ |
| 65 | Options rent/buy | | Selected buy, click Search | ✅ |
| 66 | Options rent/buy error | If none selected and click search display error message | None selected, clicked Search | ✅ |
| 67 | Query field (City, postcode, address) | Display listings that contain query | Typed a query that exists | ✅ |
| 68 | Type select options (Apartment, House, Land, Commercial) | When select any of the options display matching listings | Selected apartment click Search | ✅ |
| 69 | Type select options (Apartment, House, Land, Commercial) | When select any of the options display matching listings | Selected house click Search | ✅ |
| 70 | Type select options (Apartment, House, Land, Commercial) | When select any of the options display matching listings | Selected land click Search | ✅ |
| 71 | Type select options (Apartment, House, Land, Commercial) | When select any of the options display matching listings | Selected commercial click Search | ✅ |
| 72 | Type select options (Apartment, House, Land, Commercial) | When select Land, Floor Area label to display ""Land Area"" | Selected land | ✅ |
| 73 | Price Range | Display listings in the price range selected | Typed min price and max price, click search | ✅ |
| 74 | Price (min price) | Display listings with price typed and above | Typed min price, click search | ✅ |
| 75 | Price (max price) | Display listings with price typed and bellow | Typed max price, click search | ✅ |
| 76 | Floor area Range | Display listings in the floor area range selected | Typed min floor area and max floor area, click search | ✅ |
| 77 | Floor area (min price) | Display listings with floor area typed and above | Typed min floor area, click search | ✅ |
| 78 | Floor area (max price) | Display listings with floor area typed and bellow | Typed max floor area, click search | ✅ |
| 79 | Search button text after first search | Search button text to be ""Update"" | Select an option rent/buy, click Search | ✅ |
| 80 | SearchBar fields state | Fields to be updated with last search state | Typed a query, click Search | ✅ |
| 81 | SearchBar fields state | Fields to be updated with last search state | Selected Type, click Search | ✅ |
| 82 | SearchBar fields state | Fields to be updated with last search state | Typed a min price, click Search | ✅ |
| 83 | SearchBar fields state | Fields to be updated with last search state | Typed a max price, click Search | ✅ |
| 84 | SearchBar fields state | Fields to be updated with last search state | Typed a min floor area, click Search | ✅ |
| 85 | SearchBar fields state | Fields to be updated with last search state | Typed max floor area, click Search | ✅ |
| | Profile Page | | | |
| 86 | Dropdown menu | If owner, display the dropdown menu(Carret down) | Log in and navigate to profile page | ✅ |
| 87 | Dropdown menu | If not owner, do not display the dropdown menu(Carret down) | Log in and navigate to different user's profile page | ✅ |
| 88 | Display dropdown menu | Display edit profile, change username and change password links | click caret down button | ✅ |
| 89 | Dropdown menu edit profile | Redirect to edit profile page | clickedit profile link | ✅ |
| 90 | Dropdown menu change username | Redirect to change username page | click change username link | ✅ |
| 91 | Dropdown menu change password | Redirect to change password page | click change password link | ✅ |
| | Profile Edit | | | |
| 92 | Form save | Update details | Edit fields, click save | ✅ |
| 93 | cancel button | Redirect to Profile Page | click cancel | ✅ |
| 94 | Phone field error | Display error | Entered wrong format | ✅ |
| | Change username | | | |
| 95 | username field | Update username | | ✅ |
| 96 | cancel button | Redirect to Profile Page | click cancel | ✅ |
| | Change password | | | |
| 97 | Blank field | Display error message: This field may not be blank. | Left blank one of each fields and press create | ✅ |
| 98 | Different passwords | Display error message: The two password fields didn’t match. | Enter different passwords | ✅ |
| 99 | Password length error | Display error message: The two password is too short. | Enter short password | ✅ |
| 100 | cancel button | Redirect to Profile Page | click cancel | ✅ |
| | Footer | | | |
| 101 | About us | Redirect to about us page | Click link | ✅ |
| 102 | Contact us | Redirect to about us page | Click link | ✅ |
| 103 | Listings | Redirect to about us page | Click link | ✅ |
| 104 | Github icon | Open in new window | Click icon | ✅ |
| 105 | Linkedin icon | Open in new window | Click icon | ✅ |
| | Restricted Pages 403 | | | |
| 106 | Non staff member can't access the Add Listing | Display 403 page | Navigated to Add Listing url as logged out user | ✅ |
| 107 | Non staff member can't access the Add Listing | Display 403 page | Navigated to Add Listing url as logged in user | ✅ |
| 108 | Non staff member can't access the Add Listing | Display Add Listing Page | Navigated to Add Listing url as admin user | ✅ |
| 109 | Non staff member can't access the Edit Listing | Display 403 page | Navigated to Edit Listing url as logged out user | ✅ |
| 110 | Non staff member can't access the Edit Listing | Display 403 page | Navigated to Edit Listing url as logged in user | ✅ |
| 111 | Non staff member can't access the Edit Listing | Display Edit Listing Page | Navigated to Edit Listing url as admin user | ✅ |
| 112 | Non staff member can't access the Messages | Display 403 page | Navigated to Messages Listing(contact_list) url as logged out user | ✅ |
| 113 | Non staff member can't access the Messages | Display 403 page | Navigated to Messages(contact_list) url as logged in user | ✅ |
| 114 | Non staff member can't access the Messages | Display Add Listing Page | Navigated to Messages(contact_list) url as admin user | ✅ |
| | Not found 404 | | | |
| 115 | 404 not found page | Load 404 if Listing id doesn't exist | Navigated to a listing and change the url on the browser, ie. listings/1234567 | ✅ |
| 116 | 404 not found page | Load 404 page | Tried various urls that don't exist | ✅ |

## Bugs

### Solved Bugs

BUG: When press add to list button and then remove from list, The button wouldn't change state.

FIX: I had to add in the useEffect array the addedToList variable to be able to change the boolean/statement to True|

___

BUG: When edit form get the following warning in the console : ProfileEditForm.js:46 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function at ProfileEditForm

Fix: After chatting with student support we realise that the call to setProfileData was causing the issue, as it's being called after the component unmounts,  the solution was to create a ref :

 ```javascript
 const profileDataSet = useRef(false)
 ```

and update my useEffect hook with an if statement:

```javascript
if (!profileDataSet.current) {`
            `setProfileData({`
              `first_name,`
              `last_name,`
              `email_address,`
              `image,`
              `phone,`
            `});`
            `profileDataSet.current = true;`
          `}`
```

___
BUG: After updating a listing and redirecting to `history.push(/listings/${data.id});` the old images would be rendered.

FIX:

```javascript
window.localstorage.setItem("edited", true);` in `handleSubmit()` to ListingEditForm.js
```

and  then in ListingsPage.js add

```javascript
if (window.localStorage.getItem("edited") === "true") { window.location.reload(); localStorage.removeItem("edited");}
```

___
BUG: It wouldn't get the refresh token, when refresh page would sign out.

FIX: I had to add the missing "defaults" at axiosDefaults.js for

```javascript
axios.defaults.withCredentials = true
```

___
BUG: Upload multiple images

FIX: I had to add had to set Array.from to formdata

```javascript
Array.from(imageInput.current.files).forEach((file) => {
      formData.append("uploaded_images", file);
    });
```

___
BUG: I couldn't deploy the project to Heroku

FIX: Had to set

```javascript
"engines": {

    "node": "16.20.2"

  } 
```

to package.json to be able to deploy the app

BUG: When adding or removing listings to the wishlist and navigate within 3 seconds to Wishlist it would raise the following warning:

```text
Listing.js:123 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    at Listing (https://re-real-estate-ecc213881132.herokuapp.com/static/js/main.chunk.js:8125:5)
    at ListingPage (https://re-real-estate-ecc213881132.herokuapp.com/static/js/main.chunk.js:9934:73)
```

FIX: I added to the useFetchWishlist hook to check if component is mounted and then perform any state update. Solution found at [stackoverflow](https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component)
