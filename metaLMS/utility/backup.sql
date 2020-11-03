BEGIN TRANSACTION;
DROP TABLE IF EXISTS "User";
CREATE TABLE IF NOT EXISTS "User" (
	"UserId"	integer,
	"username"	varchar(20),
	"userPassword"	varchar(20),
	"userType"	varchar(10),
	"displayName"	varchar(20),
	PRIMARY KEY("UserId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "SubComponent";
CREATE TABLE IF NOT EXISTS "SubComponent" (
	"SubComponentId"	INTEGER NOT NULL UNIQUE,
	"SubComponentName"	INTEGER NOT NULL,
	"ComponentId"	INTEGER,
	FOREIGN KEY("ComponentId") REFERENCES "LearningObject"("LOId"),
	PRIMARY KEY("SubComponentId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "HasLO";
CREATE TABLE IF NOT EXISTS "HasLO" (
	"LOId"	INTEGER,
	"SubComponentId"	INTEGER,
	FOREIGN KEY("LOId") REFERENCES "LearningObject"("LOId"),
	PRIMARY KEY("LOId","SubComponentId")
);
DROP TABLE IF EXISTS "LearningObject";
CREATE TABLE IF NOT EXISTS "LearningObject" (
	"LOId"	INTEGER NOT NULL,
	"title"	varchar(50),
	"documentType"	varchar(10),
	"uploadDate"	datetime,
	"FilePath"	TEXT,
	"Course"	INTEGER,
	"User"	INTEGER,
	FOREIGN KEY("Course") REFERENCES "Course"("CourseId"),
	PRIMARY KEY("LOId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "Course";
CREATE TABLE IF NOT EXISTS "Course" (
	"CourseId"	INTEGER NOT NULL,
	"CourseCode"	Char(8),
	"CourseName"	Varchar(20),
	"Term"	INTEGER,
	"Year"	INTEGER,
	"Duration"	INTEGER,
	"Type"	TEXT,
	PRIMARY KEY("CourseId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "Component";
CREATE TABLE IF NOT EXISTS "Component" (
	"ComponentId"	INTEGER NOT NULL,
	"ComponentName"	INTEGER NOT NULL,
	"CourseId"	INTEGER,
	PRIMARY KEY("ComponentId" AUTOINCREMENT)
);
INSERT INTO "User" ("UserId","username","userPassword","userType","displayName") VALUES (1,'jasjas','admin1234','academicStaff','Jas'),
 (2,'morrimorri','admin1234','academicStaff','Morri');
INSERT INTO "SubComponent" ("SubComponentId","SubComponentName","ComponentId") VALUES (1,'Slides',1),
 (2,'Code',1),
 (3,'Mics',1),
 (4,'Coding',2),
 (5,'Written',2),
 (6,'Mics',2);
INSERT INTO "HasLO" ("LOId","SubComponentId") VALUES (1,1),
 (2,2),
 (1,7),
 (1,8),
 (1,9),
 (1,10),
 (1,11),
 (2,11);
INSERT INTO "LearningObject" ("LOId","title","documentType","uploadDate","FilePath","Course","User") VALUES (1,'Week01','pdf',1593625403000,'/Users/wilson/PycharmProjects/COMP4952/LearningObject/COMP1511/Lecture/Week01.pdf ',1,NULL),
 (2,'Week02','pdf',1593625531000,'/Users/wilson/PycharmProjects/COMP4952/LearningObject/COMP1511/Lecture/Week02.pdf ',1,NULL);


INSERT INTO "Course" ("CourseId","CourseCode","CourseName","Term","Year","Duration","Type") VALUES (1,'COMP1511','Programming Fundamentals',1,2018,NULL,NULL),
 (2,'COMP1521','Computer Systems Fundamentals',2,2019,NULL,NULL);
INSERT INTO "Component" ("ComponentId","ComponentName","CourseId") VALUES (1,'Lecture',1),
 (2,'Test',1);
DROP INDEX IF EXISTS "Course_Id_uindex";
CREATE UNIQUE INDEX IF NOT EXISTS "Course_Id_uindex" ON "Course" (
	"CourseId"
);
COMMIT;
