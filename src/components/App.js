require('../styles/app.css');

const React = require('react');
const Vertex = require('./Vertex');
const Edge = require('./Edge');
const TopBar = require('./TopBar');
const hotkey = require('react-hotkey');
hotkey.activate('keydown');


const App = React.createClass({
  mixins: [hotkey.Mixin('handleHotkey')],
  
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
      currentVertexId: -1,
      transient: {
        currentVertexDepthHasFocus: false,
        vertexClicked: false,
        vertexClickedTimer: undefined
      }
    }
  },

  handleHotkey: function(e) {
    e.preventDefault();

    let update = function(isX, increase) {
      let current = this.getCurrentVertex();
      if (current && !this.state.transient.currentVertexDepthHasFocus) {
        if (isX) {
          current.x = current.x + (increase ? 10 : -10);
        } else {
          current.y = current.y + (increase ? 10 : -10);
        }
        this.updateVertex(current);
      }
    }.bind(this);

    switch (e.keyCode) {
      case 9: // tab
        let arrayIndex = 0;
        for (let i = 0; i < this.state.vertices.length - 1; i++) {
          if (this.state.vertices[i].id == this.state.currentVertexId) {
            arrayIndex = i + 1;
            break;
          }
        }
        this.setState({
          currentVertexId: this.state.vertices[arrayIndex].id
        });
        return;
      case 27: // escape
        this.currentVertexDepthHasFocus(false);
        return this.setCurrentVertex(-1);
      case 37: // left
        return update(true, false);
      case 38: // up
        return update(false, false);
      case 39: // right
        return update(true, true);
      case 40: // down
        return update(false, true);
      case 187: // plus
        return this.addVertex();
      case 189: // minus
        return this.deleteVertex();
    }
  },

  setCurrentVertex(vertexId) {
    this.setState({
      currentVertexId: vertexId
    })
  },

  getCurrentVertex() {
    if (this.state.currentVertexId !== -1) {
      let vertex = this.getVertex(this.state.currentVertexId);
      if (vertex) return vertex;
      this.setCurrentVertex(-1);
    }
    return false;
  },

  isCurrentVertex(id) {
    return id === this.state.currentVertexId;
  },

  addVertex() {
    let depth = 0, x = parseInt(Math.random() * 30 + 10), y = parseInt(Math.random() * 30 + 10);
    let updatedEdges = this.state.edges.slice();

    let current = this.getCurrentVertex();
    if (current) {
      x = current.x + x;
      y = current.y + y;
      depth = current.depth;
      updatedEdges.push({fromId: current.id, toId: this.state.nextVertexId});
    }

    this.setState({
      edges: updatedEdges,
      currentVertexId: this.state.nextVertexId,
      vertices: this.state.vertices.concat({id: this.state.nextVertexId, depth: depth, x: x, y: y}),
      nextVertexId: this.state.nextVertexId + 1
    })
  },

  deleteVertex() {
    let updatedEdges = this.state.edges.slice().filter((edge) =>
      !this.isCurrentVertex(edge.fromId) && !this.isCurrentVertex(edge.toId));

    let updatedVertices = this.state.vertices.slice().filter((vertex) =>
      !this.isCurrentVertex(vertex.id));

    this.setCurrentVertex(-1);
    this.setState({
      edges: updatedEdges,
      vertices: updatedVertices
    });
  },

  setVertexClicked(clicked, timer) {
    this.setState({
      transient: {
        vertexClicked: clicked,
        vertexClickedTimer: timer
      }
    });
  },

  editVertexAction(vertexId) {
    if (this.state.transient.vertexClicked) {
      // Doubleclick!

      clearTimeout(this.state.transient.vertexClickedTimer);
      this.setVertexClicked(false, undefined);

      if (this.getCurrentVertex() && !this.isCurrentVertex(vertexId)) {

        let edge = [this.state.currentVertexId, vertexId].sort();
        let found = this.state.edges.findIndex(((elem) => elem.fromId === edge[0] && elem.toId === edge[1]));

        if (found !== -1) {
          // Remove edge
          let updatedEdges = this.state.edges.slice();
          updatedEdges.splice(found, 1);

          this.setState({
            edges: updatedEdges
          });

        } else {
          // Add edge
          this.setState({
            edges: this.state.edges.concat({fromId: edge[0], toId: edge[1]})
          });
        }
      }
      return;
    }

    let doubleClickTimeout = function() {
      this.setCurrentVertex(vertexId);
      this.setState({
        transient: {
          vertexClicked: false
        }
      });
    }.bind(this);

    this.setVertexClicked(true, setTimeout(doubleClickTimeout, 200));
  },

  getVertex(vertexId) {
    let vertex = this.state.vertices.find((elem) => elem.id === vertexId);
    if (vertex) {
      return vertex;
    }
    console.log("Tried to fetch nonexisting vertex with ID " + vertexId);
    return false;
  },

  updateVertex(newVertex) {
    let newVertices = this.state.vertices.map((oldVertex) =>
        oldVertex.id === newVertex.id ? newVertex : oldVertex);

    this.setState({
      vertices: newVertices
    });
  },

  setNewState(newState) {
    if (Array.isArray(newState.edges) && Array.isArray(newState.vertices)) {
      this.setState({
        ...newState
      });
    }
  },

  setZoomFactor(zoom) {
    this.setState({
      zoomFactor: zoom
    })
  },

  currentVertexDepthHasFocus(hasFocus) {
    this.setState({
      transient: {
        currentVertexDepthHasFocus: hasFocus
      }
    })
  },
  
  render(){
    return (
      <div>
        <TopBar state={this.state}
                setZoomFactor={this.setZoomFactor}
                deleteVertex={this.deleteVertex}
                updateVertex={this.updateVertex}
                addVertex={this.addVertex}
                getCurrentVertex={this.getCurrentVertex}
                setCurrentVertex={this.setCurrentVertex}
                setNewState={this.setNewState}
                currentVertexDepthHasFocus={this.currentVertexDepthHasFocus}
        />
        
        <div className="canvas" onkeydown={this.testing}>
          {this.state.edges.map((edge, index) =>
            <Edge key={`edge-${edge.fromId}-${edge.toId}`}
                  fromVertex={this.getVertex(edge.fromId)}
                  toVertex={this.getVertex(edge.toId)}
                  zoomFactor={this.state.zoomFactor}
            />)}

          {this.state.vertices.map((vertex) =>
            <Vertex key={`vertex-${vertex.id}`}
                  editing={this.isCurrentVertex(vertex.id)}
                  vertex={vertex}
                  editVertexAction={this.editVertexAction}
                  updateVertex={this.updateVertex}
                  zoomFactor={this.state.zoomFactor}
            />)}
          </div>
      </div>
    )
  }
});

module.exports = App;
