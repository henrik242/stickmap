require('../styles/app.css');

const React = require('react');
const Draggable = require('react-draggable');

//const ListContainer = require('./ListContainer.jsx');

const App = React.createClass({
  getInitialState() {
    return {
      nodes: [
        {id: 0, depth: 0, x: 0, y: 0},
        {id: 1, depth: 0, x: 100, y: 100}
      ],
      nextNodeId: 2,
      editNodeId: -1,
      editNodeDepth: 0
    }
  },

  addNode() {
    this.setState({
      nodes: this.state.nodes.concat({id: this.state.nextNodeId, depth: 0, x: 0, y: 0}),
      nextNodeId: this.state.nextNodeId + 1
    })
  },

  enableEditNode(node) {
    this.setState({
      editNodeId: node.id,
      editNodeDepth: node.depth
    });
    console.log(this.state);
  },
  
  handleEditChange(e) {
    this.setState({
      editNodeDepth: e.target.value
    });
  },

  editNode(e) {
    if (e.keyCode === 13) {
      let theNode = this.state.nodes[this.state.editNodeId];
      let newState = this.state.nodes;
      newState[this.state.editNodeId] = {id: theNode.id, depth: e.target.value, x: theNode.x, y: theNode.y};
      this.setState({
        nodes: newState,
        editNodeId: -1
      });
    }
  },

  updateNodes(nodeId) {

  },

  handleDrag: function (e, ui) {
    // const {x, y} = this.state.deltaPosition;
    // this.setState({
    //   deltaPosition: {
    //     x: x + ui.deltaX,
    //     y: y + ui.deltaY
    //   }
    // });
  },

  render(){
    return (
      <div>
        <button onClick={this.addNode}>Add node</button>

        {this.state.editNodeId > -1 && <div>Edit depth:
          <input ref="editDepth" onChange={this.handleEditChange} onKeyDown={this.editNode} value={this.state.editNodeDepth}/></div>}

        {this.state.nodes.map((node) =>
          <Draggable onDrag={this.handleDrag} key={node.id} defaultPosition={{x: node.x, y: node.y}}>
            <div onDoubleClick={this.enableEditNode.bind(this, node)}>
              <svg height="100" width="100">
                <circle cx="50" cy="50" r="20" stroke="black" strokeWidth={this.state.editNodeId === node.id ? 2 : 0} fill="red" />
                <text x="50%" y="50%" textAnchor="middle" stroke="black" strokeWidth="0" dy="5" dx="0">{node.depth}</text>
              </svg>
            </div>
          </Draggable>
        )}
      </div>
    )
  }
});

module.exports = App;
