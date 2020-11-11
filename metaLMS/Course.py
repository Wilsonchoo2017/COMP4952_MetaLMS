from .LearningObject import *
from .utility.scorm_utils import *
import threading


def handle_post_course(course_json):
    print(course_json)
    is_imported = course_json['isImported']
    if is_imported == False:
        insert_course_into_database(course_json['courseCode'], course_json['courseName'], course_json['courseTerm'],
                                course_json['courseYear'], course_json['courseType'],course_json['courseDuration'],course_json['courseLOs'],
                                course_json['courseComponent'], course_json['isImported'])
    else:
        # import into scorm
        handle_import_course(course_json)

def handle_import_course(course_json):
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

    while True:
        if(check_import_job_status(job_id)) == 0:
            break


    return handle_upload_complete_course(curr_id, course_json)

def check_import_job_status(job_id):
    response_json = check_job_status(job_id)
    status = response_json.status
    if status == "COMPLETE":
        return 0

    if status == "RUNNING":
        return 1

    # Error
    return 2

def handle_upload_complete_course(course_id, course_json):
    response_json = get_course_detail_from_scorm(course_id)
    # Unpack response body
    courseName = response_json.title
    # insert_course_into_database(course_code, course_name, course_term, course_year,
    #                             course_type, course_duration, course_los, course_component, "1")
    # created = response_json.created
    # tags = response_json.tags
    # metadata = response_json.metadata
    print(response_json)

    return response_json




def get_course_detail(course_id):
    # if course type is scorm. Procede to extract using get_scrom_course_detail
    # if(get_is_imported(course_id) == 0):
        # else extract everything from database and
    if course_id == None:
        return []

    return get_course_and_associated_details_from_db(course_id)
    # else:
        # return (course_id) TODO
        # pass


def get_ssm_of_two_courses(course_a, course_b):
    response_a = get_course_detail(course_a)['LearningObject']
    response_b = get_course_detail(course_b)['LearningObject']

    # Set of LO ids
    lo_a = set()
    lo_b = set()

    for i in response_a:
        lo_a.add(i['LOId'])

    for i in response_b:
        lo_b.add(i['LOId'])

    # Convert set to list
    lo_a = list(lo_a)
    lo_b = list(lo_b)



    print("set", lo_a)
    print("setb", lo_b)

    total_score_a = 0
    # Get Score board
    scoreboard_a = {}
    scoreboard_b = {}
    for a in lo_a:
        for b in lo_b:
            if a == b:
                # Skip same lo id
                # scoreboard_a[b] = -1
                continue

            # Score between a and b
            score = compute_two_lo_ssm(a, b)
            print(scoreboard_a)
            if a in scoreboard_a:
                # append list of dict
                scoreboard_a[a].append({'from': a, 'to': b, 'score': score})
            else:
                # append dict to list
                scoreboard_a[a] = [{'from': a, 'to': b, 'score': score}]

            total_score_a = total_score_a + score

            print('score', score)
            print('scoreboard', scoreboard_a)

    total_score_b = 0
    for b in lo_b:
        for a in lo_a:
            if a == b:
                # Skip same lo id
                # scoreboard_b[a] = -1
                continue

            # Score between a and b
            score = compute_two_lo_ssm(a, b)

            if b in scoreboard_b:
                # append list of dict
                scoreboard_b[b].append({'from': b, 'to': a, 'score': score})
            else:
                # append dict to list
                scoreboard_b[b] = [{'from': b, 'to': a, 'score': score}]

            total_score_b = total_score_b + score

            print('score', score)
            print('scoreboard', scoreboard_b)

    print(total_score_a, total_score_b)

    course_ssm_score = total_score_a + total_score_b
    # course a score = how similar is the lo to the other course
    return course_ssm_score, scoreboard_a, scoreboard_b


