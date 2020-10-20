from datetime import datetime
from base64 import b64decode

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