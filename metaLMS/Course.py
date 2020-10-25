from .utility.database import insert_course_into_database, max_course_id, get_course_and_associated_details_from_db, \
    get_is_imported
from .utility.scorm_utils import *
from base64 import b64decode
import time, threading

job_queue = [{"job_id": "QKZXU3B8GG1", "course_id": "1"}]


def handle_post_course(ontology_file, course_json):
    print(course_json)
    is_imported = course_json['isImported']
    if is_imported == False:
        insert_course_into_database(course_json['courseCode'], course_json['courseName'], course_json['courseTerm'],
                                course_json['courseYear'], course_json['courseType'],course_json['courseDuration'],course_json['courseLOs'],
                                course_json['courseComponent'], course_json['isImported'])
    else:
        # import into scorm
        handle_import_course(ontology_file, course_json)

def handle_import_course(ontology_file, course_json):
    print(course_json)

    # Save File
    file = course_json['file']
    file = file.split(",")[1]
    bytes = b64decode(file, validate=True)

    curr_id = max_course_id() + 1
    save_filepath = '/Users/wilson/PycharmProjects/COMP4952/LearningObject/' + "Course" + str(curr_id)
    print(save_filepath)
    f = open(save_filepath, 'wb')
    f.write(bytes)
    f.close()

    # Save into Database
    job_id = upload_course(save_filepath)
    job_queue.append({"job_id": job_id, "course_id": curr_id})
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

def handle_upload_complete_course(course_id):
    response = get_scorm_course_detail(course_id)
    # insert some information into database
    pass

def get_scorm_course_detail(course_id):
    response_json = get_course_detail_from_scorm(course_id)
    # Unpack response body
    # title = response_json.title
    # created = response_json.created
    # tags = response_json.tags
    # metadata = response_json.metadata

    return response_json


def get_course_detail(course_id):
    # if course type is scorm. Procede to extract using get_scrom_course_detail
    if(get_is_imported(course_id) == 0):
        # else extract everything from database and
        return get_course_and_associated_details_from_db(course_id)
    else:
        return get_scorm_course_detail(course_id)


def ping_job_status():
    print(time.ctime())
    if len(job_queue) is not 0:
        print(job_queue)
        job = job_queue[0]
        job_id = job.get("job_id")
        course_id = job.get("course_id")
        if check_job_status(job_id) == 0:
            # remove from queue
            job_queue.pop(0)
            # Do stuff with the course_id
            handle_upload_complete_course(course_id)

    # do this again in 10 seconds
    threading.Timer(10, ping_job_status).start()

