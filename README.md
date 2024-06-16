# Library

## Introduction
This application provides a seamless way to manage a library collection, allowing users to easily add, edit, and organize books. The key features of this platform include:

- Book Scanning: Use your camera to scan books and automatically add them to the library. If a book is not recognized, you can manually fill in the book's information through a form.
- User Interaction: On your user page, you can track books you are currently reading and those you have marked as read. Additionally, you can create book collections and add books to these collections directly from the book's page.
- Admin Capabilities: Admin users have the ability to create, edit, and delete user accounts, as well as view the activity log of the library.

### Initial Setup
When you first deploy the application, navigate to `/admin/initial-setup`. During this setup process, the system will check for an admin email specified in the .env file:

- With Admin Email: If an admin email is provided in the .env file, an admin account will be automatically created, and a confirmation email will be sent to that address.
- Without Admin Email: If no admin email is provided, you can fill out a form to create the first admin user manually.

## Getting Started
### Prerequisites


Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation
### Installation Locally

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

4. Create a `.env` file in the root of the project with the contents based on the `.env.example` file.

    Example `.env` file:
    ```
    IMAGES_PATH="static/images"
    ORIGIN="http://localhost:3000"

    DATABASE_USERNAME="postgres"
    DATABASE_PASSWORD="postgres"
    DATABASE_DATABASE="library"
    DATABASE_URL="postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_DATABASE}"

    EMAIL_HOST="smtp.example.com"
    EMAIL_PORT="587"
    EMAIL_USER="user@example.com"
    EMAIL_PASSWORD="secret-password"
    EMAIL_FROM="user@example.com"


    EMAIL_CONFIRMATION_EXPIRATION_TIME=600
    SESSION_EXPIRATION_TIME=2592000

    SESSION_COOKIE_NAME="sessionToken"

    ADMIN_EMAIL="admin@example.com"
    ```

### Installation Docker
[Docker Repository](https://hub.docker.com/r/txfig/library)

1. Pull the Docker image:

    ```bash
    docker pull txfig/library:latest
    ```

2.

## Deploying
### Running Locally

To create a production version of the app:

```bash
npm run build
```

The built files will be in the build directory.


To start the production server locally:

```bash
npm start
```
	

The application should now be running on http://localhost:3000.

### Deploying using Docker
...

