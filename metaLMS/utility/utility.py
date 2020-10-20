"""
This file contains utility function for the project
It mostly provides ways to intereact with owl/rdf file
"""
from owlready2 import *

from .database import *

database = "LOdatabase.db"
possible_annotations = [
    'altLabel',
    'hiddenLabel',
    'prefLabel',
    'comment',
]


# TODO ALL functions Need to handle error properly Like empty cases!

# def insert_ontology(individual, document_id, ontology_file, concept_class='Concept'):
#     """
#     :param individual:
#     :param document_id:
#     :param ontology_file:
#     :param concept_class:
#     :return:
#     """
#     """Insert new ontology into owl file
#
#     Replaces old document id if exist.
#
#     Parameter:
#         individual -- instances name
#         document_id -- Document primary key from database
#         ontology_file -- filepath to owl file
#         concept_class -- type of class it insert (Default = Concept)
#
#     """
#
#     onto = get_ontology(ontology_file).load()
#
#     with onto:
#         class documentId(comment):
#             pass
#
#     new_instance = onto[concept_class](individual)
#     new_instance.documentId = document_id
#
#     # For now save into a new file called "testskos.owl" in the directory
#     # TODO Remove This when in production
#     onto.save(file="testskos.owl", format="rdfxml")


def insert_new_concept(ontology_file, name, altLabel, hiddenLabel, prefLabel, comment, dependency):
    """
    insert concept into owl file

    :param ontology_file: string - ontology_savefile
    :param name: string - name of concept
    :param altLabel: string - alt annotation
    :param hiddenLabel: string - hidden annotation
    :param prefLabel: string - pref annotation
    :param comment: string - user defined annotation
    :param dependency: string - concepts required
    :return:
    """

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
    """
    gets all required dependency for the concept_name
    :param ontology_file:
    :param concept_name: string - concept name
    :return:
    """
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


def get_instances(ontology_file, concept):
    """
    Get all individual/instances from this concept_class
    :param ontology_file:
    :param concept_class: string - name of concept, must have Concept prefix
    :return:
    """
    concept = "Concept" + concept
    onto = get_ontology(ontology_file).load()
    return onto[concept].instances()


def get_all_concepts(ontology_file):
    """
    Get all concepts exists in ontology file
    :param ontology_file:
    :return:
        list of string - return a list of all concept names exist in ontology_file
    """
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


def get_concept_annotation(ontology_file, concept):
    """
    Get all the details regarding an ontology into owl file
    :param ontology_file:
    :param concept: string - concept name
    :return:
        dict of list - returns a dict of list of annotations
    """

    result = {}
    onto = get_ontology(ontology_file).load()

    # Harded Coded as Libary still have no support for dot notation alternatives
    comment = onto[concept].comment
    altLabel = onto[concept].altLabel
    prefLabel = onto[concept].prefLabel
    hiddenLabel = onto[concept].hiddenLabel

    result['comment'] = comment
    result['altLabel'] = altLabel
    result['prefLabel'] = prefLabel
    result['hiddenLabel'] = hiddenLabel

    return result


def get_scheme(ontology_file, concept):
    """
    Get all the details regarding an ontology into owl file
        Assume that there are only unique scheme for a concept

    :param ontology_file:
    :param concept: string - concept name
    :return:
    """

    try:
        onto = get_ontology(ontology_file).load()
        concept_base = concept.replace("Concept", "")
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
    """
    Get document id of the instance/individual

    :param ontology_file:
    :param individual: instance/individual name
    :return:
    """
    onto = get_ontology(ontology_file).load()
    test = onto[individual].documentId
    return test[0]


def get_relationships(ontology_file, concept):
    """
    Get all the relationship that is associated with this concept
    :param ontology_file:
    :param concept_class:
    :return:
    """

    onto = get_ontology(ontology_file).load()
    relationships = onto[concept].is_a
    result = []
    for i in relationships:
        i = str(i).split('.')
        if i[1] == 'Concept':
            continue
        relation = i[1]
        conc = i[3]
        temp = {}
        temp[relation] = conc.replace(")", "")
        result.append(temp)
    return result


def get_all_relationships(ontology_file):
    """
    Get all relationship exist in ontology file
    :param ontology_file:
    :return:
    """
    concept_list = get_all_concepts(ontology_file)
    relationship_list = []
    for i in concept_list:
        concept = "Concept" + i
        relationships = get_relationships(ontology_file, concept)
        for relationship in relationships:
            for semantic_relation in relationship:
                relationship_list.append({"from": i,
                                          "to": relationship[semantic_relation],
                                          "text": semantic_relation})

    return relationship_list


def get_all_scheme(ontology_file):
    """
    Get all scheme exist in the ontology
    :param ontology_file:
    :return:
    """
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


# def check_ontology(ontology_file):
#     """
#     Get all the details regarding an ontology into owl file
#
#     """
#
#     onto = get_ontology(ontology_file).load()
#     test = onto['ConceptC_Program'].instances()
#     print(test)
#     # for i in onto['ConceptC_Program'].direct_instances(): print(i)
#     # print(onto['ConceptC_Program'].subclasses())
#     # indi = onto['C_Programming_Language']
#     # print(onto.search(Types = "Concept"))
#
#     # ontoObject = onto.individuals()
#     # print(list(ontoObject))
#     # objs = list(ontoObject)
#     # print(objs)
#     # for obj in onto.individuals():
#     #     print(obj)
#     #     if instance(obj, some_class):
#     # 	    do_something(obj)




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
