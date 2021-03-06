const React = require('react');
const val2col = require('./color.js');

const Edge = React.createClass({

  render() {
    let from = this.props.fromVertex;
    let to = this.props.toVertex;
    let zoom = this.props.zoomFactor;

    let startColor = val2col(from.x < to.x ? from.depth : to.depth);
    let endColor = val2col(from.x >= to.x ? from.depth : to.depth);
    let gradId = "edgegradient" + from.id + "-" + to.id;
    let stroke = "url(#" + gradId + ")";

    let top = Math.min(from.y, to.y) * zoom;
    let left = Math.min(from.x, to.x) * zoom;

    let x1 = (from.x * zoom) - left;
    let y1 = (from.y * zoom) - top;
    let x2 = (to.x * zoom) - left;
    let y2 = (to.y * zoom) - top;

    let width = Math.max(Math.abs(x1 - x2), 20);
    let height = Math.max(Math.abs(y1 - y2), 20);

    let style = {
      position: 'absolute',
      left: left + 20,
      top: top + 15
    };

    return <div style={style} className="edge">
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={gradId}>
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        <line x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth="2"/>
      </svg>
    </div>

  }
});

module.exports = Edge;