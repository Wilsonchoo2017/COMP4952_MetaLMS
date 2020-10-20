from .utility.database import insert_course_into_database, max_course_id
from .utility.scorm_utils import *
from base64 import b64decode


def handle_post_course(ontology_file, course_json):
    print(course_json)
    insert_course_into_database(course_json['courseCode'], course_json['courseName'], course_json['courseTerm'],
                                course_json['courseYear'], course_json['courseType'],course_json['courseDuration'],course_json['courseLOs'],
                                course_json['courseComponent'])

def handle_import_course(ontology_file, course_json):
    print(course_json)

    # Insert file path
    file = course_json['file']
    file = file.split(",")[1]
    bytes = b64decode(file, validate=True)

    curr_id = max_course_id() + 1
    save_filepath = '/Users/wilson/PycharmProjects/COMP4952/LearningObject/' + "Course" + str(curr_id)
    print(save_filepath)
    f = open(save_filepath, 'wb')
    f.write(bytes)
    f.close()

    job_id = upload_course(save_filepath)
    return job_id

def check_import_job_status(job_id):
    response_json = check_job_status(job_id)
    status = response_json.status
    if status == "COMPLETE":
        return 0

    if status == "RUNNING":
        return 1

    # Error
    return 2

def get_scorm_course_detail(course_id):
    response_json = get_course_detail(course_id)
    # Unpack response body
    title = response_json.title
    created = response_json.created
    tags = response_json.tags
    tags = response_json.metadata
