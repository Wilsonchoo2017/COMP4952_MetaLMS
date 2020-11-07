/*
  Course details Page
  Shows what a single course of detail will be
 */


/*
  Concept Detail Page
  Shows what a single unit of concept have
 */
/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {useParams, withRouter} from "react-router-dom";
import API from "../api";

// reactstrap components
import {Button, Card, Row, Col} from "reactstrap";

// core components
import Navbar from "../components/Navbars/Navbars.js";

import {Container, Grid, Segment, Checkbox} from 'semantic-ui-react';
import getData from "../components/Tables/TableData/conceptData";
import LoTable from "../components/Tables/lo-table";
import ConceptTable from "../components/Tables/concept-table";
import CourseTable from "../components/Tables/courses-table";
import SimpleFooter from "../components/Footers/SimpleFooter";
import SubpageTable from "../components/Tables/subpage-table";

function mapCourse(data) {
  console.log(data)
  let list = []
  data.map((el, idx) => {
    let temp = {}
    console.log(el)
    temp['courseId'] = el.CourseId
    temp['courseCode'] = el.CourseCode
    temp['courseName'] = el.CourseName
    temp['term'] = el.Term
    temp['year'] = el.Year
    list.push(temp)
  })
  return list
}

function mapConcept(data) {
  let list = []
  for(let i = 0; i < data.length; i++) {
    let temp = {}
    temp['conceptName'] = data[i]
    list.push(temp)
  }
  return list
}

function mapSubpageConcept(data) {
  let list = []
  for(let i = 0; i < data.Subpages.length; i++) {
    let temp = {}
    temp['pageNo'] = data.Subpages[i].PageNumber
    if (data.csoConcepts[i] !== undefined) {
      temp['concepts'] = data.csoConcepts[i].concepts.toString()
    } else {
      temp['concepts'] =  'None'
    }

    list.push(temp)
  }
  console.log(list)
  return list
}

class LoDetail extends React.Component {
  state = {
    data: {}
  }

  componentDidMount() {
    (async () => {
      try {
        let id = this.props.match.params.loId
        const response = await API.getLoDetail(id);
        const concept = await API.getLoConceptDetail([id])
        this.setState({data: response, concept: concept})
      } catch (e) {
        // ...handle/report error here...
      }
    })();
  }

  course (data) {
    console.log(data)
    if (data === undefined || data.Course === undefined) {
      return <div></div>
    }
    return <CourseTable data={mapCourse(data.Course)} />
  }

  concept (data) {
    console.log(data)
    if (data === undefined) {
      return <div></div>
    }
    console.log(mapConcept(data))
    return <ConceptTable data={mapConcept(data)} />
  }
  subpage (data) {
    if (data === undefined || data.csoConcepts === undefined || data.Subpages === undefined) {
      return <div></div>
    }
    console.log(data)
    return <SubpageTable data={mapSubpageConcept(data)}/>
  }

  renderContactDetails = () => {
    if (this.state.data === undefined) {
      return 'None'
    }

    if (this.state.data.LearningObject === undefined) {
      return 'None'
    }

    if (this.state.data.LearningObject.ContactUser === undefined || this.state.data.LearningObject.ContactUser.length === 0) {
      return 'None'
    }
    return this.state.data.LearningObject.ContactUser
  }
  render() {
    console.log(this.state.data)
    return (
      <>
        <Navbar/>
        <main className="profile-page" ref="main">
          <section className="section">
            <Container>
              <h1>LO Details</h1>
              <p> Contact Details: {this.renderContactDetails()} </p>
              {/*<p> Download Link: TODO </p>*/}

              <h1>Courses</h1>
              {this.course(this.state.data)}
              <h1>Concepts</h1>
              {this.concept(this.state.concept)}
              <h1>Subpage Concepts</h1>
              {this.subpage(this.state.data)}

              {/*<Button*/}
              {/*  className="mt-4"*/}
              {/*  color="primary"*/}
              {/*>*/}
              {/*  Edit Learning Object*/}
              {/*</Button>*/}
            </Container>
          </section>
          <SimpleFooter/>
        </main>
      </>
    );
  }
}

export default withRouter(LoDetail);
