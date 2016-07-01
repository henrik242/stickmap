require('../styles/app.css');

const React = require('react');
const file = require('./file.js');
const Vertex = require('./Vertex');
const Edge = require('./Edge');

const App = React.createClass({
  getInitialState() {
    return {
      vertices: [
        {id: 0, depth: 6, x: 10, y: 10},
        {id: 1, depth: 12, x: 50, y: 80},
        {id: 2, depth: 32, x: 160, y: 180},
        {id: 3, depth: 50, x: 250, y: 170},
        {id: 4, depth: 72, x: 100, y: 300}
      ],
      edges: [
        {fromId: 0, toId: 1},
        {fromId: 1, toId: 2},
        {fromId: 2, toId: 3},
        {fromId: 2, toId: 4}
      ],
      nextVertexId: 5,
      zoomFactor: 1.0,
      editVertexId: -1,
      editVertexDepth: 0,
      editVertexClicked: false,
      editVertexClickTimer: undefined
    }
  },

  addVertex() {
    let depth = 0, x = 0, y = 0;
    let newEdges = this.state.edges.slice();

    if (this.state.editVertexId !== -1) {
      let editVertex = this.getVertex(this.state.editVertexId);
      x = editVertex.x + 20;
      y = editVertex.y + 20;
      depth = editVertex.depth;
      newEdges.push({fromId: editVertex.id, toId: this.state.nextVertexId});
    }

    this.setState({
      edges: newEdges,
      vertices: this.state.vertices.concat({id: this.state.nextVertexId, depth: depth, x: x, y: y}),
      nextVertexId: this.state.nextVertexId + 1
    })
  },

  deleteVertex() {
    let newEdges = this.state.edges.slice().filter((edge) =>
      edge.fromId !== this.state.editVertexId && edge.toId !== this.state.editVertexId);

    let newVertices = this.state.vertices.slice().filter((vertex) =>
      vertex.id !== this.state.editVertexId);

    this.setState({
      edges: newEdges,
      vertices: newVertices,
      editVertexId: -1
    });
  },

  editVertexAction(vertexId) {
    if (this.state.editVertexClicked) {
      // Doubleclick!

      clearTimeout(this.state.editVertexClickTimer);
      this.setState({
        editVertexClickTimer: undefined,
        editVertexClicked: false
      });

      if (this.state.editVertexId !== -1 && this.state.editVertexId !== vertexId) {

        let newEdge = [this.state.editVertexId, vertexId].sort();
        let found = this.state.edges.findIndex(((elem) => elem.fromId === newEdge[0] && elem.toId === newEdge[1]));

        if (found !== -1) {
          // Remove edge
          let newEdges = this.state.edges.slice();
          newEdges.splice(found, 1);

          this.setState({
            edges: newEdges
          });

        } else {
          // Add edge
          this.setState({
            edges: this.state.edges.concat({fromId: newEdge[0], toId: newEdge[1]})
          });
        }
      }
      return;
    }

    let doubleClickTimeout = function() {
      this.setState({
        editVertexId: vertexId,
        editVertexDepth: this.getVertex(vertexId).depth,
        editVertexClicked: false
      });
    }.bind(this);

    this.setState({
      editVertexClicked: true,
      editVertexClickTimer: setTimeout(doubleClickTimeout, 200)
    })
  },

  getVertex(vertexId) {
    return this.state.vertices.find((elem) => elem.id === vertexId);
  },

  handleEditVertex(e) {
    this.setDepth(e.target.value);
  },

  submitEditVertex(e) {
    switch (e.keyCode) {
      case 13: // enter
        this.setDepth(e.target.value);
        // fallthrough!
      case 27: // escape
        this.setState({
          editVertexDepth: 0,
          editVertexId: -1
        });
        break;
      case 38: // arrow up
        e.preventDefault();
        this.setDepth(this.state.editVertexDepth + 1);
        break;
      case 40: // arrow down
        e.preventDefault();
        this.setDepth(this.state.editVertexDepth - 1);
        break;
    }
  },

  setDepth(depth) {
    depth = Math.max(0, depth);
    let vertex = this.getVertex(this.state.editVertexId);
    vertex.depth = depth;
    this.updateVertex(vertex);

    this.setState({
      editVertexDepth: depth
    })
  },

  updateVertex(newVertex) {
    let newVertices = this.state.vertices.map((oldVertex) =>
        oldVertex.id === newVertex.id ? newVertex : oldVertex);

    this.setState({
      vertices: newVertices
    });
  },

  componentDidUpdate() {
    if (this.state.editVertexId !== -1) {
      //this.refs.editDepthInput.focus();
      //this.refs.editDepthInput.select();
    }
  },

  clickLoadMap() {
    this.refs.loadButton.click()
  },

  submitZoom(num) {
    this.setState({
      zoomFactor: Math.ceil(Math.max(0.2, this.state.zoomFactor + num) * 10) / 10
    })
  },

  saveState() {
    file.saveState(this.state);
  },

  loadState(event) {
    file.loadState(this.setState.bind(this), event);
  },

  render(){
    let saveButton = <span><button onClick={this.saveState}>Save map</button></span>;

    let loadButton = <span>
      <button onClick={this.clickLoadMap}>Load map</button>
      <input ref="loadButton" style={{display: 'none'}} type="file" onChange={this.loadState} />
    </span>;

    let addVertexButton = <button onClick={this.addVertex}>Add station</button>;

    let editVertexInput = this.state.editVertexId !== -1 && <span>
          <button onClick={this.deleteVertex}>Delete station</button>
          <span style={{paddingLeft: "10"}}>Depth:
          <input ref="editDepthInput" size="3" onChange={this.handleEditVertex} onKeyDown={this.submitEditVertex} value={this.state.editVertexDepth}/>
        </span></span>;

    let zoomInput = <span><button onClick={this.submitZoom.bind(this, -0.2)}>-</button>
      <button onClick={this.submitZoom.bind(this, 0.2)}>+</button></span>;

    return (
      <div>
        {zoomInput}
        {saveButton}
        {loadButton}
        {addVertexButton}
        {editVertexInput}

        <div className="canvas">
          {this.state.edges.map((edge, index) =>
            <Edge key={index}
                  fromVertex={this.getVertex(edge.fromId)}
                  toVertex={this.getVertex(edge.toId)}
                  zoomFactor={this.state.zoomFactor} />)}

          {this.state.vertices.map((vertex) =>
            <Vertex key={vertex.id}
                  editing={vertex.id === this.state.editVertexId}
                  vertex={vertex}
                  editVertexAction={this.editVertexAction}
                  updateVertex={this.updateVertex}
                  zoomFactor={this.state.zoomFactor} />)}

          </div>
      </div>
    )
  }
});

module.exports = App;
