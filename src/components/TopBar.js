var React = require('react');
var file = require('./file');

var TopBar = React.createClass({

  getInitialState() {
    return {
      currentVertexDepth: 0
    }
  },

  saveState() {
    file.saveState(this.props.state);
  },

  loadState(event) {
    file.loadState(this.props.setNewState, event);
  },

  clickLoadMap() {
    this.refs.loadButton.click()
  },

  submitZoom(num) {
    this.props.setZoomFactor(Math.round(Math.max(0.2, this.props.state.zoomFactor + num) * 10) / 10);
  },

  handleEditVertex(e) {
    if (e.target.value.match(/^[0-9]*$/)) {
      this.setDepth(e.target.value);
    }
  },

  submitEditVertex(e) {
    switch (e.keyCode) {
      case 13: // enter
        this.setDepth(e.target.value);
        // fallthrough!
      case 27: // escape
        this.setCurrentVertexDepth(0);
        break;
      case 38: // arrow up
        e.preventDefault();
        this.setDepth(this.state.currentVertexDepth + 1);
        break;
      case 40: // arrow down
        e.preventDefault();
        this.setDepth(this.state.currentVertexDepth - 1);
        break;
    }
  },

  setDepth(depth) {
    depth = Math.max(0, depth);
    let vertex = this.props.getCurrentVertex();
    vertex.depth = depth;
    this.props.updateVertex(vertex);

    this.setCurrentVertexDepth(depth);
  },

  setCurrentVertexDepth(depth) {
    this.setState({
      currentVertexDepth: depth
    })

  },

  componentWillReceiveProps(nextProps) {
    let current = nextProps.getCurrentVertex();
    if (current) {
      this.setCurrentVertexDepth(current.depth);
    }
  },

  render() {

    let zoomInput = <span><button onClick={this.submitZoom.bind(this, -0.2)}>-</button>
      {Math.round(this.props.state.zoomFactor * 100)}%<button onClick={this.submitZoom.bind(this, 0.2)}>+</button></span>;

    let saveButton = <span><button onClick={this.saveState}>Save map</button></span>;

    let loadButton = <span>
      <button onClick={this.clickLoadMap}>Load map</button>
      <input ref="loadButton" style={{display: 'none'}} type="file" onChange={this.loadState} />
    </span>;

    let addVertexButton = <button onClick={this.props.addVertex}>Add station</button>;

    let editVertexInput = this.props.state.currentVertexId !== -1 && <span>
          <button onClick={this.props.deleteVertex}>Delete station</button>
          <span style={{paddingLeft: "10"}}>Depth:
          <input ref="editDepthInput" size="3" onChange={this.handleEditVertex} onKeyDown={this.submitEditVertex} value={this.state.currentVertexDepth}/>
        </span></span>;

    return <div>
          {zoomInput}
          {saveButton}
          {loadButton}
          {addVertexButton}
          {editVertexInput}
    </div>;

  }
});

module.exports = TopBar;