from owlready2 import *
import sqlite3

database = "LOdatabase.db"

# onto = get_ontology("file://./skos_knowledge.owl").load()


def insert_ontology(individual, document_id, ontology_file, concept_class='Concept'):
	"""Insert new ontology into owl file

	Replaces old document id if exist.

	Parameter:
		individual -- instances of owl
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


def retrieve_file(document_id):
	"""Retrives file path using document_id from the database

	Parameter:
		document_id -- document primary key from database

	:return:
		the file path to the file
	"""
	conn = sqlite3.connect(database)
	c = conn.cursor()
	c.execute(
		'Select FilePath FROM Learning_Object where id=document_id'
	)

	row = c.fetchone()
	c.close()

	return row



# TODO Might Optimise for Batch file retrieval from database
