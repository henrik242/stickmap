var React = require('react');
var file = require('./file');

var TopBar = React.createClass({

  saveState() {
    file.saveState(this.props.state);
  },

  loadState(event) {
    file.loadState(this.props.setState, event);
  },

  clickLoadMap() {
    this.refs.loadButton.click()
  },

  submitZoom(num) {
    this.props.setState({
      zoomFactor: Math.ceil(Math.max(0.2, this.props.state.zoomFactor + num) * 10) / 10
    })
  },

  render() {
    let saveButton = <span><button onClick={this.saveState}>Save map</button></span>;

    let loadButton = <span>
      <button onClick={this.clickLoadMap}>Load map</button>
      <input ref="loadButton" style={{display: 'none'}} type="file" onChange={this.loadState} />
    </span>;

    let addVertexButton = <button onClick={this.props.addVertex}>Add station</button>;

    let editVertexInput = this.props.state.editVertexId !== -1 && <span>
          <button onClick={this.props.deleteVertex}>Delete station</button>
          <span style={{paddingLeft: "10"}}>Depth:
          <input ref="editDepthInput" size="3" onChange={this.props.handleEditVertex} onKeyDown={this.props.submitEditVertex} value={this.props.state.editVertexDepth}/>
        </span></span>;

    let zoomInput = <span><button onClick={this.submitZoom.bind(this, -0.2)}>-</button>
      <button onClick={this.submitZoom.bind(this, 0.2)}>+</button></span>;

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