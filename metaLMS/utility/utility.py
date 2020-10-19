from owlready2 import *
from .database import *
from base64 import b64decode
from datetime import datetime
from .scorm_utils import *

database = "LOdatabase.db"
possible_annotations = [
    'altLabel',
    'hiddenLabel',
    'prefLabel',
    'comment',
]


# onto = get_ontology("file://./skos_knowledge.owl").load()

# TODO ALL functions Need to handle error properly Like empty cases!


def insert_ontology(individual, document_id, ontology_file, concept_class='Concept'):
    """Insert new ontology into owl file

    Replaces old document id if exist.

    Parameter:
        individual -- instances name
        document_id -- Document primary key from database
        ontology_file -- filepath to owl file
        concept_class -- type of class it insert (Default = Concept)

    """

    onto = get_ontology(ontology_file).load()

    with onto:
        class documentId(comment):
            pass

    new_instance = onto[concept_class](individual)
    new_instance.documentId = document_id

    # For now save into a new file called "testskos.owl" in the directory
    # TODO Remove This when in production
    onto.save(file="testskos.owl", format="rdfxml")


def insert_new_ontology(ontology_file, name, altLabel, hiddenLabel, prefLabel, comment, dependency):

    dependency_string = ""
    for i in dependency:
        dependency_string += i
        dependency_string += ','

    # remove last comma
    dependency_string = dependency_string[:-1]

    # add prefix
    name = "Concept" + name
    onto = get_ontology(ontology_file).load()
    with onto:
        class Concept(Thing):
            pass

        my_new_class = types.new_class(name, (Concept,))
        if len(altLabel) > 0:
            my_new_class.altLabel = altLabel
        if len(hiddenLabel) > 0:
            my_new_class.hiddenLabel = hiddenLabel
        if len(prefLabel) > 0:
            my_new_class.prefLabel = prefLabel
        if len(comment) > 0:
            my_new_class.comment = comment
        # Adding dependency in
        if len(dependency) > 0:
            my_new_class.requires = dependency_string


    onto.save(file="testskos.owl", format="rdfxml")

def get_dependency(ontology_file, concept_name):
    try:
        print(concept_name)
        onto = get_ontology(ontology_file).load()
        dependencies = onto[concept_name].requires
        if len(dependencies) == 0:
            return []
        dependencies = dependencies[0].split(",")
        return dependencies

    except (AttributeError):
        return []


def get_instances(ontology_file, concept_class):
    """
    Get all individual/instances from this concept
    :param ontology_file:
    :param concept_class:
    :return:
    """
    onto = get_ontology(ontology_file).load()
    return onto[concept_class].instances()


def get_all_concepts(ontology_file):
    onto = get_ontology(ontology_file).load()
    result = []
    for i in onto.search(iri="*#Concept*"):
        i = str(i)
        i = i.split('.')[1]
        i = i.replace("Concept", "")  # Remove PreFix
        if i != '':  # ignore top level Concept Class
            result.append(i)
    return result


# http://www.skosknowledge.com/ontologies/skos_knowledge.owl#ConceptAssignment


def get_annotation(ontology_file, concept_class):
    """Get all the details regarding an ontology into owl file

        returns a dict of list of annotations

    """
    result = {}
    onto = get_ontology(ontology_file).load()

    # Harded Coded as Libary still have no support for dot notation alternatives
    comment = onto[concept_class].comment
    altLabel = onto[concept_class].altLabel
    prefLabel = onto[concept_class].prefLabel
    hiddenLabel = onto[concept_class].hiddenLabel

    result['comment'] = comment
    result['altLabel'] = altLabel
    result['prefLabel'] = prefLabel
    result['hiddenLabel'] = hiddenLabel

    return result


def get_scheme(ontology_file, concept_class):
    """Get all the details regarding an ontology into owl file

        Assume that there are only unique scheme for a concept
    """
    try:
        onto = get_ontology(ontology_file).load()
        concept_base = concept_class.replace("Concept", "")
        query_concept_string = "Scheme" + concept_base
        # can use the following to check whether something exists prone to a string attacks!
        # print(list(onto[query_concept_string].is_a))
        # print(list(onto.classes()))
        response = onto[query_concept_string].is_a
        result = []
        for i in response:
            i = str(i)
            if "Scheme" not in i:
                continue
            i = i.split('.')[1]
            i = i.replace("Schemes", "")
            if i == "":
                continue
            result.append(i)

        return result
    except (AttributeError):
        return []


def get_individual_doc_id(ontology_file, individual):
    onto = get_ontology(ontology_file).load()
    test = onto[individual].documentId
    return test[0]


def get_relationships(ontology_file, concept_class):
    onto = get_ontology(ontology_file).load()
    relationships = onto[concept_class].is_a
    result = []
    for i in relationships:
        i = str(i).split('.')
        if i[1] == 'Concept':
            continue
        relation = i[1]
        concept = i[3]
        temp = {}
        temp[relation] = concept.replace(")", "")
        result.append(temp)

    return result


def get_all_scheme(ontology_file):
    onto = get_ontology(ontology_file).load()
    response = onto.search(iri="*Schemes*")

    result = []
    for i in response:
        i = str(i)
        if "Schemes" not in i:
            continue
        i = i.split('.')[1]
        i = i.replace("Schemes", "")
        if i == "":
            continue
        result.append(i)

    return result


def check_ontology(ontology_file):
    """Get all the details regarding an ontology into owl file

    """

    onto = get_ontology(ontology_file).load()
    test = onto['ConceptC_Program'].instances()
    print(test)
    # for i in onto['ConceptC_Program'].direct_instances(): print(i)
    # print(onto['ConceptC_Program'].subclasses())
    # indi = onto['C_Programming_Language']
    # print(onto.search(Types = "Concept"))

    # ontoObject = onto.individuals()
    # print(list(ontoObject))
    # objs = list(ontoObject)
    # print(objs)
    # for obj in onto.individuals():
    #     print(obj)
    #     if instance(obj, some_class):
    # 	    do_something(obj)


def get_concept_detail_for_frontend(filepath, concept):
    """
    Get all details needed for frontend

    TODO for now it only pulls from database. use get_annotation to pull details from ontoloy
    TODO in the future this could be optimised
    :param filepath:
    :return:
    """
    instances = get_instances(filepath, concept)

    result = []
    check_dup = set()
    for instance in instances:
        instance = str(instance).split('.')[1]
        print(instance)
        id = get_individual_doc_id(filepath, instance)
        print(id)
        if id not in check_dup:
            result = result + get_db_concept_and_course(id)
        else:
            check_dup.add(id)
    return result


def insert_new_scheme(ontology_file, schemeName, schemeConcept):
    """
    insert new scheme (schemeName)
    and adds all associated concepts inside schemeConcept

    :param ontology_file: string
    :param schemeName: string
    :param schemeConcept: list of strings
    :return:
    """
    onto = get_ontology(ontology_file).load()

    with onto:
        class Schemes(Thing):
            pass

    scheme_name = "Schemes" + schemeName
    my_new_schemes = types.new_class(scheme_name, (Schemes,))

    for subclass_name in schemeConcept:
        search_name = "Concept" + subclass_name
        subclass_name = "Scheme" + subclass_name
        subclass = types.new_class(subclass_name, (my_new_schemes,))
        #     print(onto.search(iri="*" + search_name))
        subclass.equivalent_to.append(onto.search(iri="*" + search_name)[0])
        # Todo, there is a current issue that concept will be inside the scheme.
        # Ignoring for now as no solution is found at the moment

    onto.save(file="testskos.owl", format="rdfxml")


def insert_concept_relationship(ontology_file, concept_A, list_of_conceptB):
    """
    insert concept into list of concepts B

    :param ontology_file:
    :param concept_A:
    :param list_of_conceptB:
    :return:
    """

    onto = get_ontology(ontology_file).load()
    with onto:
        class Concept(Thing):
            pass

        class semanticRelation(ObjectProperty):
            pass

        class mappingRelation(semanticRelation):
            pass

        class broadMatch(mappingRelation):
            pass

        class closeMatch(mappingRelation):
            pass

        class narrowMatch(mappingRelation):
            pass

        class relatedMatch(mappingRelation):
            pass

        class exactMatch(closeMatch):
            pass

        class testRelation(ObjectProperty):
            pass

    concept_A_class = getattr(onto, "Concept" + concept_A)

    for concept_B in list_of_conceptB:
        concept_relation = concept_B['semanticRelation']
        for concept_name in concept_B['concepts']:
            concept_B_class = getattr(onto, "Concept" + concept_name)
            setattr(concept_B_class, concept_relation, concept_A_class)

    onto.save(file="testskos.owl", format="rdfxml")


def append_concept_into_scheme(ontology_file, schemeName, schemeConcept):
    """
    Append scheme Concept into scheme Name
    :param ontology_file:
    :param schemeName:
    :param schemeConcept:
    :return:
    """
    onto = get_ontology(ontology_file).load()
    schemeName = "Schemes" + schemeName
    schemeConcept = "Scheme" + schemeConcept
    print(schemeName)
    print(onto.search(iri="*" + schemeName)[0])
    scheme = onto.search(iri="*" + schemeName)[0]
    # scheme = getattr(onto, schemeName)
    subclass = types.new_class(schemeConcept, (scheme,))

    onto.save(file="testskos.owl", format="rdfxml")




def handle_post_concept(ontology_file, conceptJson):
    conceptJson['conceptName'] = conceptJson['conceptName'].replace(" ", "_")

    insert_new_ontology(ontology_file, conceptJson['conceptName'], conceptJson['altLabel'],
                        conceptJson['hiddenLabel'], conceptJson['prefLabel'], conceptJson['comment'],
                        conceptJson['dependency'])
    insert_concept_relationship(ontology_file, conceptJson['conceptName'], conceptJson['relationship'])



    mode = conceptJson['schemeMode']
    if mode == '2':
        # Create New Scheme
        insert_new_scheme(ontology_file, conceptJson['schemeName'], conceptJson['schemeConcepts'])
    elif mode == '3':
        # Add to Existing Scheme
        append_concept_into_scheme(ontology_file, conceptJson['schemeName'], conceptJson['conceptName'])


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



def handle_post_lo(data):
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    lo_name = data['loName']
    related_concepts = data['concepts']
    uploaded_file_name = data['fileName']
    file_type = data['type']
    if file_type == '':
        file_type = "UNK"

    # Get current maximum LO Id
    curr_id = max_lo_id() + 1
    save_filepath = '/Users/wilson/PycharmProjects/COMP4952/LearningObject/' + str(curr_id)

    # Insert data base of LO
    insert_lo_into_database(lo_name, file_type, save_filepath, now)

    # Insert file path
    file = data['file']
    file = file.split(",")[1]
    bytes = b64decode(file, validate=True)

    f = open(save_filepath, 'wb')
    f.write(bytes)
    f.close()
    return 0
