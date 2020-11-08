import conceptData from "./components/Tables/TableData/conceptData";
const qs = require('qs');
// const API_URL = 'http://3.26.26.205:7777';
const API_URL = 'http://124.168.94.45:7777';
const axios = require('axios').default;

class API {
  static getAllLo() {
    return axios.get(API_URL + '/lo')
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static refreshSemantic() {
    return axios.get(API_URL + '/refresh-semantic')
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  static getAllRelationship() {
    return axios.get(API_URL + '/concept-all-relationship')
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  static getAllConcepts() {
    return axios.get(API_URL + '/concept')
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static getAllCourse() {
    return axios.get(API_URL + '/course')
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  static getDependency(concepts) {
    return axios.get(API_URL + '/dependency/', {
      params: {
        concepts: concepts
      },
      paramsSerializer: params => {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }
    ).then(function (response) {
        console.log(response)
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static getConceptDetail(conceptName) {
    return axios.get(API_URL + '/concept-detail/' + conceptName)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static getCourseDetail(courseId) {
    return axios.get(API_URL + '/course-detail/' + courseId)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }



  static computeTwoCoursesSimilarity(courseA, courseB) {
    return axios.get(API_URL + '/compare-two-course-similarity/', {
        params: {
          courseA: courseA,
          courseB: courseB,
        },
        paramsSerializer: params => {
          return qs.stringify(params, {arrayFormat: 'repeat'})
        }
      }
    ).then(function (response) {
      console.log(response.data);
      return response.data
    }).catch(function (error) {
      console.log(error)
    });
  }

  static getLoConceptDetail(loName) {
    return axios.get(API_URL + '/lo-concept-detail/', {
      params: {
        loId: loName
      },
      paramsSerializer: params => {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }
    ).then(function (response) {
      console.log(response.data);
      return response.data
    }).catch(function (error) {
      console.log(error)
    });
  }


  static getLoDetail(loName) {
    return axios.get(API_URL + '/lo-detail/' + loName)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static getConceptAnnotation(conceptName) {
    return axios.get(API_URL + '/concept-annotation/' + conceptName)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static getConceptRelationship(conceptName) {
    return axios.get(API_URL + '/concept-relationship/' + conceptName)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static getConceptScheme(conceptName) {
    return axios.get(API_URL + '/concept-scheme/' + conceptName)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static getAllScheme() {
    return axios.get(API_URL + '/concept-scheme')
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  static submitConceptForm(conceptData) {
    return axios.post(API_URL + '/new-concept',
      conceptData
    ).then(function (response) {
      console.log(response);
      console.log(response);
      let status = response.request.status
      if (status === 200) {
        console.log("SUCCESS")
        return true
      } else {
        console.log("FAILED")
        return false
      }
    }).catch(function (error) {
      console.log(error)
    });
  }

  static submitLO(data) {
    return axios.post(API_URL + '/new-lo', data)
    .then(function (response) {
      console.log(response.request.status);
      let status = response.request.status
      if (status === 200) {
        console.log("SUCCESS")
        return true
      } else {
        console.log("FAILED")
        return false
      }

    }).catch(function (error) {
      console.log(error)
    });
  }

  static submitCourse(data) {
    return axios.post(API_URL + '/new-course', data)
      .then(function (response) {
        console.log(response);
        let status = response.request.status
        if (status === 200) {
          console.log("SUCCESS")
          return true
        } else {
          console.log("FAILED")
          return false
        }
      }).catch(function (error) {
      console.log(error)
    });
  }

  static submitImportCourse(data) {
    return axios.post(API_URL + '/import-course', data)
      .then(function (response) {
        console.log(response);
        let status = response.request.status
        if (status === 200) {
          console.log("SUCCESS")
          return true
        } else {
          console.log("FAILED")
          return false
        }
      }).catch(function (error) {
      console.log(error)
    });
  }
}


export default API;
