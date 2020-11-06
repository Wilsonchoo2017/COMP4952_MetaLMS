/*
  New Course Page:
  Create a new course
 */
import React from "react";

// core components
import CourseFormDetails from "../components/Forms/Course-sub-steps/CourseFormDetails";
import CourseStructureDetails from "../components/Forms/Course-sub-steps/CourseStructureDetails";
import CourseLOsDetails from "../components/Forms/Course-sub-steps/CourseLOsDetails";

import API from "../api";
import CourseNewOptions from "../components/Forms/Course-sub-steps/CourseNewOptions";
import CourseImport from "../components/Forms/Course-sub-steps/CourseImport";
import Course from "./Course";
import CourseFormSuccess from "../components/Forms/Course-sub-steps/CourseFormSuccess";

function getLO() {
  return API.getAllLo().then(function(data) {
    let list = []
    data.map((el, idx) => {
      let temp = {}
      temp['key'] = el.LOId;
      temp['text'] = el.title;
      temp['value'] = el.LOId;
      list.push(temp)
    })
    return list
  })
}

class NewCourse extends React.Component {
  state = {
    step: 1,
    courseCode: '',
    courseName: '',
    courseTerm: '',
    courseYear: '',
    courseType: '',
    courseComponent: [{name: '', subComponent: [], assess: false}],
    courseDuration:  '1',
    courseLOs: {},
    isImported: false,
  }

  async componentDidMount() {
    const response = await getLO();
    this.setState({data: response})
  }
  nextStep = () => {
    const {step} = this.state
    this.setState({
      step: step + 1
    })
  }

  goToImport = () => {
    this.setState({
      step: 5
    })
  }

  prevStep = () => {
    const {step} = this.state
    this.setState({
      step: step - 1
    })
  }
  backToStep1 = () => {
    this.setState({
      step: 1
    })
  }

  goToStart = () => {
    this.setState(
      {
        step: 1,
        courseCode: '',
        courseName: '',
        courseTerm: '',
        courseYear: '',
        courseType: '',
        courseComponent: [{name: '', subComponent: [], assess: false}],
        courseDuration:  '1',
        courseLOs: {},
        isImported: false,
      }
    )
    this.componentDidMount()
  }

  async handleFormSubmit() {
    let courseData = this.state;
    console.log(this.state)
    let status = await API.submitCourse(courseData);
    console.log(status)
    if (status === true) {
      this.setState({step: -1})
      return true
    }
    return false
  }

  handleImportCourse = () => {
    let conceptData = this.state;
    API.submitImportCourse(conceptData);
  }

  //https://www.youtube.com/watch?v=sp9r6hSWH_o
  onFileChangeHandler = (e) => {
    let files = e.target.files;
    const file = files[0]

    console.log(files)
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload=(e)=> {
      this.setState({file: e.target.result, type: file.type, fileName: file.name})
    }
  }
  handleChange = input => event => {
    this.setState({[input]: event.target.value})
  }

  handleMappingChange =  (idx, input, data) => {
    const courseComponent = [...this.state.courseComponent];
    courseComponent[idx] = {...courseComponent[idx], [input]: data.target.value};
    this.setState({courseComponent})
  }

  handleMappingSubComponentChange =  (idx, input, data) => {
    const courseComponent = [...this.state.courseComponent];
    let value = data.target.value;
    value = value.split(',')
    value = value.concat('Mics')
    courseComponent[idx] = {...courseComponent[idx], [input]: value};
    this.setState({courseComponent})
  }


  handleCourseLOChange =  (a, b, c, d, e) => {
    const courseLOs = this.state.courseLOs;
    courseLOs[a][b][c] = e.value
    this.setState({courseLOs})
  }


  addCourseComponent = () => {
    this.setState(prevState => ({
      courseComponent: [...prevState.courseComponent, {name: "", subComponent: [], assess: false}]
    }))
  }

  removeCourseComponent = (i) => {
    let courseComponent = [...this.state.courseComponent];
    courseComponent.splice(i, 1);
    this.setState({courseComponent});
  }

  handleCheckAssessmentComponent = (i) => {
    const courseComponent = [...this.state.courseComponent];
    courseComponent[i] = {...courseComponent[i], ['assess']: !courseComponent[i].assess};
    this.setState({courseComponent})
  }

  handleDropdownChange = (e, data) => {
    this.setState({[data.name]: data.value})
  }


  initCourseLOs = () => {

    let courseComponent =  [
      {
        "name": "Lecture",
        "subComponent": [
          "Slides",
          "Code",
          "Mics"
        ]
      },
      {
        "name": "Test",
        "subComponent": [
          "Coding",
          "Written",
          "Mics"
        ]
      }
    ]
    this.setState({courseComponent})

  }


  initCourseLO2 = () => {
    let duration = this.state.courseDuration;
    let courseLOs = {};
    let courseComponent = this.state.courseComponent;

    for (let i = 1; i <= duration; i++) {
      courseLOs[i] = {};
      for (let idx = 0; idx < courseComponent.length; idx++) {
        let courseComponentName = courseComponent[idx].name;
        courseLOs[i][courseComponentName] = {};
        for (let y = 0; y < courseComponent[idx].subComponent.length; y++) {
          courseLOs[i][courseComponentName][courseComponent[idx].subComponent[y]] = [];// Contains array of keys to LOs
        }
      }
    }

    this.setState({courseLOs})
  }



  render() {
    const {step} = this.state;
    const values = this.state;

    switch (step) {
      case 1:
        return (
          <CourseNewOptions nextStep={this.nextStep} handleChange={this.handleChange} values={this.state}
                            handleDropdownChange={this.handleDropdownChange}
                            goToImport={this.goToImport}
          />
        );
      case 2:
        return (
          <CourseFormDetails nextStep={this.nextStep} handleChange={this.handleChange} values={this.state}
                             prevStep={this.prevStep}
                             handleDropdownChange={this.handleDropdownChange}

          />
        );
      case 3:
        return (
          <CourseStructureDetails nextStep={this.nextStep} handleChange={this.handleChange}
                                  handleMappingChange={this.handleMappingChange}
                                  handleMappingSubComponentChange={this.handleMappingSubComponentChange}
                                  addCourseComponent={this.addCourseComponent}
                                  removeCourseComponent={this.removeCourseComponent}
                                  handleDropdownChange={this.handleDropdownChange}
                                  initCourseLO2={this.initCourseLO2}
                                  test={this.initCourseLOs}
                                  handleCheckAssessmentComponent={this.handleCheckAssessmentComponent}
                                  prevStep={this.prevStep}
                                  values={values}

          />
        );
      case 4:
        return (

          <CourseLOsDetails nextStep={this.nextStep} handleChange={this.handleChange}
                                  handleMappingChange={this.handleMappingChange}
                                  handleMappingSubComponentChange={this.handleMappingSubComponentChange}
                                  addCourseComponent={this.addCourseComponent}
                                  removeCourseComponent={this.removeCourseComponent}
                                  handleDropdownChange={this.handleDropdownChange}
                            handleCourseLOChange={this.handleCourseLOChange }
                            test={this.initCourseLOs}
                            prevStep={this.prevStep}
                            handleFormSubmit={this.handleFormSubmit.bind(this)}
                            values={values}  />
        );

      case 5:
        return (
          <CourseImport nextStep={this.nextStep} handleChange={this.handleChange} values={this.state}
                        handleDropdownChange={this.handleDropdownChange} backToStep1={this.backToStep1}
                        handleImportCourse={this.handleImportCourse} onFileChangeHandler={this.onFileChangeHandler }
          />
        );
      case -1:
        return (
          <CourseFormSuccess goToStart={this.goToStart}/>
        )
    }

  }
}

export default NewCourse;
