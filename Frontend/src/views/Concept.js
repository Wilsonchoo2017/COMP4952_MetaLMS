/*
  Concept Page
  Main page of concept where it shows all the concept exists in the database
 */
import React from "react";
import { useTable } from 'react-table'

import * as go from 'gojs'
import { ReactDiagram } from 'gojs-react';
import './app.css';  // contains .diagram-component CSS
import {DragZoomingTool} from '../util/DragZoomingTool'


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
import ConceptTable from "../components/Tables/concept-table";
import getData from "../components/Tables/TableData/conceptData";
import API from "../api"
import SimpleFooter from "../components/Footers/SimpleFooter";

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
function initDiagram() {
  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram =
    $(go.Diagram,
      {
        'undoManager.isEnabled': true,  // must be set to allow for model change listening
        'initialAutoScale': go.Diagram.Uniform, // an initial automatic zoom to fit
        'initialContentAlignment': go.Spot.Center,
        initialDocumentSpot: go.Spot.Center,
        initialViewportSpot: go.Spot.Center,
        'contentAlignment': go.Spot.Center,
        'layout': $(go.ForceDirectedLayout, // automatically spread nodes apart
          { maxIterations: 200, defaultSpringLength: 30, defaultElectricalCharge: 100 }),
        // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
        // 'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: $(go.GraphLinksModel,
          {
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          })
      });

  diagram.nodeTemplate =
    $(go.Node, "Auto",  // the whole node panel
      { locationSpot: go.Spot.Center },
      // define the node's outer shape, which will surround the TextBlock
      $(go.Shape, "Rectangle",
        { fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }), stroke: "black" }),
      $(go.TextBlock,
        { font: "bold 10pt helvetica, bold arial, sans-serif", margin: 4 },
        new go.Binding("text", "text"))
    );
  diagram.toolManager.mouseMoveTools.insertAt(2, new DragZoomingTool());

  diagram.linkTemplate =
    $(go.Link,  // the whole link panel
      $(go.Shape,  // the link shape
        { stroke: "black" }),
      $(go.Shape,  // the arrowhead
        { toArrow: "standard", stroke: null }),
      $(go.Panel, "Auto",
        $(go.Shape,  // the label background, which becomes transparent around the edges
          {
            fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
            stroke: null
          }),
        $(go.TextBlock,  // the label text
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#555555",
            margin: 4
          },
          new go.Binding("text", "text"))
      )
    );


  return diagram;
}

function swapKeyValue(data) {
  console.log(data)
  let list = []

  for(let keys in data) {
    let temp = {}
    temp['key'] = data[keys];
    temp['text'] = keys;
    list.push(temp)
  }
  return list
}
function hash(data) {
  let dict = {}
  data.map((el, idx) => {
    let conceptName = el.conceptName
    conceptName = conceptName.replace("Concept", "")
    dict[conceptName] = idx;
  })
  return dict
}

function mapHash(data, hash) {
  console.log(hash)
  console.log(data)
  // let newData = []
  data.map((dict,idx) => {
    for(let key in dict) {
      if (dict.hasOwnProperty(key)) {
        if(key === 'from') {
          console.log(key, dict[key]);
          dict[key] = hash[dict[key].replace("Concept", "")]
        }
        if(key === 'to') {
          console.log(key, dict[key]);
          let conceptName = dict[key]
          conceptName = conceptName.replace("Concept", "")
          console.log(conceptName)
          console.log(hash[conceptName])
          console.log("hey")
          dict[key] = hash[conceptName]
        }
      }
    }
  })
  return data
}


class Concept extends React.Component {
  state = {
    data: [],
    linkDataArray: [],
    nodeDataArray: [],
  };

  async componentDidMount() {
    const response = await getData();
    const relationships = await API.getAllRelationship();
    // const tempData = mapToKeys(response)
    const tempData = hash(response)
    const linkDataArray = mapHash(relationships, tempData)
    const nodeDataArray = swapKeyValue(tempData)
    console.log(linkDataArray)
    console.log(nodeDataArray)
    this.setState({
      data: response,
      linkDataArray: linkDataArray,
      nodeDataArray: nodeDataArray
    })

  }

  handleModelChange(changes) {
    console.log(changes)
  }

  render() {
    return (
      <>
        <Navbar />
        <main ref="main">

          <ReactDiagram initDiagram={initDiagram} divClassName={'diagram-component'}
                        nodeDataArray={this.state.nodeDataArray}
                        linkDataArray={this.state.linkDataArray}
                        onModelChange={this.handleModelChange}

          />
          {/* SVG separator */}

          <section className={"section section-lg"}>
            <Container>
              <Button
                className="mt-4"
                color="primary"
                href="/new-concept-page"
              >
                New Concept
              </Button>
              <ConceptTable data={this.state.data}/>
            </Container>
          </section>
          <SimpleFooter />
        </main>
      </>
    );
  }
}

export default Concept;