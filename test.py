import PyPDF2
from metaLMS.utility.utility import *
from metaLMS.utility.database import *

filepath = "file://./owl/1511_skos_knowledge.owl"
# filepath = "file://./testskos.owl"


# insert_ontology("test", "1", filepath)
# print(get_annotation(filepath, "ConceptC_Program"))
# print(get_scheme(filepath, "ConceptFloat"))
# print(get_scheme(filepath, "ConcepteC_Program"))
# print(get_relationships(filepath, "Concept"))
# print(get_relationships(filepath, "ConceptAssignment"))
# print(get_all_concepts(filepath))
# print(get_individual_doc_id(filepath, "C_Programming_Language"))
# print(get_instances(filepath, "ConceptC_Program"))
# instances = get_instances(filepath, "ConceptC_Program")
# print(get_concept_detail_for_frontend(filepath, "ConceptC_Program"))
# print(get_annotation(filepath, "ConceptC_Program"))
# print(get_db_concept_and_course(1))

# print(get_all_course())

# print(get_all_lo())
# conceptData = {'conceptName': 'Test Title', 'comment': 'Some Comments', 'prefLabel': 'PREF TEST', 'hiddenLabel': 'HIDDEN TEST',
#                'altLabel': 'ALT TEST', 'schemeName': 'Type', 'schemeConcepts': ['Operator', 'Computer'], 'schemeMode': '3',
#                'relationship': [{'semanticRelation': 'broadMatch', 'concepts': ['Comment', 'Operator']}, {'semanticRelation': 'broadMatch',
#                                                                                                           'concepts': ['Comment', 'Operator']}]}

# conceptData = {'conceptName': 'Test Title', 'comment': 'Comments', 'prefLabel': 'DFE', 'hiddenLabel': 'ASDE', 'altLabel': 'ASDE', 'schemeName': '', 'schemeConcepts': ['Algorithm'], 'schemeMode': '2', 'relationship': [{'semanticRelation': 'closeMatch', 'concepts': ['C_Program']}]}

# handle_post_concept(filepath, conceptData)

# import datetime
#
# print(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
#
# print(datetime.datetime.now().timestamp())


courseData = {'courseCode': 'TestCourseCode',
              'courseName': 'TestCourseName',
              'courseTerm': '1',
              'courseYear': '2020',
              'courseType': 'DLV',
              'courseComponent': [{'name': 'Lecture',
                                   'subComponent': ['Slides', 'Code', 'Mics']},
                                  {'name': 'Test',
                                   'subComponent': ['Coding', 'Written', 'Mics']}],
              'courseDuration': '2',
              'courseLOs': {'1': {'Lecture': {'Slides': [1], 'Code': [1], 'Mics': [1]},
                                  'Test': {'Coding': [1], 'Written': [1,2], 'Mics': []}},
                            '2': {'Lecture': {'Slides': [], 'Code': [], 'Mics': []},
                                  'Test': {'Coding': [], 'Written': [], 'Mics': []}}}}



handle_post_course(filepath, courseData)

# print(get_sub_id("Lecture", 4))

# print(get_dependency(filepath, "ConceptSomething_Test"))