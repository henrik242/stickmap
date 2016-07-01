const React = require('react');
const Draggable = require('react-draggable');
const val2col = require('./color.js');

const Vertex = React.createClass({

  handleDrag: function (e, ui) {
    this.props.updateVertex({
      id: this.props.vertex.id,
      x: ui.x / this.props.zoomFactor,
      y: ui.y / this.props.zoomFactor,
      depth: this.props.vertex.depth
    });
  },

  edit() {
    this.props.editVertexAction(this.props.vertex.id)
  },

  render() {
    let size = 10;
    let color = val2col(this.props.vertex.depth);

    return <Draggable bounds="parent"
                      onDrag={this.handleDrag}
                      position={{
                        x: (this.props.vertex.x) * this.props.zoomFactor,
                        y: (this.props.vertex.y) * this.props.zoomFactor}}>

      <div className="vertex" onClick={this.edit}>
        <svg height="30" width="20">
          <circle cx="10"
                  cy="5"
                  r="4"
                  stroke="black"
                  strokeDasharray={this.props.editing ? "2,2" : "none"}
                  strokeWidth={this.props.editing ? 4 : 1}
                  fill={color} />
          <text x="10" y="20"
                textAnchor="middle"
                stroke="black"
                strokeWidth="0"
                dy="5" dx="0">{this.props.vertex.depth}</text>
        </svg>
      </div>
    </Draggable>
  }
});

module.exports = Vertex;
