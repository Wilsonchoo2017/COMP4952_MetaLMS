from datetime import datetime
from base64 import b64decode
from collections import Counter
from .ssm import ssm_list_query
from .utility.database import *
from metaLMS.onto_utils import append_concept_lo, get_cso_concepts_with_this_lo, get_concept_with_this_lo
from .utility.FileHandler import *


def handle_post_lo(filepath, data):
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    lo_name = data['loName']
    related_concepts = data['concepts']
    uploaded_file_name = data['fileName']
    contact_details = data['contact']
    file_type = data['type']
    file = data['file']
    if file_type == '':
        file_type = "UNK"



    # Get current maximum LO Id
    curr_id = max_lo_id() + 1
    save_filepath = 'LearningObject/' + str(curr_id)


    # Insert data base of LO
    insert_lo_into_database(lo_name, file_type, save_filepath, now, contact_details)



    # Insert file path
    file = file.split(",")[1]
    file_bytes = b64decode(file, validate=True)

    # Save Files into Server
    f = open(save_filepath, 'wb')
    f.write(file_bytes)
    f.close()


    # Analyse File
    subpages_semantics = None
    if file_type == "application/pdf":
        subpages_semantics  = process_pdf_file(lo_name, file_bytes) # save sub pages as well
        print(subpages_semantics)
        # Save Sub Pages into database
        for key in subpages_semantics:
            page_no = key
            print("page_no", page_no)
            subpage_id = insert_sub_pages_into_database(curr_id, page_no)
            print("subpage id", subpage_id)
            subpages_semantics[key]['subpage_id'] = subpage_id

    print("modfied", subpages_semantics)
    # Update Concepts in Ontology with this LO
    lo_details = {"lo_id": curr_id, "lo_name": lo_name}
    for concept in related_concepts:
        append_concept_lo(filepath, 'Concept' + concept, lo_details, subpages_semantics)


    return 0


def get_lo_detail_for_frontend(filepath, lo_id):
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

    # Get Cso Concepts from ontology
    result['csoConcepts'] = get_cso_concepts_with_this_lo(filepath, lo_id)

    return result

def compute_two_lo_ssm(lo_id_a, lo_id_b):
    filepath = "owl/ontology.owl"
    ontology_file = filepath

    # Get concepts for lo id a
    base_concepts_a = get_concept_with_this_lo(ontology_file, [lo_id_a])
    cso_concepts_a = set()
    for i in get_cso_concepts_with_this_lo(ontology_file, lo_id_a):
        for concept in i['concepts']:
            cso_concepts_a.add(concept)

    # Get concepts for lo id b
    base_concepts_b = get_concept_with_this_lo(ontology_file, [lo_id_b])
    cso_concepts_b = set()
    for i in get_cso_concepts_with_this_lo(ontology_file, lo_id_b):
        for concept in i['concepts']:
            cso_concepts_b.add(concept)

    cso_concepts_a = list(cso_concepts_a)
    cso_concepts_b = list(cso_concepts_b)

    print("base concept a", base_concepts_a)
    print("base concept b", base_concepts_b)
    print("cso concept b", cso_concepts_a)
    print("cso concept b", cso_concepts_b)


    exact_weight = 0.8
    close_weight = 0.5
    broad_weight = 0.3
    narrow_weight = 0.1

    # use ssm multiple from ssm to compute
    exact_score = ssm_list_query(base_concepts_a, base_concepts_b, "exactMatch") * exact_weight
    narrow_score = ssm_list_query(base_concepts_a, base_concepts_b, "narrowMatch") * narrow_weight
    broad_score = ssm_list_query(base_concepts_a, base_concepts_b, "broadMatch") * broad_weight
    close_score = ssm_list_query(base_concepts_a, base_concepts_b, "closeMatch") * close_weight
    cso_score = ssm_list_query(cso_concepts_a, cso_concepts_b, "cso")


    base_score = exact_score + narrow_score + broad_score + close_score
    cso_weight = 0.5
    base_weight = 0.5
    penalty = 0

    score = base_weight * base_score + cso_weight * cso_score + penalty
    return score

def get_3_similar_lo(lo_id):
    """ Not Implemented in the front end"""
    # Get Concepts for lo_id
    ontology_file = "owl/"

    # get all lo
    lo = get_all_lo()
    list_of_lo = []
    for keys in lo:
        list_of_lo.append(lo[keys]['LoId'])

    scoreboard = {}
    # Unoptimised performance. But works
    for other_lo_id in list_of_lo:
        score = compute_two_lo_ssm(lo_id, other_lo_id)
        scoreboard[other_lo_id] = score

    k = Counter(scoreboard)

    top_3 = k.most_common(3)

    for i in top_3:
        insert_course_into_database(lo_id, i[0], i[1])




