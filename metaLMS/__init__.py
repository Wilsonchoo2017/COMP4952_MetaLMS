from flask import Flask, jsonify, request, redirect, Response
from flask_cors import CORS

from metaLMS.Concept import *
from metaLMS.Course import *
from metaLMS.LearningObject import *
from metaLMS.onto_utils import *



filepath = "owl/ontology.owl"

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


    #### Concept Methods ####

    @app.route('/concept')
    def concept():
        return jsonify(get_all_concepts(filepath))

    @app.route('/concept-scheme')
    def get_concept_scheme():
        return jsonify(get_all_scheme(filepath))

    @app.route('/concept-detail/<concept>')
    def concept_detail(concept):
        return jsonify(get_concept_detail_for_frontend(filepath, concept))


    @app.route('/dependency/')
    def concept_dependency():
        concepts = request.args.getlist("concepts")
        result = []
        print("sendData", concepts)
        for concept in concepts:
            concept = "Concept" + concept
            print("inputconcept:", concept)
            result = result + get_dependency(filepath, concept)
        print("result dep", result)
        return jsonify(result)

    @app.route('/concept-annotation/<concept>')
    def concept_annotation(concept):
        concept = "Concept" + concept
        return jsonify(get_concept_annotation(filepath, concept))

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

    #### Course Methods ####

    @app.route('/course')
    def course():
        return jsonify(get_all_course())

    @app.route('/new-course', methods=['POST'])
    def new_course():
        print(request.json)
        handle_post_course(filepath, request.json)
        return "1"

    @app.route('/import-course', methods=['POST'])
    def import_course():
        # handle_import_course(filepath, request.json)
        return "1"

    @app.route('/course-detail/<course>')
    def course_detail(course):
        if course == "":
            return jsonify(None)
        return jsonify(get_course_detail(course))

    @app.route('/check-is-imported-course-detail/<course>')
    def check_is_imported_course(course):
        return jsonify(get_is_imported(course))


    @app.route('/compare-two-course-similarity/', methods=['GET'])
    def compare_two_course():
        print(request.args)
        course_a = request.args.getlist("courseA")[0]
        course_b = request.args.getlist("courseB")[0]
        print(course_a)
        print(course_b)

        course_score, course_a_score, course_b_score = get_ssm_of_two_courses(course_a, course_b)
        return jsonify({'courseScore': course_score, 'courseAScore': course_a_score, 'courseBScore': course_b_score})

    #### Learning Object Methods ####
    @app.route('/lo')
    def lo():
        return jsonify(get_all_lo())

    @app.route('/lo-concept-detail/', methods=['GET'])
    def lo_concept_detail():
        return jsonify(get_concept_with_this_lo(filepath, request.args.getlist("loId")))

    @app.route('/lo-detail/<lo>')
    def lo_detail(lo):
        return jsonify(get_lo_detail_for_frontend(filepath, lo))

    @app.route('/new-lo', methods=['POST'])
    def new_lo():
        # print('data', request.json)
        handle_post_lo(filepath, request.json)
        return Response("{'a':'b'}", status=200, mimetype='application/json')

    return app
