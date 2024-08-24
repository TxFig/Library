# Library

## Introduction
This application provides a seamless way to manage a library collection, allowing users to easily add, edit, and organize books. The key features of this platform include:

- Book Scanning: Use your camera to scan books and automatically add them to the library. If a book is not recognized, you can manually fill in the book's information through a form.
- User Interaction: On your user page, you can track books you are currently reading and those you have marked as read. Additionally, you can create book collections and add books to these collections directly from the book's page.
- Admin Capabilities: Admin users have the ability to create, edit, and delete user accounts, as well as view the activity log of the library.

### Initial Setup
When you first deploy the application, navigate to `/admin/initial-setup`. During this setup process, the system will check for an admin email specified in the `.env` file:

- With Admin Email: If an admin email is provided in the .env file, an admin account will be automatically created, and a confirmation email will be sent to that address.
- Without Admin Email: If no admin email is provided, you can fill out a form to create the first admin user manually.

## Installation
### Local Installation
Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)


1. Clone the repository:

    ```bash
    git clone https://github.com/TxFig/Library.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up PostgreSQL:

    Install PostgreSQL locally, and create a database.

4. Create a `.env` file in the root of the project with the contents based on the `.env.example` file. See the [Environment Variables](#environment-variables) section for more information.

5. Build the application:

    ```bash
    npm run build
    ```

6. Start the application:

    ```bash
    npm start
    ```

The application should now be running on http://localhost:3000.

### Docker Installation
[Docker Repository](https://hub.docker.com/r/txfig/library)

1. Create a docker-compose.yml file by either copying the provided example file or creating a new one using the example file as a reference.

2. Create a `.env` file in the same directory as the docker-compose.yml file with the contents based on the `.env.example` file. See the [Environment Variables](#environment-variables) section for more information.

3. Start the application:

    ```bash
    docker compose up
    ```

The application should now be running on http://localhost.


## Environment Variables

### General Configuration (change required)

`STATIC` is the absolute path to the static files directory.

`PORT` is the port the application will run on.

`ORIGIN` is the address the application will be hosted on.


### Database Configuration
If you are using Docker, leave the following variables defaults.
Otherwise, change them to match your PostgreSQL configuration.


`PG` is the name of the PostgreSQL container.

`POSTGRES_DB` is the name of the database.

`POSTGRES_USER` is the username for the database.

`POSTGRES_PASSWORD` is the password for the database.


### Email Configuration (change required)

`EMAIL_HOST` is the SMTP host.

`EMAIL_PORT` is the SMTP port.

`EMAIL_USER` is the SMTP username.

`EMAIL_PASSWORD` is the SMTP password.

`EMAIL_FROM` is the email address the emails will be sent from.


### Other Configuration (optional, leave defaults)

`EMAIL_CONFIRMATION_EXPIRATION_TIME` is the time in seconds the email confirmation link will be valid for.

`SESSION_EXPIRATION_TIME` is the time in seconds the session will be valid for.

`SESSION_COOKIE_NAME` is the name of the session cookie.
`ADMIN_EMAIL` is the email address of the first admin user.


### Size Limits (optional, leave defaults)

`MAX_IMAGE_UPLOAD_SIZE` is the maximum size of an image upload in bytes.

`BODY_SIZE_LIMIT` is the maximum size of the request body in bytes.

