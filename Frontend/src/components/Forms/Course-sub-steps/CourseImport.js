import Navbar from "../../Navbars/Navbars";
import React  from "react";

// reactstrap components
import {
  Card,
  Container,
  Button,
} from "reactstrap";
import { Form, Radio } from 'semantic-ui-react';
import SimpleFooter from "../../Footers/SimpleFooter";

const options = [
  { key: '1', text: 'Term 1', value: '1' },
  { key: '2', text: 'Term 2', value: '2' },
  { key: '3', text: 'Term 3', value: '3' },
  { key: '4', text: 'Summer Term', value: '0' },
]

const courseTypeOptions = [
  { key: '1', text: 'Online Delivery', value: 'DLV' },
  { key: '2', text: 'Face To Face', value: 'FTF' },
]

class CourseImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {radioValue: ''}
  }
  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.handleImportCourse();
  }

  backToStep1 = (e) => {
    e.preventDefault();
    this.props.backToStep1();
  }

  render() {
    const { values } = this.props;

    return (
      <div>
        <Navbar />
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="pt-lg-7">
              <Card>
                <div className="px-4">
                  <Form>
                    <h1 className="ui centered">Course Import</h1>
                    <Form.Input
                      label='Course Name'
                      placeholder='Course Name'
                      onChange={this.props.handleChange('courseName')}
                      defaultValue={values.courseName}
                    />
                    <Form.Input
                      label='Course Code'
                      placeholder='Course Code'
                      onChange={this.props.handleChange('courseCode')}
                      defaultValue={values.courseCode}
                    />

                    <Form.Dropdown label={"Term"} placeholder="Term" name="courseTerm"
                                   fluid
                                   search
                                   selection
                                   onChange={this.props.handleDropdownChange}
                                   options={options}/>
                    <Form.Input
                      label='Year'
                      placeholder='Year'
                      onChange={this.props.handleChange('courseYear')}
                      defaultValue={values.courseYear}
                    />
                    <Form.Dropdown label={"Course Type"} placeholder="Course Delivery Mode" name="courseType"
                                   fluid
                                   search
                                   selection
                                   onChange={this.props.handleDropdownChange}
                                   options={courseTypeOptions}/>

                    <Form.Field className="form-group files">
                      <label>Upload Your File </label>
                      <input type="file" onChange={this.props.onFileChangeHandler}/>
                    </Form.Field>
                    <Button onClick={this.backToStep1} color={"primary"}>Back</Button>
                    <Button onClick={this.saveAndContinue} color={"success"}>Save And Import</Button>
                  </Form>
                </div>
              </Card>
            </Container>
          </section>
          <SimpleFooter />
        </main>
      </div>
    )
  }
}

export default CourseImport;