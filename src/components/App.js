require('../styles/app.css');

const React = require('react');
const Vertex = require('./Vertex');
const Edge = require('./Edge');
const TopBar = require('./TopBar');

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
      editVertexClicked: false,
      editVertexClickTimer: undefined
    }
  },

  getEditVertex() {
    if (this.state.editVertexId !== -1) {
      let vertex = this.getVertex(this.state.editVertexId);
      if (vertex) return vertex;
      console.log("Illegal vertex ID: " + this.state.editVertexId);
      this.setState({
        editVertexId: -1
      })
    }
    return false;
  },

  isEditVertex(id) {
    return id === this.state.editVertexId;
  },

  addVertex() {
    let depth = 0, x = 0, y = 0;
    let newEdges = this.state.edges.slice();

    let editVertex = this.getEditVertex();
    if (editVertex) {
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
      !this.isEditVertex(edge.fromId) && !this.isEditVertex(edge.toId));

    let newVertices = this.state.vertices.slice().filter((vertex) =>
      !this.isEditVertex(vertex.id));

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

      if (this.getEditVertex() && !this.isEditVertex(vertexId)) {

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
        editVertexClicked: false
      });
    }.bind(this);

    this.setState({
      editVertexClicked: true,
      editVertexClickTimer: setTimeout(doubleClickTimeout, 200)
    })
  },

  getVertex(vertexId) {
    let vertex = this.state.vertices.find((elem) => elem.id === vertexId);
    if (vertex) {
      return vertex;
    }
    console.log("Tried to fetch illegal ID " + vertexId);
  },

  updateVertex(newVertex) {
    let newVertices = this.state.vertices.map((oldVertex) =>
        oldVertex.id === newVertex.id ? newVertex : oldVertex);

    this.setState({
      vertices: newVertices
    });
  },

  render(){
    return (
      <div>

        <TopBar state={this.state} 
                getVertex={this.getVertex} 
                setState={this.setState.bind(this)}
                deleteVertex={this.deleteVertex}
                updateVertex={this.updateVertex}
                addVertex={this.addVertex}
                getEditVertex={this.getEditVertex}
        />
        
        <div className="canvas">
          {this.state.edges.map((edge, index) =>
            <Edge key={`edge-${edge.fromId}-${edge.toId}`}
                  fromVertex={this.getVertex(edge.fromId)}
                  toVertex={this.getVertex(edge.toId)}
                  zoomFactor={this.state.zoomFactor} />)}

          {this.state.vertices.map((vertex) =>
            <Vertex key={`vertex-${vertex.id}`}
                  editing={this.isEditVertex(vertex.id)}
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
