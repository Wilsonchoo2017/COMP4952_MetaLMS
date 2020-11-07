/*
  LO Page
  Main page that shows all the Learning object exist in the database.
 */
import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardBody,
  CardImg,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

import {Dropdown, Segment, Grid, List, Checkbox, Table, Label, Popup, Button} from 'semantic-ui-react';

// core components
import Navbar from "../components/Navbars/Navbars.js";

// utilities
import getData from "../components/Tables/TableData/courseData";
import API from "../api";
import { Link } from 'react-router-dom'
import SimpleFooter from "../components/Footers/SimpleFooter";
import { red, blue} from "color-name";

function mapToKey(data) {
  let result = []
  for (let i = 0; i < data.length; ++i) {
    let temp = {}
    temp['key'] = i;
    temp['text'] = data[i].courseName;
    temp['value'] = data[i].courseId;
    result.push(temp)
  }
  return result
}
// get all concepts for this course
function findUniq(data) {
  if (data === undefined) {
    return
  }
  let uni_set = new Set()
  for(let i = 0; i < data.length; ++i) {
    uni_set.add(data[i].LOId)
  }
  let data_arr = Array.from(uni_set);
  console.log(data_arr)
  return data_arr
}
function mapSmmNotes(data, table) {
  let res = data
  for(let i = 0; i < data.length; ++i) {
    let curr = data[i]
    console.log(curr['from'])
    console.log(table[curr['from']])
    res[i]['from'] = table[data[i]['from']]
    res[i]['to'] = table[data[i]['to']]
  }
  return res

}
async function loToconceptLookupTable(fullTable, LOs) {
  console.log("Enetered Lotoconcept")
  // Full Table Is A Dictionary Of Array
  for(let i = 0; i < LOs.length; ++i) {
    let currLO = LOs[i]
    console.log(fullTable[currLO] === undefined)
    if (fullTable[currLO] === undefined) {
      // New Entry
      // get concepts for this LOs
      let concepts = await API.getLoConceptDetail([currLO])
      console.log(concepts)
      fullTable[currLO] = concepts
    }
  }
  console.log(fullTable)
  return fullTable
}

async function conceptToDependencyLookupTable(concepts) {
  // Full Table Is A Dictionary Of Array
  let dependencies = await API.getDependency(concepts)
  let dependency_set = [...new Set(dependencies)]
  return dependency_set
}
function addLOsToLookup(table, data) {
  if(data === undefined) {
    return table
  }
  console.log(data['LearningObject'])
  const LOs = data['LearningObject']
  for (let i = 0; i < LOs.length; ++i) {
    table[LOs[i]['LOId']] = LOs[i]['title']
  }
  console.log(table)
  return table

}

class CompareCourses extends React.Component {
  state = {
    courseOptions: [],
    CourseA: "",
    CourseB: "",
    courseAResponse: "",
    courseBResponse: "",
    ltcLookupTable: {},
    dependencyCourseB: [],
    conceptsInBetweenCourses: [],
    missingDependency: [],
    isShowCourseConceptsOnly: false,
    isIncludePrereqCourse: false,
    ssm: {courseAScore:{}, courseBScore:{}, courseScore: ''},
    allLOs: {}
  };

  async componentDidMount() {
    let allCourses = await getData();
    allCourses = mapToKey(allCourses)
    const courseAResponse = await API.getCourseDetail(this.state.CourseA);
    const courseBResponse = await API.getCourseDetail(this.state.CourseB);
    let table = this.state.allLOs
    table = addLOsToLookup(this.state.allLOs, courseAResponse)
    table = addLOsToLookup(this.state.allLOs, courseBResponse)
    let conceptsA = undefined
    let conceptsB = undefined
    let ltcLookupTable = this.state.ltcLookupTable
    if (courseAResponse !== undefined) {
      const uniq_loA = findUniq(courseAResponse.LearningObject)
      conceptsA = await API.getLoConceptDetail(uniq_loA)
      ltcLookupTable = await loToconceptLookupTable(ltcLookupTable, uniq_loA)
    }
    let dependencyCourseB = []
    if (courseBResponse !== undefined) {
      const uniq_loB = findUniq(courseBResponse.LearningObject)
      conceptsB = await API.getLoConceptDetail(uniq_loB)
      ltcLookupTable = await loToconceptLookupTable(ltcLookupTable, uniq_loB)
      dependencyCourseB = await conceptToDependencyLookupTable(conceptsB)
    }
    let missingDependency = new Set()
    if (courseAResponse !== undefined && courseBResponse !== undefined) {
      // Check for difference in dependencies
      // temporary combine concepts inbetween courses and course A TODO
      for(let i = 0; i < dependencyCourseB.length; ++i) {
        let currDependency = dependencyCourseB[i]
        let found = conceptsA.find(function(concept) {
          return currDependency === concept
        })
        if(!found) {
          missingDependency.add(currDependency)
        }
      }

    }

    let ssm = {courseAScore:{}, courseBScore:{}, courseScore: ''}
    if (this.state.CourseA !== "" && this.state.CourseA !== "" ) {
      const result = await API.computeTwoCoursesSimilarity(this.state.CourseA, this.state.CourseB)
      ssm = result
    }

    this.setState({
      courseOptions: allCourses,
      courseAResponse: courseAResponse,
      courseBResponse: courseBResponse,
      conceptsA: conceptsA,
      conceptsB: conceptsB,
      ltcLookupTable: ltcLookupTable,
      dependencyCourseB: dependencyCourseB,
      missingDependency: missingDependency,
      ssm: ssm,
      allLOs: table,
    })
  }


  handleDropdownChange = (e, data) => {
    this.setState({[data.name]: data.value})
    this.componentDidMount()
  }

  set_dict(data) {
    let sc = data['SubComponent']
    let sc_dict = {}
    for (let i = 0; i < sc.length; ++i) {
      sc_dict[sc[i]['SubComponentId']] = sc[i]['SubComponentName']
    }

    let lo = data['LearningObject']
    let lo_dict = {}
    for (let i = 0; i < lo.length; ++i) {
      lo_dict[lo[i]['LOId']] = lo[i]['title']
    }

    let comp = data['Component']
    let comp_dict = {}
    for (let i = 0; i < comp.length; ++i) {
      comp_dict[comp[i]['ComponentId']] = comp[i]['ComponentName']
    }

    this.setState({sc_dict: sc_dict, lo_dict: lo_dict}) // Shows a subcomponent belongs to which component
  }

  construct_label(el, table){
  let arr = table[el.LOId]
    let temp = []
  for(let i = 0; i < arr.length; ++i) {
    temp.push(<Label as={ Link } to={'concept-detail/' + arr[i]}> {arr[i]}  </Label>)
  }
  return temp
}

  construct_helper(id, week, data, ssm, otherCourseLOs) {
    let lo = data.LearningObject
    let table = this.state.ltcLookupTable
    let constructLabel = this.construct_label
    let allLosTable = this.state.allLOs
    let mapSmmNotesfunc = mapSmmNotes

    return Array.from(lo).map(function(el, idx) {
      if (el.SubComponentId === id && el.Week === week) {
        // check if there's same lo id in concept B
        let bgcolor = 'inherit'
        if (otherCourseLOs.includes(el.LOId) === true) {
          // bgcolor = 'foo'
          bgcolor = '#ffcccc'
        } else if (ssm !== undefined) {
          let sum = 0
          for(let i = 0; i < ssm[el.LOId].length; ++i) {
            sum += ssm[el.LOId][i]['score']
          }
          if (sum >= 0.1 && sum <= 0.5) {
            bgcolor = '#f0f8ff'
          }

          if (sum > 0.5 && sum <= 1.5) {
            bgcolor = '#cce7ff'
          }
          if (sum > 1.5 && sum <= 5.5) {
            bgcolor = '#99cfff'
          }
          if (sum > 5.5 ) {
            bgcolor = '#66b8ff'
          }
        }


        return (<Table.Row key={idx} style={{backgroundColor: bgcolor}}>
          <Table.Cell as={ Link } to={'concept-detail/' + el.LOId}>
            {el.title}
          </Table.Cell>
          <Table.Cell>
            {constructLabel(el, table)}
          </Table.Cell>
          <Table.Cell>
            {JSON.stringify(mapSmmNotesfunc(ssm[el.LOId], allLosTable), null, 2)}
          </Table.Cell>
        </Table.Row>)
      }
    })

  }

  constructTable(courseComponent, y, idx, i, data, ssm,  otherCourseLOs) {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>LO</Table.HeaderCell>
            <Table.HeaderCell>Concept</Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.construct_helper(courseComponent[idx].subComponent[y].SubComponentId, i, data, ssm, otherCourseLOs)}
        </Table.Body>
      </Table>
    )
  }

  renderCourse(course, courseResponse, ssm, otherCourseLO) {
    console.log(this.state)
    if (course.length === 0 || courseResponse === undefined || otherCourseLO === undefined) {
      return <div>Please Select A Course To View Concepts</div>
    }
    // Unpack course's details
    if(courseResponse.LearningObject === undefined) {
      return <div>None</div>
    }
    if(courseResponse.LearningObject.length === 0) {
      return <div>None</div>
    }

    // Unpact other Course LO
    if(otherCourseLO.LearningObject === undefined) {
      return <div>None</div>
    }
    if(otherCourseLO.LearningObject.length === 0) {
      return <div>None</div>
    }

    let otherCourseLOs  = []
    for(let i = 0; i < otherCourseLO.LearningObject.length; ++i) {
      otherCourseLOs.push(otherCourseLO.LearningObject[i]['LOId'])
    }


    let data = courseResponse
    let week = []
    // Get unique weeks
    let lo = data.LearningObject
    for(let i = 0, l = lo.length; i < l; ++i) {
      if (week.indexOf(lo[i].Week) === -1) {
        week.push(lo[i].Week)
      }

    }
    week = week.length
    let courseComponent = [];
    let comp = data.Component
    for(let i = 0; i < comp.length; ++i) {
      let temp_comp = {}
      temp_comp["ComponentId"] = comp[i].ComponentId
      temp_comp["ComponentName"] = comp[i].ComponentName

      let sc = data.SubComponent
      let temp_sc = []
      for(let j = 0; j < sc.length; ++ j) {
        console.log("current")
        console.log(sc[j])
        if(sc[j].ComponentId === temp_comp["ComponentId"]) {
          let temp = {}
          temp['SubComponentName'] = sc[j].SubComponentName
          temp['SubComponentId'] = sc[j].SubComponentId
          temp_sc.push(temp)
        }
      }
      temp_comp["subComponent"] = temp_sc
      courseComponent.push(temp_comp)
      console.log(courseComponent)
    }


    let html_codes = []
    for (let i = 1; i <= week; i++) {
      html_codes.push(<h2>Week {i}</h2>)
      for (let idx = 0; idx < courseComponent.length; idx++) {
        let courseComponentName = courseComponent[idx].ComponentName;
        html_codes.push(
          <div>
            <h3>{courseComponentName}</h3>
          </div>
        )
        for (let y = 0; y < courseComponent[idx].subComponent.length; y++) {
          html_codes.push(
            // post all learning object in here
            <p>{courseComponent[idx].subComponent[y].SubComponentName}:
            </p>
          )
          // Construct tab;e
          html_codes.push(this.constructTable(courseComponent, y, idx, i, data, ssm, otherCourseLOs))
        }
      }
    }
    return html_codes
  }

  render_dependency() {
    if(this.state.missingDependency.length === 0) {
      return <div>Please Select A Course To Compare</div>
    }

    return (
      <List>
        {
          Array.from(this.state.missingDependency).map(function(el, idx) {
            return <List.Item><List.Content as={ Link } to={'/concept-detail/' + el}>{el}</List.Content></List.Item>
          })
        }
      </List>
      )
  }

  renderCourseConcept(concepts) {
    if(concepts === undefined) {
      return <div />
    }

    if(concepts.length === 0) {
      return <div>No Concepts Found</div>
    }

    return (
      <List>
        {
          Array.from(concepts).map(function(el, idx) {
            return <List.Item><List.Content as={ Link } to={'/concept-detail/' + el}>{el}</List.Content></List.Item>
          })
        }
      </List>
    )

  }
  // togglePrereq = () => this.setState((prevState) => ({ isIncludePrereqCourse: !prevState.isIncludePrereqCourse }))
  toggleCourseConcepts = () => this.setState((prevState) => ({ isShowCourseConceptsOnly: !prevState.isShowCourseConceptsOnly }))


  qCourse(concept, course, courseResponse, ssm, otherCourseLO) {
    return this.state.isShowCourseConceptsOnly ? this.renderCourseConcept(concept) : this.renderCourse(course, courseResponse, ssm, otherCourseLO)
  }

  render() {

    return (
      <>
        <Navbar/>
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
            </div>

            <Container>
              <Segment>
                <h1>Course Comparison</h1>
                {/*<Checkbox label='Include Prerequisite Courses' onChange={this.togglePrereq} checked={this.state.isIncludePrereqCourse}/>*/}
                <Checkbox label='Show Course Concepts Only' onChange={this.toggleCourseConcepts} checked={this.state.isShowCourseConceptsOnly} />

              </Segment>
              <Grid columns={'equal'}>
                <Grid.Column>
                  <Segment>
                    <Dropdown placeholder="Select Course 1" name="CourseA"
                              fluid
                              search
                              selection
                              onChange={this.handleDropdownChange}
                              options={this.state.courseOptions}
                    />
                    {console.log(this.state)}
                    {this.qCourse(this.state.concepts,this.state.CourseA, this.state.courseAResponse, this.state.ssm === undefined ? undefined : this.state.ssm.courseAScore, this.state.courseBResponse)}

                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Dropdown placeholder="Select Course 2" name="CourseB"
                              fluid
                              search
                              selection
                              onChange={this.handleDropdownChange}
                              options={this.state.courseOptions}
                    />
                    {this.qCourse(this.state.conceptsB, this.state.CourseB, this.state.courseBResponse, this.state.ssm === undefined ? undefined : this.state.ssm.courseBScore, this.state.courseAResponse)}
                  </Segment>
                </Grid.Column>
              </Grid>
            </Container>
            <Container>
              <Segment>
                <h2> Dependencies Not Found </h2>
              {/*  List of dependencies not found right here */}
                {this.render_dependency()}
              </Segment>
            </Container>
          </section>
        <SimpleFooter/>

        </main>
      </>
    );
  }
}

export default CompareCourses;