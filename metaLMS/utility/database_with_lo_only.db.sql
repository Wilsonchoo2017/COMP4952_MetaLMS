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
	FOREIGN KEY("ComponentId") REFERENCES "LearningObject"("LOId"),
	PRIMARY KEY("SubComponentId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "HasLO";
CREATE TABLE IF NOT EXISTS "HasLO" (
	"LOId"	INTEGER,
	"SubComponentId"	INTEGER,
	"Week"	INTEGER,
	FOREIGN KEY("LOId") REFERENCES "LearningObject"("LOId"),
	PRIMARY KEY("LOId","SubComponentId","Week")
);
INSERT INTO "LearningObject" ("LOId","title","documentType","uploadDate","FilePath","User") VALUES (1,'Week01','application/pdf','2020-10-19 18:10:33','/Users/wilson/PycharmProjects/COMP4952/LearningObject/1',NULL),
 (2,'Week02','application/pdf','2020-10-19 18:10:47','/Users/wilson/PycharmProjects/COMP4952/LearningObject/2',NULL);
DROP INDEX IF EXISTS "Course_Id_uindex";
CREATE UNIQUE INDEX IF NOT EXISTS "Course_Id_uindex" ON "Course" (
	"CourseId"
);
COMMIT;
