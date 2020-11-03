/*
  Course Page:
  Shows all the course that exist in the database
 */

import React from "react";
import { useTable } from 'react-table'

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import Navbar from "../components/Navbars/Navbars.js";
import getData from "../components/Tables/TableData/courseData";
import CourseTable from "../components/Tables/courses-table";
import SimpleFooter from "../components/Footers/SimpleFooter";

class Course extends React.Component {
  state = {
    data: [],
  };

  async componentDidMount() {
    const response = await getData();
    this.setState({data: response})
  }

  render() {
    return (
      <>
        <Navbar />
        <main ref="main">
          {/* Circle BG */}

          <section className={"section section-lg"}>
            <Container>
              <Button
                className="mt-4"
                color="primary"
                href="/new-course-page"
              >
                New Course
              </Button>

              <Button
                className="mt-4"
                color="primary"
                href="/compare-course"
              >
                Compare Two Courses
              </Button>
              <CourseTable data={this.state.data} />
            </Container>
          </section>
          <SimpleFooter />

        </main>
      </>
    );
  }
}

export default Course;