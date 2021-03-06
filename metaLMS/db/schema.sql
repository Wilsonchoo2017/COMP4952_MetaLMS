BEGIN TRANSACTION;
DROP TABLE IF EXISTS "HasLO";
CREATE TABLE IF NOT EXISTS "HasLO" (
	"LOId"	INTEGER,
	"SubComponentId"	INTEGER,
	"Week"	INTEGER,
	PRIMARY KEY("LOId","SubComponentId","Week"),
	FOREIGN KEY("LOId") REFERENCES "LearningObject"("LOId")
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
	"isImported"	INTEGER,
	"tags"	TEXT,
	"annotation"	INTEGER,
	PRIMARY KEY("CourseId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "SubComponent";
CREATE TABLE IF NOT EXISTS "SubComponent" (
	"SubComponentId"	INTEGER NOT NULL UNIQUE,
	"SubComponentName"	INTEGER NOT NULL,
	"ComponentId"	INTEGER,
	"Score"	INTEGER,
	PRIMARY KEY("SubComponentId" AUTOINCREMENT),
	FOREIGN KEY("ComponentId") REFERENCES "LearningObject"("LOId")
);
DROP TABLE IF EXISTS "Component";
CREATE TABLE IF NOT EXISTS "Component" (
	"ComponentId"	INTEGER NOT NULL,
	"ComponentName"	INTEGER NOT NULL,
	"CourseId"	INTEGER,
	"Score"	INTEGER,
	PRIMARY KEY("ComponentId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "Prerequisite";
CREATE TABLE IF NOT EXISTS "Prerequisite" (
	"prereq_id"	INTEGER,
	"course_id"	INTEGER,
	"course_req_id"	INTEGER,
	PRIMARY KEY("prereq_id" AUTOINCREMENT),
	FOREIGN KEY("course_id") REFERENCES "Course"("CourseId"),
	FOREIGN KEY("course_req_id") REFERENCES "Course"("CourseId")
);
DROP TABLE IF EXISTS "LearningObject";
CREATE TABLE IF NOT EXISTS "LearningObject" (
	"LOId"	INTEGER NOT NULL,
	"title"	varchar(50),
	"documentType"	varchar(10),
	"uploadDate"	datetime,
	"FilePath"	TEXT,
	"ContactUser"	TEXT,
	PRIMARY KEY("LOId" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "Subpage";
CREATE TABLE IF NOT EXISTS "Subpage" (
	"SubpageId"	INTEGER,
	"LOId"	INTEGER NOT NULL,
	"PageNumber"	INTEGER,
	PRIMARY KEY("SubpageId" AUTOINCREMENT),
	FOREIGN KEY("LOId") REFERENCES "LearningObject"("LOId")
);
DROP TABLE IF EXISTS "Top3SimilarLO";
CREATE TABLE IF NOT EXISTS "Top3SimilarLO" (
	"SmId"	INTEGER,
	"LoId"	INTEGER,
	"SimilarLO"	INTEGER
);
DROP INDEX IF EXISTS "Course_Id_uindex";
CREATE UNIQUE INDEX IF NOT EXISTS "Course_Id_uindex" ON "Course" (
	"CourseId"
);
COMMIT;
