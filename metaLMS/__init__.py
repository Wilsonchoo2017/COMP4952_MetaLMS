import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from .utility import *
from metaLMS.utility.utility import *


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        # DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    cors = CORS(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    filepath = "file://./owl/1511_skos_knowledge.owl"

    @app.route('/concept')
    def concept():
        return jsonify(get_all_concepts(filepath))

    @app.route('/course')
    def course():
        return jsonify(get_all_course())

    @app.route('/lo')
    def lo():
        return jsonify(get_all_lo())

    @app.route('/concept-scheme')
    def get_concept_scheme():
        return jsonify(get_all_scheme(filepath))

    @app.route('/concept-detail/<concept>')
    def concept_detail(concept):
        concept = "Concept" + concept
        return jsonify(get_concept_detail_for_frontend(filepath, concept))

    @app.route('/dependency/<concept>')
    def concept_dependency(concept):
        concept = "Concept" + concept
        return jsonify(get_dependency(filepath, concept))

    @app.route('/concept-annotation/<concept>')
    def concept_annotation(concept):
        concept = "Concept" + concept
        return jsonify(get_annotation(filepath, concept))

    @app.route('/concept-relationship/<concept>')
    def concept_relation(concept):
        concept = "Concept" + concept
        return jsonify(get_relationships(filepath, concept))


    @app.route('/concept-all-relationship')
    def concept_all_relationship():
        return jsonify(get_all_relationships(filepath))


    @app.route('/concept-scheme/<concept>')
    def concept_scheme(concept):
        concept = "Concept" + concept
        return jsonify(get_scheme(filepath, concept))

    @app.route('/new-concept', methods=['POST'])
    def new_concept():
        if request.method == 'GET':
            pass
        else:
            print(request.json)
            handle_post_concept(filepath, request.json)
            return "1"

    @app.route('/new-lo', methods=['POST'])
    def new_lo():
        handle_post_lo(request.json)
        return "1"

    @app.route('/new-course', methods=['POST'])
    def new_course():
        handle_post_course(filepath, request.json)
        return "1"

    @app.route('/import-course', methods=['POST'])
    def import_course():
        handle_import_course(filepath, request.json)
        return "1"

    return app
