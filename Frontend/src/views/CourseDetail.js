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

import {Container, Grid, Segment} from 'semantic-ui-react';
import ConceptTable from "../components/Tables/concept-table";
import SimpleFooter from "../components/Footers/SimpleFooter";

function mapConcept(data) {
  let list = []
  for(let i = 0; i < data.length; i++) {
    let temp = {}
    temp['conceptName'] = data[i]
    list.push(temp)
  }
  return list
}


class CourseDetail extends React.Component {
  state = {
    data: {"CourseName": "", "sc_dict": {}}
  }

  componentDidMount() {
    (async () => {
      try {
        const response = await API.getCourseDetail(this.props.match.params.courseId);
        this.set_dict(response)
        const uniq_lo = this.findUniq(response.LearningObject)
        const concepts = await API.getLoConceptDetail(uniq_lo)

        this.setState({data: response, concept: concepts})
      } catch (e) {
        // ...handle/report error here...
      }
    })();
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


  lo_helper(data, set) {
    console.log(data)
    if (!set.has(data.LOId)) {
      set.add(data.LOId)
      return <div key={data.LOId}><p> <a href={"/lo-detail/" + data.LOId}>{data.title} </a></p></div>
    }
  }

  lo() {
    if (this.state.data.LearningObject === undefined) {
      return <div>None</div>
    }
    if (this.state.data.LearningObject.length === 0) {
      return <div>None</div>
    }
    const lo_set = new Set()
    return Array.from(this.state.data.LearningObject).map((data, idx) => (
      this.lo_helper(data, lo_set)
    ))
  }

  component() {
    if (this.state.data.Component === undefined) {
      return <div>None</div>
    }
    if (this.state.data.Component.length === 0) {
      return <div>None</div>
    }
    return Array.from(this.state.data.Component).map((data, idx) => (
      <div key={idx}><p>{data.ComponentName}</p></div>
    ))
  }

  sub_component() {
    if (this.state.data.SubComponentName === undefined) {
      return <div>None</div>
    }
    if (this.state.data.SubComponentName.length === 0) {
      return <div>None</div>
    }
    return Array.from(this.state.data.SubComponentName).map((data, idx) => (
      <div key={idx}><p>{data.SubComponentName}</p></div>
    ))
  }

  construct_helper(id, week) {
    let result = []
    let lo = this.state.data.LearningObject
    for (let z = 0; z < lo.length; ++z) {
      if (lo[z].SubComponentId === id && lo[z].Week === week) {
        result.push(lo[z].title)
        console.log(lo[z].title)
        result.push(" ")
      }
    }
    return result
  }

  construct_structure() {
    if(this.state.data.LearningObject === undefined) {
      return <div>None</div>
    }
    if(this.state.data.LearningObject.length === 0) {
      return <div>None</div>
    }
    let week = []
    // Get unique weeks
    let lo = this.state.data.LearningObject
    for(let i = 0, l = lo.length; i < l; ++i) {
      if (week.indexOf(lo[i].Week) === -1) {
        week.push(lo[i].Week)
      }

    }
    week = this.state.data.Duration
    let courseComponent = [];
    let comp = this.state.data.Component
    for(let i = 0; i < comp.length; ++i) {
      let temp_comp = {}
      temp_comp["ComponentId"] = comp[i].ComponentId
      temp_comp["ComponentName"] = comp[i].ComponentName

      let sc = this.state.data.SubComponent
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
              <p>{courseComponent[idx].subComponent[y].SubComponentName}: {
                this.construct_helper(courseComponent[idx].subComponent[y].SubComponentId, i)
              }</p>
          )
          console.log(courseComponent[idx].subComponent[y].SubComponentName)

        }
      }
    }
    return html_codes
  }
  // get all concepts for this course
  findUniq(data) {
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
  concept (data) {
    console.log(data)
    if (data === undefined) {
      return <div></div>
    }
    console.log(mapConcept(data))
    return <ConceptTable data={mapConcept(data)} />
  }

  render() {
    console.log(this.state)
    let courseName = this.state.data.CourseName

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
                    <h1>{courseName}
                    </h1>
                      <Grid columns='equal' >
                        <Grid.Row stretched>
                          <Grid.Column>
                            <Segment>
                              <h4>Learning Objects</h4>
                              {this.lo()}
                            </Segment>
                          </Grid.Column>
                          <Grid.Column>
                            <Segment>
                              <h4>Component</h4>
                              {
                                this.component()
                              }
                            </Segment>
                          </Grid.Column>
                          <Grid.Column>
                            <Segment>
                              <h4>SubComponent</h4>
                              {this.sub_component()}
                            </Segment>
                          </Grid.Column>

                        </Grid.Row>
                        <Grid.Row>
                          <div className="mt-5 py-5 border-top text-center">
                            <h2>{"Other Details"}
                            </h2>

                            <p> CourseCode: {this.state.data.CourseCode} </p>
                            <p> Duration: {this.state.data.Duration} </p>
                            <p> Term: {this.state.data.Term} </p>
                            <p> Type: {this.state.data.Type} </p>
                            <p> Year: {this.state.data.Year} </p>
                            <p> Prerequisite: TODO </p>
                          </div>

                        </Grid.Row>
                      </Grid>
                  </div>
                  <div>
                    <h1>
                      Concept Details
                    </h1>
                    {this.concept(this.state.concept)}
                  </div>
                  <div className="mt-5 py-5 border-top text-center">
                    <h2>{"Structure"}
                    </h2>
                    {this.construct_structure()}
                  </div>
                </div>

              </Card>
              <Button
                className="mt-4"
                color="primary"
              >
                Edit Course
              </Button>
            </Container>
          </section>
          <SimpleFooter/>
        </main>
      </>
    );
  }
}

export default withRouter(CourseDetail);
