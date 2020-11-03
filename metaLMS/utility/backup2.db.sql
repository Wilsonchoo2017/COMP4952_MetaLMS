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
DROP TABLE IF EXISTS "LearningObject";
CREATE TABLE IF NOT EXISTS "LearningObject" (
	"LOId"	INTEGER NOT NULL,
	"title"	varchar(50),
	"documentType"	varchar(10),
	"uploadDate"	datetime,
	"FilePath"	TEXT,
	"User"	INTEGER,
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
DROP TABLE IF EXISTS "SubComponent";
CREATE TABLE IF NOT EXISTS "SubComponent" (
	"SubComponentId"	INTEGER NOT NULL UNIQUE,
	"SubComponentName"	INTEGER NOT NULL,
	"ComponentId"	INTEGER,
	PRIMARY KEY("SubComponentId" AUTOINCREMENT),
	FOREIGN KEY("ComponentId") REFERENCES "LearningObject"("LOId")
);
DROP TABLE IF EXISTS "HasLO";
CREATE TABLE IF NOT EXISTS "HasLO" (
	"LOId"	INTEGER,
	"SubComponentId"	INTEGER,
	"Week"	INTEGER,
	PRIMARY KEY("LOId","SubComponentId","Week"),
	FOREIGN KEY("LOId") REFERENCES "LearningObject"("LOId")
);
INSERT INTO "LearningObject" ("LOId","title","documentType","uploadDate","FilePath","User") VALUES (1,'Week01','application/pdf','2020-10-19 18:10:33','/Users/wilson/PycharmProjects/COMP4952/LearningObject/1',NULL),
 (2,'Week02','application/pdf','2020-10-19 18:10:47','/Users/wilson/PycharmProjects/COMP4952/LearningObject/2',NULL),
 (3,'thirdLO','application/pdf','2020-10-21 12:45:39','/Users/wilson/PycharmProjects/COMP4952/LearningObject/3',NULL);
INSERT INTO "Course" ("CourseId","CourseCode","CourseName","Term","Year","Duration","Type") VALUES (1,'COMP1511','Computer Fundamentals',1,202,3,'DLV'),
 (2,'COMP1521','Computer System Fundamentals',2,2012,3,'DLV');
INSERT INTO "Component" ("ComponentId","ComponentName","CourseId") VALUES (1,'Lecture',1),
 (2,'Test',1),
 (3,'Lecture',2),
 (4,'Test',2);
INSERT INTO "SubComponent" ("SubComponentId","SubComponentName","ComponentId") VALUES (1,'Slides',1),
 (2,'Code',1),
 (3,'Mics',1),
 (4,'Coding',2),
 (5,'Written',2),
 (6,'Mics',2),
 (7,'Slides',3),
 (8,'Code',3),
 (9,'Mics',3),
 (10,'Coding',4),
 (11,'Written',4),
 (12,'Mics',4);
INSERT INTO "HasLO" ("LOId","SubComponentId","Week") VALUES (1,1,1),
 (2,2,1),
 (1,4,1),
 (1,5,1),
 (2,1,2),
 (1,2,2),
 (1,7,1),
 (1,7,2),
 (3,7,2),
 (3,12,2),
 (1,12,2),
 (2,8,3),
 (2,10,3),
 (3,10,3);
DROP INDEX IF EXISTS "Course_Id_uindex";
CREATE UNIQUE INDEX IF NOT EXISTS "Course_Id_uindex" ON "Course" (
	"CourseId"
);
COMMIT;
