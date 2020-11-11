import sqlite3

db_path = 'metaLMS/db/LOdatabase.db'



def db_init():
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    return (conn, c)


def get_db_LO_from_id(id):
    """

    :param id:
    :return:
        a list of dictionary
    """
    conn, c = db_init()
    result = c.execute("select * from LearningObject where id = id")

    result = result.fetchone()
    row_headers = [x[0] for x in c.description]
    json_data = []
    json_data.append(dict(zip(row_headers, result)))

    c.close()
    return json_data


def get_learning_object_and_associated_details_from_db(lo_id):
    """
    Given concept id(Learning Object id)

    :return:
        a list of dictionary
        which contains learning object details and course associated with it
    """
    lo_id = str(lo_id)
    conn, c = db_init()
    response = {}

    # Get LO
    result = c.execute("SELECT * from LearningObject "
                       "where LearningObject.LOId=?", (lo_id))

    result = result.fetchone()
    row_headers = [x[0] for x in c.description]
    response['LearningObject'] = dict(zip(row_headers, result))

    # Get SubPages
    result = c.execute("SELECT * from Subpage "
                       "where SubPage.LOId=?", (lo_id))

    result = result.fetchall()
    row_headers = [x[0] for x in c.description]
    response['Subpages'] = []
    for x in result:
        response['Subpages'].append(dict(zip(row_headers, x)))

    # Get SubComponent
    result = c.execute("select DISTINCT SubComponent.SubComponentId, SubComponent.SubComponentName, SubComponent.ComponentId from LearningObject "
                       "join HasLO on LearningObject.LOId=HasLO.LOId  "
                       "join SubComponent on SubComponent.SubComponentId = HasLO.SubComponentId  "
                       "where LearningObject.LOId=?"
                       , (lo_id))
    result = result.fetchall()
    row_headers = [x[0] for x in c.description]
    response['SubComponent'] = []
    for x in result:
        response['SubComponent'].append(dict(zip(row_headers, x)))

    # Get Component
    result = c.execute("select distinct Component.ComponentId, Component.ComponentName from LearningObject "
                       "join HasLO on LearningObject.LOId=HasLO.LOId  "
                       "join SubComponent on SubComponent.SubComponentId = HasLO.SubComponentId  "
                       " join Component on Component.ComponentId=SubComponent.ComponentId  "
                       "where LearningObject.LOId=?"
                       , (lo_id))
    result = result.fetchall()
    row_headers = [x[0] for x in c.description]
    response['Component'] = []
    for x in result:
        response['Component'].append(dict(zip(row_headers, x)))

    # Get Courses
    result = c.execute("select DISTINCT Course.CourseId, Course.Term, Course.CourseName, Course.CourseCode, "
                       "Course.Year, Course.Duration, Course.Type from LearningObject "
                       "join HasLO on LearningObject.LOId=HasLO.LOId  "
                       "join SubComponent on SubComponent.SubComponentId = HasLO.SubComponentId  "
                       "join Component on Component.ComponentId=SubComponent.ComponentId  "
                       "join Course on Course.CourseId=Component.CourseId  "
                       "where LearningObject.LOId=?"
                       , (lo_id))
    result = result.fetchall()
    row_headers = [x[0] for x in c.description]
    response['Course'] = []
    for x in result:
        response['Course'].append(dict(zip(row_headers, x)))

    c.close()
    return response


def get_course_and_associated_details_from_db(course_id):
    """
    Given course id

    :return:
        a list of dictionary
        which contains learning object details and course associated with it
    """
    course_id = str(course_id)
    conn, c = db_init()

    # Get Course
    result = c.execute("select * from Course "
                       "where Course.CourseId=?", (course_id, ))

    result = result.fetchone()
    row_headers = [x[0] for x in c.description]
    response = dict(zip(row_headers, result))

    # Get Component
    result = c.execute("select ComponentId, ComponentName from Course "
                       "join Component on Course.CourseId = Component.CourseId "
                       "where Course.CourseId=?"
                       , (course_id))
    result = result.fetchall()
    row_headers = [x[0] for x in c.description]
    response['Component'] = []
    for x in result:
        response['Component'].append(dict(zip(row_headers, x)))


    # Get SubComponent
    result = c.execute("select SubComponentId, SubComponentName, Component.ComponentId from Course "
                       "join Component on Course.CourseId = Component.CourseId "
                       "join SubComponent on SubComponent.ComponentId = Component.ComponentId "
                       "where Course.CourseId=?"
                       , (course_id))
    result = result.fetchall()
    row_headers = [x[0] for x in c.description]

    response['SubComponent'] = []
    for x in result:
        response['SubComponent'].append(dict(zip(row_headers, x)))

    # Get SubComponentName
    result = c.execute("select Distinct(SubComponentName) from Course "
                       "join Component on Course.CourseId = Component.CourseId "
                       "join SubComponent on SubComponent.ComponentId = Component.ComponentId "
                       "where Course.CourseId=?"
                       , (course_id))
    result = result.fetchall()
    row_headers = [x[0] for x in c.description]

    response['SubComponentName'] = []
    for x in result:
        response['SubComponentName'].append(dict(zip(row_headers, x)))


    # Get Learning Objects
    result = c.execute("select DISTINCT(LearningObject.LOId),  title, Week, HasLO.SubComponentId from Course "
                       "join Component on Course.CourseId = Component.CourseId "
                       "join SubComponent on SubComponent.ComponentId = Component.ComponentId "
                       "join HasLO on SubComponent.SubComponentId=HasLO.SubComponentId "
                       "join LearningObject on LearningObject.LOId = HasLO.LOId "
                       "where Course.CourseId=?"
                       , (course_id))
    result = result.fetchall()
    row_headers = [x[0] for x in c.description]

    response['LearningObject'] = []
    for x in result:
        response['LearningObject'].append(dict(zip(row_headers, x)))


    # Get All
    result = c.execute("select * from Course "
                       "join Component on Course.CourseId = Component.CourseId "
                       "join SubComponent on SubComponent.ComponentId = Component.ComponentId "
                       "join HasLO on SubComponent.SubComponentId=HasLO.SubComponentId "
                       "join LearningObject on LearningObject.LOId = HasLO.LOId "
                       "where Course.CourseId=?"
                       , (course_id))

    result = result.fetchall()
    row_headers = [x[0] for x in c.description]
    response['AllData'] = []
    for row in result:
        response['AllData'].append(dict(zip(row_headers, row)))


    c.close()
    return response




def get_all_course():
    conn, c = db_init()
    result = c.execute("select * from Course")
    result = result.fetchall()
    json_data = []
    row_headers = [x[0] for x in c.description]

    for row in result:
        print(row)
        json_data.append(dict(zip(row_headers, row)))

    c.close()

    return json_data


def get_all_lo():
    conn, c = db_init()
    result = c.execute("select * from LearningObject")
    result = result.fetchall()
    json_data = []
    row_headers = [x[0] for x in c.description]

    for row in result:
        print(row)
        json_data.append(dict(zip(row_headers, row)))

    c.close()
    return json_data

def max_lo_id():
    conn, c = db_init()

    result = c.execute("select max(LOid) from LearningObject")
    result = result.fetchone()
    c.close()
    if result[0] is None:
        return 0
    return result[0]

def max_course_id():
    conn, c = db_init()
    result = c.execute("select max(CourseId) from Course")
    result = result.fetchone()
    c.close()
    print(result[0])
    if result[0] is None:
        return 0
    return result[0]


def max_component_id():
    conn, c = db_init()

    result = c.execute("select max(ComponentId) from Component")
    result = result.fetchone()
    c.close()
    if result[0] is None:
        return 0
    return result[0]

def insert_lo_into_database(lo_name, file_type, save_filepath, upload_time, contact_details):
    try:
        # print(lo_name, file_type, save_filepath)
        conn, c = db_init()
        c.execute("insert into LearningObject (title, documentType, uploadDate, FilePath, ContactUser) VALUES (?, ?, ?, ?, ?)",
                       (lo_name, file_type, upload_time, save_filepath, contact_details))
        conn.commit()

        c.close()
    except sqlite3.Error as error:
        print("Failed to insert Python variable into sqlite table", error)

def insert_course_into_database(course_code, course_name, course_term, course_year,
                                course_type, course_duration, course_los, course_component, is_imported):
    course_id = max_course_id() + 1
    print(course_id)
    try:
        conn, c = db_init()

        c.execute("insert into Course (CourseId, CourseCode, CourseName, Term, Year, Duration, Type, isImported) VALUES (?, ?,?,?,?,?,?,?)",
                  (course_id, course_code, course_name, course_term, course_year, course_duration, course_type, is_imported))
        conn.commit()

        for component in course_component:
            component_id = max_component_id() + 1
            component_name = component['name']
            c.execute("insert into Component (ComponentId, ComponentName, CourseId) VALUES (?,?,?)", (component_id, component_name, course_id))
            for sub_component in component['subComponent']:
                c.execute("insert into SubComponent (SubComponentName, ComponentId) VALUES (?, ?)", (sub_component, component_id))
            conn.commit()
        for week in course_los:
            print(week)
            print(course_los[week])
            for component in course_los[week]:
                print(component)
                for sub_component in course_los[week][component]:
                    print(sub_component)
                    for learning_object in course_los[week][component][sub_component]:
                        component_id = get_comp_id(component, course_id)
                        sub_component_id = get_sub_id(component_id, sub_component)
                        print("before execution", learning_object, sub_component_id, week)
                        c.execute("insert into HasLO (LOId, SubComponentId, Week) VALUES (?,?,?)",
                                  (learning_object, sub_component_id, week))
                        conn.commit()

        c.close()
    except sqlite3.Error as error:
        print("Failed to insert Python variable into sqlite table", error)

def insert_sub_pages_into_database(lo_id, page_no):
    """ return inserted id from database
    """

    try:
        conn, c = db_init()

        c.execute("insert into Subpage (LOId, PageNumber) VALUES (?, ?) ", (lo_id, page_no))
        conn.commit()
        row_id = c.lastrowid
        c.close()

        return row_id
    except sqlite3.Error as error:
        print("Failed to insert Python variable into sqlite table", error)


def insert_imported_course_into_database(course_code, course_name, course_term, course_year, course_duration, course_type, is_imported):
    course_id = max_course_id() + 1
    print(course_id)
    try:
        conn, c = db_init()

        c.execute(
            "insert into Course (CourseId, CourseCode, CourseName, Term, Year, Duration, Type, isImported) VALUES (?, ?,?,?,?,?,?,?)",
            (course_id, course_code, course_name, course_term, course_year, course_duration, course_type, is_imported))
        conn.commit()
        c.close()
    except sqlite3.Error as error:
        print("Failed to insert Python variable into sqlite table", error)

def insert_sm_lo_into_database(lo_id, other_lo_id, score):
    try:
        conn, c = db_init()
        c.execute(
            "insert into SimilarLO (LoId, SimilarLO, Score) VALUES (?,?,?)",
            (lo_id, other_lo_id, score)
        )

        conn.commit()
        c.close()
    except sqlite3.Error as error:
        print("Failed to insert Python variable into sqlite table", error)


def get_comp_id(component_name, course_id):
    """ Gets Component id"""
    conn, c = db_init()
    c.execute("select ComponentId from Component where ComponentName=? and CourseId=?", (component_name, course_id))
    result = c.fetchone()
    c.close()
    return result[0]

def get_sub_id(component_id, sub_component_name):
    """ Gets sub_component id"""
    conn, c = db_init()
    c.execute("select SubComponentId from SubComponent where SubComponentName=? and ComponentId=?", (sub_component_name, component_id))
    result = c.fetchone()
    c.close()
    return result[0]

def get_is_imported(course_id):
    conn, c = db_init()
    c.execute("select isImported from Course where CourseId=?", (course_id))
    result = c.fetchone()
    c.close()
    return result[0]
