# Acropolis Estate

Acropolis Estates represents the culmination of my efforts during the final project for Code Institute, now live as a website after combining two repositories into one. Acropolis Estates Ltd has acquired the project, and it serves as a dynamic platform designed for further development and potential client adoption. Focused on real estate, the site empowers users to effortlessly search for their next home, office space, or the ideal plot of land for construction. Currently, property uploads, updates, and deletions are restricted to administrators, ensuring quality control as per the client's request for a simpler version without user signup. As the project evolves, Acropolis Estates aims to provide an enriched and intuitive platform for users to explore and engage with the real estate market.

Deployed Heroku: [Acropolis Estates Heroku](https://acropolis-estates-125129ef2077.herokuapp.com/)

Custom domain: [Acropolis Estates](https://www.acropolisestates.com/)

Github [Repository](https://github.com/Vasileios20/AcropolisEstates)

![GitHub contributors](https://img.shields.io/badge/CONTRIBUTORS-1-<RED>)

## Contents

* [Database Diagram](#database-diagram)
* [Design](#design)
  * [Colour Scheme](#colour-scheme)
  * [Typography](#typography)
  * [Wireframes](#wireframes)
* [User Experience (UX)](#user-experience-ux)
  * [Site Purpose](#site-purpose)
  * [Site Goal](#site-goal)
  * [Audience](#audience)
  * [Communication](#communication)
  * [Current User Goals](#current-user-goals)
  * [New User Goals](#new-user-goals)
  * [Future Goals](#future-goals)
* [User Stories](#user-stories)
* [Features](#features)
  * [Navigation Bar](#navigation-bar)
    * [Navigation Bar (Admin)](#navigation-bar-admin-user)
  * [Footer](#footer)
  * [Home Page](#home-page)
  * [About Page](#about-page)
  * [Services Pages](#services-pages)
  * [Contact us Page](#contact-page)
  * [Listings Page](#listings-page)
  * [Listing Page](#listing-page)
    * [Images modal](#images-modal)
  * [Add Listing Page](#add-listing-page)
  * [Edit Listing Page](#edit-listing-page)
  * [Messages Page](#messages-page)
    * [Message Page](#message-page)
  * [Sign in Page](#sign-in-page)
  * [Signup Page](#sign-up-page)
  * [Profile Page](#profile-page)
    * [Edit Profile](#edit-profile-page)
    * [Change username](#change-username-page)
    * [Change password](#change-password-page)
  * [403 error Page](#403-error-page)
  * [404 error Page](#404-error-page)
* [Reusable Components](#reusable-components)
* [Technologies Used](#technologies-used)
  * [Languages Used](#languages-used)
  * [Frameworks, Libraries & Programs Used](#frameworks-libraries--programs-used)
* [Testing](#testing)

### User Stories

I have created tasks and included links to the [GitHub Issues](https://github.com/Vasileios20/drf-real-estate/issues) for this project, as well as the [KANBAN board](https://github.com/users/Vasileios20/projects/6).

## Database Diagram

[Database Diagram](/documentation/real_est.png)

## Design

### Colour Scheme

![Colour pallete](/documentation/AcropolisEstates.png)

Colors chosen by client.

### Typography

The font [Montserrat](https://fonts.google.com/specimen/Montserrat)
has been chose be chosen, because of its clean and modern appearance,
its readability and it's a web friendly font.

### Wireframes

#### Desktop

[Home Page](/documentation/wireframes/Home_Page.png)

[About Page](/documentation/wireframes/About_Page.png)

[Contact page](/documentation/wireframes/Contact_Form.png)

[Add Listing](/documentation/wireframes/Listing_Add.png)

[Edit Listing](/documentation/wireframes/Listing_Edit.png)

[Listing Page Content](/documentation/wireframes/Listing_Page_Content.png)

[Listing Page Images](/documentation/wireframes/Listing_Page_Images.png/)

[Listings](/documentation/wireframes/Listing_results_Page.png/)

[Wishlist](/documentation/wireframes/Wishlist_Page.png)

[Messages Page](/documentation/wireframes/Messages.png)

[Message Page](/documentation/wireframes/Message.png)

[Sign in](/documentation/wireframes/Sign_in.png)

[Signup](/documentation/wireframes/Sign_Up.png)

#### Mobile

[Home Page](/documentation/wireframes/Mobile_Home.png)

[About Page](/documentation/wireframes/Mobile%20_About.png)

[Contact page](/documentation/wireframes/Mobile_Contact.png)

[Add Listing](/documentation/wireframes/Mobile_Listing_Add.png)

[Edit Listing](/documentation/wireframes/Mobile_Listing_Edit.png)

[Listing Page Content](/documentation/wireframes/Mobile_Listing_Page.png)

[Listings](/documentation/wireframes/Mobile_Listings.png)

[Wishlist](/documentation/wireframes/Mobile_Wishlist.png)

[Messages Page](/documentation/wireframes/Mobile_Messages.png)

[Sign in](/documentation/wireframes/Mobile_Sign_in.png)

[Sign up](/documentation/wireframes/Mobile_Sign_up.png)

## User Experience (UX)

### Site Purpose

The primary purpose of Acropolis Estates is to provide a comprehensive and user-friendly online platform for individuals seeking real estate opportunities. Whether users are looking for a new residence, office space, or land for development, the site aims to facilitate a seamless and efficient search experience.

### Site Goal

Acropolis Estates strives to become a go-to destination for real estate exploration, connecting users with their ideal properties. The overarching goal is to establish a reliable and engaging platform that not only meets current user needs but also anticipates and adapts to evolving real estate trends.

### Audience

The target audience for Acropolis Estates includes individuals in search of residential properties, commercial spaces, and land for development.

### Communication

The site communicates property listings, features, and functionalities clearly and concisely to users. Through an intuitive interface, Acropolis Estates aims to convey information effectively, ensuring a positive and informative user experience. Regular updates and notifications contribute to ongoing communication with users.

### Current User Goals

Existing users on Acropolis Estates aspire to efficiently search and find properties that align with their needs. Clear communication channels, such as the contact form, facilitate inquiries and engagement.

### New User Goals

New users are expected to explore the site with ease, understanding its features and functionalities. Their primary goals include discovering available properties and initiating communication through the contact form. A seamless onboarding process is crucial to ensure positive initial interactions.

### Future Goals

Acropolis Estates's future goals include expanding its user base by potentially allowing agents to register and contribute property listings. The site aims to enhance its functionality to accommodate a broader range of real estate needs and evolving market demands. Continued improvements in user experience and feature development are key aspects of the platform's ongoing evolution.

## Features

* [Favicon](/documentation/features/favicon.png)

All pages on the site are responsive and have :

* ### Navigation Bar

Site user [navbar](/documentation/features/Navbar.png) contains the logo (acts as home button), Home, About, Services dropdown menu and Contact us

* #### Navigation Bar (Admin user)

Admin user [navbar](/documentation/features/AdminNavbar.png) contains the logged in icons plus the Add listing and Messages.

* ### Footer

The [Footer](/documentation/features/Footer.png) displays links for the About us, Contact and Listings(Properties) - Facebook, Instagram and Linkedin icons. At the bottom there are the privacy policy and terms & conditions.

___

### Home Page

The [Home Page](/documentation/features/Home_Page.png) contains 3 full screen hero images, rotated in a carusel, in the center of the iamges displays the search bar. Scrolling down there is some info about the website and 4 cards with the services (Asset Management, Advisory, Valuation and Listings(Properties)). At the bottom of the page displays 4 featured listings.

### About Page

The [About Page](/documentation/features/About.mp4) displays a full screen hero image and Acropolis Estates's mission and values.

### Services Pages

All services page display a full screen hero image and bellow content regarding the service

[Asset Management Page](/documentation/features/AssetMGM.mp4)

[Advisory Page](/documentation/features/Advisory.mp4)

[Valuation Page](/documentation/features/Valuation.mp4)

### Contact Page

The [Contact Page](/documentation/features/Contact_us_Page.png) displays a contact form.

### Listings Page

The [Listings Page](/documentation/features/Listings.mp4) displays the search bar, the listings in a container with infinite scroll and in screens with more than 1200px a google map frame with pins of each listing.

### Listing Page

  The [Listing Page](/documentation/features/Listing.mp4) displays the listing's 5 first images images on top of the page for large screens and in a carusel for small screens, when hovered over image a tooltip with a message to click on image for larger view, the listing's features bellow, a contact form on the right hand of the screen and a google maps frame with listing's pin location.
  
#### Images Modal

  When click on an image, the [modal](/documentation/features/Images_modal.png) will pop up and display the images in a carusel.

### Add Listing Page

  The Add Listing Page contains a form with fields to:

* upload images - choose which to be the first image and the order of the images when rendered
* Basic info - type, sale_type, subtype, currency, price, availability and description
* Address information - address_number,address_street, postcode, municipality, region, latitude, longitude
  
  When type Land has been selected
  * Land Technical section fields - land area, cover coeficcient, building coefficient, length of facade, orienation, view, slope, zone, distance from sea, power type and heating system.

  When type Commercial has been selected
  * Commercial Features section - floor area, land area, levels, floor level, WC, bathrooms,
  rooms, heating system, energy class, power type and year built.
  
  When type Residential has been selected

  * floor area, land area, levels, bedrooms, floor level, kitchens, WC, bathrooms,
  living rooms, heating system, power type, energy class, floor type, glass type, opening frames, year built, service charges

  For each selection there the listing amenities with checkboxes for the user to select.

### Edit Listing Page

  The [Edit Listing Page](/documentation/features/Listing_Edit.png) contains the existed images with a checkbox next to each, a button to delete images, a button to add images and all fields from the Add Listing Page filled with the existed values.

### Messages Page

  The [Messages Page](/documentation/features/Messages_Page.png) displays a search bar that has fields for query (name, email, subject) and
  a list of the message in a container with infinite scroll.
  
#### Message page

  The [Message Page](/documentation/features/Message_Page.png) displays the message in a card with the fields of name, email, subject and
    message.

### Sign in Page

The [Sign in Page](/documentation/features/Sign_in.png) displays the Sign in form, an image on the right and a link to sign up page.

### Sign up Page

The [Signup Page](/documentation/features/Sign_up.png) displays the sign up form, an image on the rigt and a link to sign in page.

### Profile Page

The [Profile Page](/documentation/features/Profile_Page.png) displays the user's details and a carret down icon to open the [dropdown menu](/documentation/features/Profile_dropdown.png)
that display icons to [edit profile](/documentation/features/Profile_Edit.png), [change username](/documentation/features/Change_username.png) and [changee password](/documentation/features/Change_password.png)

#### Edit Profile Page

The [Edit Profile](/documentation/features/Profile_Edit.png) displays a form to update the image, the first name, the last name, the email address and the phone number.

#### Change Username Page

The [Change username Page](/documentation/features/Change_username.png) displays a form to udpate the username.

#### Change Password Page

The [Change password Page](/documentation/features/Change_password.png) displays a form with 2 fields (new password and confirm password).

### 403 error page

The [403 page](/documentation/features/403.png) displays an image with a text error 403: Forbidden.

### 404 error page

The [404 page](/documentation/features/404.png) displays an image with a text error 404: Not found.

## Reusable Components

[SearchBar.js](/documentation/features/Searchbar.png) that exists in the home page, the about page, the listings page and
if logged in user, in the wishlist page.

Dropdown menu: exists in the [Listing.js](/documentation/features/DropdownMenu.png) (only for admins) and in the [ProfilePage.js](/documentation/features/DropdownMenuProfile.png)

ListingFormTextFields.js: displays the input fields for the ListingCreateForm and ListingEditForm.

ListingHeader.js: displays basic info for a property(listing) and it exists in the Listing, ListingsWishlistPage.

ListingsWishlistPage.js : to display all the listings, results of listings after a search and the user's wishlist

axiosDefault.js : for ease of communication with the backend API.

Asset.js : to supply the loading spinner & user avatar throughout the site.

CurrentUserContext.js : confirm users logged-in status to determine what functionality is available to that user.

useRedirect.js : redirects a user to another page if they are not authorised to be on the page they are trying to access.

utils.js : supplies functionality to all of the components that utilise the Infinite Scroll.

ScrolltoTop.js: scrolls the page to top when user change page.

useFetchListings.js: to fetch listings from the API

useFetchWishlist.js: to fetch user's wishlist from the API

useUserStatus.js: to get user status to determine what functionality is available to that user.

## Technologies Used

### Languages Used

Python

### Frameworks, Libraries & Programs Used

* Databases Used
  * [ElephantSQL](https://www.elephantsql.com/)

#### Frameworks Used

* [Django Project](https://www.djangoproject.com/) - A framework to build the app.
* [Django REST Framework](https://www.django-rest-framework.org/) - A powerful and flexible toolkit for building Web APIs

#### Libraries Used

* [Gunicorn](https://gunicorn.org/) - As the server for Heroku.
* [Dj_database_url](https://pypi.org/project/dj-database-url/) - To parse the database URL from the environment variables in Heroku.
* [Psycopg2](https://pypi.org/project/psycopg2/) - As an adaptor for Python and PostgreSQL databases.
* [Allauth](https://docs.allauth.org/en/latest/installation.html) - For authentication, registration, account management.
* [Cloudinary](https://cloudinary.com/) - To host images
* [Pillow](https://pypi.org/project/pillow/) - Image Processing
* [Whitenoise](https://whitenoise.readthedocs.io/en/latest/index.html) - To serve staticfiles
* [django-filter](https://django-filter.readthedocs.io/en/latest/guide/rest_framework.html#adding-a-filterset-with-filterset-class) - To create range filters
* [django-cors-headers](https://pypi.org/project/django-cors-headers/) - To allow in-browser requests to Django application from other origins.
* [django-phonenumber-field](https://django-phonenumber-field.readthedocs.io/en/latest/) - To validate and convert phone numbers.
* [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/) -provides a JSON Web Token authentication backend for the Django REST Framework.
HTML, CSS, JS

### Frameworks, Libraries & Programs Used

* [React](https://legacy.reactjs.org/docs/getting-started.html) Javascript library for building the component based UI and avoiding having to refresh to display dynamic content
* [ESLint](https://eslint.org/) Linter for error checking and syntax analysis
* [React Bootstrap](https://react-bootstrap-v4.netlify.app/) CSS framework for styled components
* [Axios](https://axios-http.com/) Promise based http client for making http requests to the backend API
* [React Infinite Scroll](https://www.npmjs.com/package/react-infinite-scroll-component) Used to easily load extra content rather than paginating pages, for a better UX
* [React Router](https://v5.reactrouter.com/web/guides/quick-start) Used to dynamically load pages and aid site navigation for the user.
* [jwt-decode](https://www.npmjs.com/package/jwt-decode) A browser library that helps decoding JWT's token
* [Cloudinary](https://cloudinary.com/) - To host images
* [React google maps](https://visgl.github.io/react-google-maps/) - To render maps with listing's pinned location
* [i18next](https://www.i18next.com/) - To load English and Greek translation
* [React cookie consent](https://www.npmjs.com/package/react-cookie-consent)- To get user's consent to load google maps 
* [React phone number input](https://www.npmjs.com/package/react-phone-number-input) - To format and validate phone field

#### Programs Used

* [GitHub](https://github.com/) - To save and store files for the website.
* [VSCode](https://code.visualstudio.com/) - Code editor used for local development.
* [GitPod](https://gitpod.io/) - IDE used to create the site.
* [DBdiagram](/https://dbdiagram.io/home) - To create database diagrams.
* [TinyPNG](https://tinypng.com/) - To reduce size of the images.
* [Shields IO](https://shields.io/) - To add badges to README.
* [Obsidian](https://code.visualstudio.com/) - To keep notes.
* [Balsamiq](https://balsamiq.com/) - Used to create wireframes.
* [Techsini](https://techsini.com/multi-mockup/index.php) - To display the web image in various devices.
* [Google Developer Tools](https://developer.chrome.com/docs/) - To test features, resposiveness and stylilng.
* [TinyPNG](https://tinypng.com/) - To reduce size of the images.
* [Favicon](https://favicon.io/) - To create favicon.
* [Shields IO](https://shields.io/) - To add badges to README.
* [Obsidian](https://code.visualstudio.com/) - To keep notes.
* [Coolors](https://coolors.co/) - To create palette image to README.
* [Canva](https://www.canva.com/)

## Testing

Please see [Testing](TESTING.md)
