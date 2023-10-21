--* tmp
-- DROP TABLE IF EXISTS Books;
-- DROP TABLE IF EXISTS Authors;
-- DROP TABLE IF EXISTS BooksAuthors;
-- DROP TABLE IF EXISTS Publishers;
-- DROP TABLE IF EXISTS BooksPublishers;
-- DROP TABLE IF EXISTS Subjects;
-- DROP TABLE IF EXISTS BooksSubjects;
-- DROP TABLE IF EXISTS Locations;
-- DROP TABLE IF EXISTS Languages;


CREATE TABLE IF NOT EXISTS Books (
    id INTEGER PRIMARY KEY,

    title TEXT NOT NULL,
    subtitle TEXT,
    number_of_pages INTEGER,
    publish_date TEXT,

    isbn INTEGER NOT NULL,
    isbn10 INTEGER,
    isbn13 INTEGER,

    front_image TEXT,
    back_image TEXT,

    location_id INTEGER,
    language_id INTEGER,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id),
    FOREIGN KEY (language_id) REFERENCES Languages(language_id)
);

CREATE TABLE IF NOT EXISTS Authors (
    id INTEGER PRIMARY KEY,

    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS BooksAuthors (
    book_id INTEGER,
    author_id INTEGER,

    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

CREATE TABLE IF NOT EXISTS Publishers (
    id INTEGER PRIMARY KEY,

    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS BooksPublishers (
    book_id INTEGER,
    publisher_id INTEGER,

    PRIMARY KEY (book_id, publisher_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id)
);

CREATE TABLE IF NOT EXISTS Subjects (
    id INTEGER PRIMARY KEY,
    value TEXT NOT NULL UNIQUE
);

--* Default Subjects
INSERT OR IGNORE INTO Subjects (value) VALUES
    ("Architecture"), ("Art Instruction"), ("Art History"), ("Dance"), ("Design"),
    ("Fashion"), ("Film"), ("Graphic Design"), ("Music"), ("Music Theory"),
    ("Painting"), ("Photography"), ("Bears"), ("Cats"), ("Kittens"),
    ("Dogs"), ("Puppies"), ("Fantasy"), ("Historical Fiction"), ("Horror"),
    ("Humor"), ("Literature"), ("Magic"), ("Mystery and detective stories"), ("Plays"),
    ("Poetry"), ("Romance"), ("Science Fiction"), ("Short Stories"), ("Thriller"),
    ("Young Adult"), ("Biology"), ("Chemistry"), ("Mathematics"), ("Physics"),
    ("Programming"), ("Management"), ("Entrepreneurship"), ("Business Economics"), ("Business Success"),
    ("Finance"), ("Kids Books"), ("Stories in Rhyme"), ("Baby Books"), ("Bedtime Books"),
    ("Picture Books"), ("Ancient Civilization"), ("Archaeology"), ("Anthropology"), ("World War II"),
    ("Social Life and Customs"), ("Cooking"), ("Cookbooks"), ("Mental Health"), ("Exercise"),
    ("Nutrition"), ("Self-help"), ("Autobiographies"), ("History"), ("Politics and Government"),
    ("World War II"), ("Women"), ("Kings and Rulers"), ("Composers"), ("Artists"),
    ("Social Sciences"), ("Anthropology"), ("Religion"), ("Political Science"), ("Psychology"),
    ("History"), ("Mathematics"), ("Geography"), ("Psychology"), ("Algebra"),
    ("Education"), ("Business & Economics"), ("Science"), ("Chemistry"), ("English Language"),
    ("Physics"), ("Computer Science");


CREATE TABLE IF NOT EXISTS BooksSubjects (
    book_id INTEGER,
    subject_id INTEGER,

    PRIMARY KEY (book_id, subject_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);

CREATE TABLE IF NOT EXISTS Locations (
    id INTEGER PRIMARY KEY,
    value TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Languages (
    id INTEGER PRIMARY KEY,
    value TEXT NOT NULL UNIQUE
);
