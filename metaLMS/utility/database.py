import sqlite3

db_path = '/Users/wilson/PycharmProjects/COMP4952/metaLMS/utility/LOdatabase.db'



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


def get_db_concept_and_course(id):
    """
    Given conceptid Id

    :return:
        a list of dictionary
        which contains learning object details and course associated with it
    """
    conn, c = db_init()
    result = c.execute("select distinct * from LearningObject as lo join course as c WHERE LOId=? and Course=c.CourseId", (str(id)))

    result = result.fetchone()
    row_headers = [x[0] for x in c.description]
    json_data = []
    json_data.append(dict(zip(row_headers, result)))

    c.close()
    return json_data


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

def insert_lo_into_database(lo_name, file_type, save_filepath, upload_time):
    try:
        print(lo_name, file_type, save_filepath)
        conn, c = db_init()
        c.execute("insert into LearningObject (title, documentType, uploadDate, FilePath) VALUES (?, ?, ?, ?)",
                       (lo_name, file_type, upload_time, save_filepath))
        conn.commit()

        c.close()
    except sqlite3.Error as error:
        print("Failed to insert Python variable into sqlite table", error)

def insert_course_into_database(course_code, course_name, course_term, course_year,
                                course_type, course_duration, course_los, course_component):
    course_id = max_course_id() + 1
    print(course_id)
    try:
        conn, c = db_init()

        c.execute("insert into Course (CourseId, CourseCode, CourseName, Term, Year, Duration, Type) VALUES (?, ?,?,?,?,?,?)",
                  (course_id, course_code, course_name, course_term, course_year, course_duration, course_type))
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

def get_comp_id(component_name, course_id):
    conn, c = db_init()
    c.execute("select ComponentId from Component where ComponentName=? and CourseId=?", (component_name, course_id))
    result = c.fetchone()
    c.close()
    return result[0]

def get_sub_id(component_id, sub_component_name):
    conn, c = db_init()
    c.execute("select SubComponentId from SubComponent where SubComponentName=? and ComponentId=?", (sub_component_name, component_id))
    result = c.fetchone()
    c.close()
    return result[0]
