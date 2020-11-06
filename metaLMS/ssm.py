import ssmpy



filepath = "owl/ontology.owl"

file_path_exact =  "/metaLMS/db/skosExact.db"
file_path_narrow =  "/metaLMS/db/skosNarrow.db"
file_path_broad =  "/metaLMS/db/skosBroad.db"
file_path_close =  "/metaLMS/db/skosClose.db"
file_path_cso =  "/metaLMS/db/csoSTO.db"


def pre_compute_semantic_similarity():
    ssmpy.create_semantic_base("../" + filepath,
                               "metaLMS/db/skosExact.db",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#Concept",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#exactmatch",
                               '')


    ssmpy.create_semantic_base("../" + filepath,
                                "metaLMS/db/skosClose.db",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#Concept",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#closematch",
                               '')


    ssmpy.create_semantic_base("../" + filepath,
                               "db/skosBroad.db",
                                "metaLMS/db/skosBroad.db",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#Concept",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#broadmatch",
                               '')

    ssmpy.create_semantic_base("../" + filepath,
                               "metaLMS/db/skosNarrow.db",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#Concept",
                               "http://www.skosknowledge.com/ontologies/owl/owl/ontology.owl#narrowmatch",
                               '')


# ssmpy.create_semantic_base("../owl/CSO.3.2.owl",
#                            "metaLMS/db/csoSTO.db",
#                            "https://cso.kmi.open.ac.uk/topics/",
#                            "http://cso.kmi.open.ac.uk/schema/cso#superTopicOf",
#                            '')


def get_ssm_file(type):
    if type == 'exactMatch':
        semantic_db = file_path_exact
    elif type == 'narrowMatch':
        semantic_db = file_path_narrow
    elif type == 'broadMatch':
        semantic_db = file_path_broad
    elif type == 'closeMatch':
        semantic_db = file_path_close
    else:
        semantic_db = file_path_cso

    return semantic_db


def ssm_query(term1, term2, type):
    semantic_db = get_ssm_file(type)
    ssmpy.semantic_base(semantic_db)
    el1 = get_id(term1, type)
    el2 = get_id(term2, type)
    ssm = ssmpy.ssm_resnik(el1, el2)
    return ssm

def ssm_list_query(list_of_term_a, list_of_term_b, type):

    semantic_db = get_ssm_file(type)
    print("semanticdb: ", semantic_db)
    print("type: ", type)
    ssmpy.semantic_base(semantic_db)
    list_a = set()
    list_b = set()
    for i in list_of_term_a:
        semantic_id = get_id(i, type)
        if semantic_id != '':
            list_a.add(semantic_id)

    for i in list_of_term_b:
        semantic_id = get_id(i, type)
        if semantic_id != '':
            list_b.add(semantic_id)

    list_a = list(list_a)
    list_b = list(list_b)
    print("found list a in semdb", list_a)
    print("found list b in semdb", list_b)
    print("list of terms a", list_of_term_a)
    print("list of terms a", list_of_term_b)
    if len(list_a) != 0 and len(list_b) != 0 :
        return ssmpy.ssm_multiple(ssmpy.ssm_resnik, list_a, list_b)
    else:
        return 0




def get_id(term, type):
    semantic_db = get_ssm_file(type)
    ssmpy.semantic_base(semantic_db)
    query = "SELECT id FROM entry WHERE name like ? order by length(?) - length(replace(?, '%', ''))"

    query_term = "%" + term + "%"
    res = ssmpy.run_query(query, (query_term, query_term, query_term,)).fetchone()
    if res != None:
        res = res[0]
        el = ssmpy.get_id(ssmpy.get_name(res))
        return el
    else:
        return ''
