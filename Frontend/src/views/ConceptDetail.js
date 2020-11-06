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

import {Container, Grid, Segment, Image} from 'semantic-ui-react';
import getData from "../components/Tables/TableData/conceptData";
import SimpleFooter from "../components/Footers/SimpleFooter";


class ConceptDetail extends React.Component {

  state = {
    data: [],
    annotation: [],
    relationship: [],
    scheme: [],
    dependency: [],
  };

  async componentDidMount() {
    const dataResponse = await API.getConceptDetail(this.props.match.params.conceptName);
    const annotationResponse = await API.getConceptAnnotation(this.props.match.params.conceptName);
    const relationshipResponse = await API.getConceptRelationship(this.props.match.params.conceptName);
    const schemeResponse = await API.getConceptScheme(this.props.match.params.conceptName);
    const dependency = await API.getDependency(this.props.match.params.conceptName);
    console.log(dependency)
    console.log(relationshipResponse)
    console.log(dataResponse)
    this.setState({
      data: dataResponse,
      annotation: annotationResponse,
      relationship: relationshipResponse,
      scheme: schemeResponse,
      dependency: dependency
    })
  }

  handlePrint(data, idx) {
    let final = []
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let data_arr = data[key]
        let str = "None"
        for (let i = 0; i < data_arr.length; i++) {
          if (i === 0) {
            str = data_arr[i]
          } else if (i === data_arr.length - 1) {
            str = str + ', ' + data_arr[i]

          } else {
            str = str + ', ' + data_arr[i]
          }
        }
        final.push(<p key={key}><b>{key}</b>: {str}</p>)
      }
    }
    return (
      <div key={idx}>
        {final}
      </div>
    )
  }

  scheme() {
    if (this.state.scheme.length === 0) {
      return <div>None</div>
    } else {
      return Array.from(this.state.scheme).map((data, idx) => (
        <div key={idx}><p>{data}</p></div>
      ))
    }
  }
  relationship_render() {
    console.log(this.state.relationship)
    if (this.state.relationship.length === 0) {
      return <div>None</div>
    }
    let final = []
    this.state.relationship.map((data, idx) => {
      for (let key in data) {
        final.push(
          <div key={idx}><p>{key} : {data[key]} </p></div>
        )
      }
    })
    return final
  }

  dependency_render() {
    if (this.state.dependency.length === 0) {
      return <div>None</div>
    } else {
      return Array.from(this.state.dependency).map((data, idx) => (
        <div key={idx}><p>{data}</p></div>
      ))
    }
  }

  course(course_id_set) {
    if (course_id_set.size === 0) {
      return <div>None</div>
    } else {
      return Array.from(course_id_set).map((el, idx) => (
        <div key={idx}><p>{el}</p></div>
      ))
    }
  }


  LO(lo_set) {
    if (lo_set.size === 0) {
      return <div>None</div>
    } else {
      return Array.from(lo_set).map((el, idx) => (
        <div key={idx}><p>{el}</p></div>
      ))
    }
  }


  render() {
    let dic = this.state.annotation;
    let dic_arr = []
    console.log(this.dependency)
    // create a dictionary array
    for (let key in dic) {
      if (dic.hasOwnProperty(key)) {
        let temp = {}
        temp[key] = dic[key]
        dic_arr.push(
          temp
        )
      }
    }

    let course_id_set = new Set()
    let lo_set = new Set()
    if (this.state.data !== undefined ) {
      if(this.state.data.course !== undefined) {
        this.state.data.map((el, idx) => (
            course_id_set.add(el.Course.CourseCode)
          )
        )
      }

      if(this.state.data.LearningObject !== undefined) {
        this.state.data.map((el, idx) => (
            lo_set.add(el.LearningObject.title)
          )
        )
      }
    }

    const conceptTitle = this.props.match.params.conceptName.replace("_", " ")
    return (
      <>
        <Navbar/>
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-1 shape-default alpha-4">
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
              <span/>
            </div>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--300">
                <div className="px-6">

                  <div className="text-center mt-5">
                    <h1>{conceptTitle}
                    </h1>
                    <Grid columns='equal' >
                      <Grid.Row stretched>
                        <Grid.Column>
                          <Segment>
                            <h4>Courses</h4>
                            {
                              this.course(course_id_set)
                            }
                          </Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment>
                            <h4>Learning Objects</h4>
                            {
                              this.LO(lo_set)
                            }
                          </Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment>
                            <h4>Dependencies</h4>
                            {
                              this.dependency_render()
                            }
                          </Segment>
                        </Grid.Column>

                      </Grid.Row>
                      <Grid.Row stretched>
                        <Grid.Column>
                          <Segment><h4>Relationships</h4>
                            {
                              this.relationship_render()
                            }
                          </Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment><h4>Lexical Labels</h4>
                            {
                              dic_arr.map((data, idx) => this.handlePrint(data, idx))
                            }
                          </Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment><h4>Schemes</h4>
                            {this.scheme()}
                          </Segment>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                  <div className="mt-5 py-5 border-top text-center">

                  </div>
                </div>
              </Card>
            </Container>
          </section>
          <SimpleFooter />
        </main>
      </>
    );
  }
}

export default withRouter(ConceptDetail);
