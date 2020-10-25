"""
Reference: Getting Started Rustic Software SCORM cloud
"""
import rustici_software_cloud_v2 as scorm_cloud
from datetime import datetime, timedelta


# todo change into class
# Configure HTTP basic authorization: APP_NORMAL
scorm_cloud.configuration.username = 'QKZXU3B8GG'
scorm_cloud.configuration.password = 'ro5L12Dq1bw8oDi5Z7P9yK5nbIJLCzOduu0mAJBM'


# Then (optionally) further authenticate via Oauth2 token access
app_management_api = scorm_cloud.ApplicationManagementApi()

# get Oauth2 token with a life of 60 minutes and with permission to read the registrations api
token_request = {
# the expiry expected for token request must be in ISO-8601 format
    'expiry': (datetime.utcnow() + timedelta(minutes=60)).isoformat() + 'Z',
    'permissions': scorm_cloud.PermissionsSchema(['write', 'read'])
}
response = app_management_api.create_token(token_request)

# further calls with this configuration will use Oauth2
scorm_cloud.configuration.access_token = response.result


# import Course
# Use CreateFetchAndImportCourseJob or CreateUploadAndImportCourseJob
import shutil

# creating registration
course_api = scorm_cloud.CourseApi()


# TODO Error Handling
def upload_course(filepath):
    job_status = course_api.create_upload_and_import_course_job("1", file=filepath)
    return job_status

def check_job_status(job_id):
    response = course_api.get_import_job_status(job_id)
    return response

def get_course_detail_from_scorm(course_id):
    response = course_api.get_course(course_id)
    return response


