# Changelog

## [1.1.0] - 2024-08-24
Docker Image: [txfig/library:1.1.0](https://hub.docker.com/layers/txfig/library/1.1.0/images/sha256-b264701844c89e6e28c41e59266b2ac80058e92b3932c0703883d74a46ac314b)

### Added

- Google Books integration.
- Combining of book data from OpenLibrary and Google Books.
- Subjects page.
- Added favicon.
- User search functionality in admin panel.
- Logging (Http Requests, user actions and errors).
- Logs Page.
- Books images on collections.
- Ability to remove books from collections.
- Added "Want to read" option to reading state.
- Multi-scan option (base).
- Book Rantings.
- Docker installation and deployment instructions on README.

### Fixed

- ISBN field editable when editing a book.
- Images with heights below 320px not being saved.
- Multiple popups appearing after scanning a book.
- Old book data not being cleared when editing a book.
- Prevent user create/edit form submission when changing permission group.
- Only show create and scan book buttons when logged in.

### Changed

- Increased camera ideal resolution.
- Default to second camera if available.
- Updated publishers icon.
- Updated email input type from text to email for better keyboard support.
- Book create/edit form submit button is now fixed to the bottom of the page.
- Moved create user button location.
- Updated reading state selector styling.
- Redesign of collections modal on book page.

### Removed

- IMAGES_PATH environment variable.

## [1.0.0] - 2024-07-30

Initial Release

Docker Image: [txfig/library:1.0.0](https://hub.docker.com/layers/txfig/library/1.0.0/images/sha256-2628dcdb2f4a60c2d334509d2cb82184a6d7393fb68319887ee7c071ebe7988a)
