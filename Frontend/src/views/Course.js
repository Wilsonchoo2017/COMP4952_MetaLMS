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
import {Link} from "react-router-dom";

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
              <Link to="/new-course-page">
                <Button
                className="mt-4"
                color="primary"
              >
                  New Course
              </Button>
              </Link>
              <Link to={"/compare-course"}>
              <Button
                className="mt-4"
                color="primary"
              >
                Compare Two Courses
              </Button>
              </Link>
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