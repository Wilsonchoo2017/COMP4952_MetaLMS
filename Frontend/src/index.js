import React from "react";
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect, useHistory, useParams } from "react-router-dom";

// Import third party css
import 'semantic-ui-css/semantic.min.css'
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/scss/argon-design-system-react.scss";

import Landing from "./views/Landing.js"
import Concept from "./views/Concept";
import Register from "./views/Register";
import Login from "./views/Login";
import ConceptDetail from "./views/ConceptDetail";
import NewConcept from "./views/NewConcept";
import Course from "./views/Course"
import NewCourse from "./views/NewCourse";
import LO from "./views/LO";
import NewLO from "./views/NewLO";
import CourseDetail from "./views/CourseDetail";
import CompareCourses from "./views/CompareCourses";
import LoDetail from "./views/LoDetail";

// let history = useHistory();
// function handleConceptDetailClick(link) {
//   history.push(link)
// }


  ReactDOM.render(
  <Router basename={"/meta"}>
    <Switch>
      <Route path={"/concept-page"}>
        <Concept />
      </Route>



      <Route path={"/new-concept-page"}>
        <NewConcept />
      </Route>
      <Route path={"register"}>
        <Register />
      </Route>
      <Route path={"/login"}>
        <Login />
      </Route>

      <Route path={"/new-course-page"}>
        <NewCourse />
      </Route>
      <Route path={"/course-page"}>
        <Course />
      </Route>

      <Route path={"/course-detail/:courseId"}>
        <CourseDetail />
      </Route>
      <Route path={"/concept-detail/:conceptName"}>
        <ConceptDetail />
      </Route>

      <Route path={"/lo-detail/:loId"}>
        <LoDetail />
      </Route>

      <Route path={"/LO-page"}>
        <LO />
      </Route>

      <Route path={"/compare-course"}>
        <CompareCourses />
      </Route>

      <Route path={"/new-LO-page"}>
        <NewLO />
      </Route>
      <Route path={"/login"}>
        <Login />
      </Route>

      <Route path={"/register"}>
        <Register />
      </Route>
      {/* If none of the previous routes render anything,
            this route acts as a fallback.*/}
      <Route path={"/"}>
        <Landing />
      </Route>
      <Redirect to={"/"} />
    </Switch>
  </Router>,
  document.getElementById("root")
);