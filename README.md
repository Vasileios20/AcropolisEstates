# CB Real Estate

CB Real Estate represents the culmination of my efforts during the final project for Code Institute, serving as a dynamic platform designed for further development and potential client adoption. Focused on real estate, the site empowers users to effortlessly search for their next home, office space, or the ideal plot of land for construction. The inclusion of user accounts allows individuals to curate a personalized wishlist, tracking properties of interest, and facilitating seamless communication through a user-friendly contact form. Currently, property uploads are restricted to administrators, ensuring quality control, but the future vision includes the possibility for registered agents to contribute their listings. As the project evolves, CB Real Estate aims to provide an enriched and intuitive platform for users to explore and engage with the real estate market.

Deployed API Heroku: [API link](https://re-drf-api-f69fb4705742.herokuapp.com/)

Deployed Frontend Heroku: [CB Real Estate](https://re-real-estate-ecc213881132.herokuapp.com/)

Backend Github [Repository](https://github.com/Vasileios20/drf-real-estate)

Frontend Github [Repository](https://github.com/Vasileios20/real-estate)

![GitHub contributors](https://img.shields.io/badge/CONTRIBUTORS-1-<RED>)

## Contents

* [Database Diagram](#database-diagram)
* [Technologies Used](#technologies-used)
  * [Languages Used](#languages-used)
  * [Frameworks, Libraries & Programs Used](#frameworks-libraries--programs-used)
* [Deployment and Local Development](#deployment-and-local-development)
  * [Local Development](#local-development)
    * [How to fork](#how-to-fork)
    * [How to clone](#how-to-clone)
    * [Deployment](#deployment)
* [Testing](#testing)
* [Credits](#credits)

### User Stories

I have created tasks and included links to the [GitHub Issues](https://github.com/Vasileios20/drf-real-estate/issues) for this project, as well as the [KANBAN board](https://github.com/users/Vasileios20/projects/6).

## Database Diagram

[Database Diagram](/documentation/real_est.png)

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

#### Programs Used

* [GitHub](https://github.com/) - To save and store files for the website.
* [VSCode](https://code.visualstudio.com/) - Code editor used for local development.
* [GitPod](https://gitpod.io/) - IDE used to create the site.
* [DBdiagram](/https://dbdiagram.io/home) - To create database diagrams.
* [TinyPNG](https://tinypng.com/) - To reduce size of the images.
* [Shields IO](https://shields.io/) - To add badges to README.
* [Obsidian](https://code.visualstudio.com/) - To keep notes.

## Deployment and Local Development

### Local Development

#### How to fork

To fork the repository :

1. Log in (sign up) to GitHub.
2. Go to the repository for this project [drf-real-estate](https://github.com/Vasileios20/drf-real-estate).
3. Click the fork button in the top right corner.

#### How to clone

To clone the repository :

1. Log in (sign up) to GitHub.
2. Go to the repository for this project [drf-real-estate](https://github.com/Vasileios20/drf-real-estate).
3. Click on the code button, select one of the HTTPS, SSH or GitHub CLI and copy the link shown.
4. Open the terminal in your code editor and change the current working directory to the location you want to use for the cloned directory.
5. Type 'git clone' into the terminal and then paste the link you copied in step 3. Press enter.

### Deployment

The site has been deployed using Heroku. Deployed [API link](https://re-drf-api-f69fb4705742.herokuapp.com/). Follow these steps:

#### ElephantSQL

If you don't already have an account to ElephantSQL, create one [here](https://www.elephantsql.com).

* Create an external database with

  * Log into ElephantSQL
  * Click "Create New Instance"
  * Set up a plan by giving a Name and selecting a Plan
  * Click "Select Region" and choose a Data center
  * Click "Review", check all details and click "Create Instance"
  * Return to the Dashboard and click on the database instance name
  * Copy the database URL

#### Heroku App

If you don't already have an account to Heroku, create one [here](https://www.heroku.com/).

* Create Heroku app
  * Go to the Heroku dashboard and click the "Create new app" button.
  * Name the app. Each app name on Heroku has to be unique.
  * Then select your region.
  * And then click "Create app".

#### Attach the Database

* In the IDE file explorer or terminal
  * Create new env.py file on top level directory

* In env.py
  * Import os library
  * Set environment variables
  * Add database url
  * Add in secret key

```python
import os

os.environ['DEV'] = '1'
os.environ["DATABASE_URL"] = "Paste in ElephantSQL database URL"    
os.environ["SECRET_KEY"] = "Make up your own randomSecretKey"    
os.environ["CLOUDINARY_URL"] = "Paste in the API Environment variable"
```
  
If you don't already have an account to Cloudinary, create one [here](https://cloudinary.com/).

* Cloudinary
  * Go to the Cloudinary dashboard and copy the API Environment variable.
  * Paste in env.py variable CLOUDINARY_URL(see above)
  
* In heroku app
  * Go to the settings tab.
  * In the settings click the button "Reveal Config Vars".
  * Click Add and use

    |KEY|VALUE|
    |--|--|
    |DATABASE_URL|Paste in ElephantSQL database URL|
    |SECRET_KEY|Your own randomSecretKey|
    |CLOUDINARY_URL|Paste in the API Environment variable|
    |ALLOWED HOST|api-app-name.herokuapp.com|
    |CLIENT_ORIGIN | <https://your-react-app-name.herokuapp.com>*|
    |CLIENT_ORIGIN_DEV | <https://gitpod-browser-link.ws-eu54.gitpod.io>*|

    *Check that the trailing slash \ at the end of both links has been removed.

  * Go to the deploy tab.
  * Choose the deployment method.
  * Select Github, and confirm to connect to Github.
  * Search for the Github repository name.
  * Then click "connect".
  * Scroll down and click "Deploy Branch".

## Testing

Please see [Testing](TESTING.md)

## Credits

### Code Used

[Code Institute's](https://codeinstitute.net/) - Walkthrough project Django REST Framework

[Stackoverflow](https://stackoverflow.com/questions/72353753/django-rest-upload-multiple-images) to implement multiple images upload.

[Stackoverflow](https://stackoverflow.com/questions/72353753/django-rest-upload-multiple-images) to implement multiple images edit.

[Stackoverflow](https://stackoverflow.com/questions/66060744/django-admin-form-process-file-upload-inmemoryuploadedfile-object-has-no-attr) to validate images

[Django-filter](https://django-filter.readthedocs.io/en/latest/guide/rest_framework.html#adding-a-filterset-with-filterset-class)

### Media

### Aknowledgments

My mentor [Lauren-Nicole](https://github.com/CluelessBiker) for guidance, support and feedback during the project.

[Kera Cudmore](https://github.com/kera-cudmore) for feedback and support during the project. Also for providing an excellent guide how to write the README.

And the tutors from Code Institute that helped me overcome the issues that I faced with the project.
