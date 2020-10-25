from .utility.utility import *

def handle_post_concept(ontology_file, conceptJson):
    """
    :param conceptJson:
    :return:
    """
    conceptJson['conceptName'] = conceptJson['conceptName'].replace(" ", "_")

    insert_new_concept(ontology_file, conceptJson['conceptName'], conceptJson['altLabel'],
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

def get_concept_detail_for_frontend(filepath, concept):
    """
    Get all details needed for frontend concept details

    TODO for now it only pulls from database. use get_annotation to pull details from ontoloy
    TODO in the future this could be optimised
    :param filepath: ontology file path
    :return:
        non-duplicated list
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
            result = result + get_learning_object_and_associated_details_from_db(id)
        else:
            check_dup.add(id)
    return result
