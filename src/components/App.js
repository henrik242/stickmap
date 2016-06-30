require('../styles/app.css');

const React = require('react');
const Draggable = require('react-draggable');
const val2col = require('./color.js');


//const ListContainer = require('./ListContainer.jsx');

const App = React.createClass({
  getInitialState() {
    return {
      vertices: [
        {id: 0, depth: 12, x: 100, y: 100},
        {id: 1, depth: 24, x: 200, y: 200},
        {id: 2, depth: 10, x: 50, y: 20},
        {id: 3, depth: 90, x: 10, y: 1}
      ],
      edges: [
        {fromId: 0, toId: 1},
        {fromId: 1, toId: 2},
        {fromId: 1, toId: 3}
      ],
      nextVertexId: 4,
      editVertexId: -1,
      editVertexDepth: 0
    }
  },

  addVertex() {
    this.setState({
      vertices: this.state.vertices.concat({id: this.state.nextVertexId, depth: 0, x: 0, y: 0}),
      nextVertexId: this.state.nextVertexId + 1
    })
  },

  enableEditVertex(vertexId) {
    if (this.state.editVertexId !== -1 && this.state.editVertexId !== vertexId) {

      let ids = [ this.state.editVertexId, vertexId ].sort();
      let found = this.state.edges.findIndex(((elem) => elem.fromId === ids[0] && elem.toId === ids[1]));

      if (found !== -1) {
        // Remove edge
        let newState = this.state.edges;
        newState.splice(found, 1);
        this.setState({
          edges: newState
        });
      } else {
        // Add edge
        this.setState({
          edges: this.state.edges.concat({fromId: ids[0], toId: ids[1]})
        });
      }
    } else {
      // Enable edit mode
      this.setState({
        editVertexId: vertexId,
        editVertexDepth: this.getVertex(vertexId).depth
      });
    }
  },

  getVertex(vertexId) {
    return this.state.vertices.find((element) => element.id === vertexId);
  },

  getVertexIndex(vertexId) {
    return this.state.vertices.findIndex((element) => element.id === vertexId);
  },

  handleEditChange(e) {
    this.setState({
      editVertexDepth: e.target.value
    });
  },

  submitEditVertex(e) {
    if (e.keyCode === 13) {
      let theVertex = this.getVertex(this.state.editVertexId);
      theVertex.depth = e.target.value;
      this.updateVertex(theVertex);
    }
  },

  updateVertex(newVertex) {
    let newState = this.state.vertices;
    newState[this.getVertexIndex(newVertex.id)] = newVertex;
    this.setState({
      vertices: newState,
      editVertexId: -1
    });
  },

  selectVertex(vertexId) {
    console.log("click");
    if (this.state.editVertexId =! -1 && this.state.editVertexId != vertexId) {
      this.setState({
        edges: this.state.edges.concat({ fromId: this.state.editVertexId, toId: vertexId})
      });
    }
  },

  componentDidUpdate() {
    if (this.state.editVertexId !== -1) {
      this.refs.editDepthInput.focus();
    }
  },

  render(){
    let addVertexButton = <button onClick={this.addVertex}>Add vertex</button>;
    let editVertexInput = this.state.editVertexId > -1 && <div>Edit depth:
          <input ref="editDepthInput" onChange={this.handleEditChange} onKeyDown={this.submitEditVertex} value={this.state.editVertexDepth}/></div>;

    return (
      <div>
        {addVertexButton}
        {editVertexInput}

        <div className="canvas">
          {this.state.edges.map((edge, index) =>
            <Edge key={index}
                  fromVertex={this.getVertex(edge.fromId)}
                  toVertex={this.getVertex(edge.toId)} />)}

          {this.state.vertices.map((vertex) =>
            <Vertex key={vertex.id}
                  edit={vertex.id === this.state.editVertexId}
                  vertex={vertex}
                  enableEditVertex={this.enableEditVertex}
                  updateVertex={this.updateVertex}
                  selectVertex={this.selectVertex} />)}

          </div>
      </div>
    )
  }
});

const Edge = React.createClass({

  render() {
    let from = this.props.fromVertex;
    let to = this.props.toVertex;
    let startColor = val2col(from.x < to.x ? from.depth : to.depth);
    let endColor = val2col(from.x >= to.x ? from.depth : to.depth);
    let gradId = "edgegradient" + from.id + "-" + to.id;
    let stroke = "url(#" + gradId + ")";

    return <div className="edge">
      <svg width="800" height="600">
        <defs>
          <linearGradient id={gradId}>
            <stop offset="0%" stopColor={startColor} />
            <stop offset="1000%" stopColor={endColor} />
          </linearGradient>
        </defs>
        <line x1={from.x + 20}
              y1={from.y + 20}
              x2={to.x + 20}
              y2={to.y + 20}
              stroke={stroke}
              strokeWidth="2"/>
      </svg>
    </div>

  }
});

const Vertex = React.createClass({

  handleDrag: function (e, ui) {
    this.props.updateVertex({id: this.props.vertex.id, x: ui.x, y: ui.y, depth: this.props.vertex.depth });
  },

  edit() {
    this.props.enableEditVertex(this.props.vertex.id)
  },

  select() {
    this.props.selectVertex(this.props.vertex.id)
  },

  render() {
    let vertexsize = 20;

    let color = val2col(this.props.vertex.depth);

    return <Draggable bounds="parent"
                      onDrag={this.handleDrag}
                      position={{x: this.props.vertex.x, y: this.props.vertex.y}}>
      <div className="vertex" onDoubleClick={this.edit}>

        <svg height={vertexsize} width={vertexsize}>
          <circle cx={vertexsize/2}
                  cy={vertexsize/2}
                  r={(vertexsize-2)/2}
                  stroke="black"
                  strokeWidth={this.props.edit ? 2 : 1}
                  fill={color} />

          <text x="50%" y="50%"
                textAnchor="middle"
                stroke="black"
                strokeWidth="0"
                dy="5" dx="0">{this.props.vertex.depth}</text>
        </svg>
      </div>
    </Draggable>
  }
});

module.exports = App;
