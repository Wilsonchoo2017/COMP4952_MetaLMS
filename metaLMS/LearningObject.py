from datetime import datetime
from base64 import b64decode
from .utility.database import *
from metaLMS.onto_utils import append_concept_lo


def handle_post_lo(filepath, data):
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

    # Update Concepts in Ontology with this LO
    lo_details = {"lo_id": curr_id, "lo_name": lo_name}
    for concept in related_concepts:
        print(concept)
        print(lo_details)
        print(filepath)
        append_concept_lo(filepath, 'Concept' + concept, lo_details)

    return 0


def get_lo_detail_for_frontend(lo_id):
    """
    Get all details needed for frontend lo details

    TODO for now it only pulls from database. use get_annotation to pull details from ontoloy
    TODO in the future this could be optimised
    :param filepath: ontology file path
    :return:
        non-duplicated list
    """
    # Get Information from Database
    result = get_learning_object_and_associated_details_from_db(lo_id)


    return result
