const React = require('react');
const val2col = require('./color.js');

const Edge = React.createClass({

  render() {
    let from = this.props.fromVertex;
    let to = this.props.toVertex;

    let startColor = val2col(from.x < to.x ? from.depth : to.depth);
    let endColor = val2col(from.x >= to.x ? from.depth : to.depth);
    let gradId = "edgegradient" + from.id + "-" + to.id;
    let stroke = "url(#" + gradId + ")";

    let width = Math.abs(from.x - to.x);
    let height = Math.abs(from.y - to.y);
    let top = Math.min(from.y, to.y);
    let left = Math.min(from.x, to.x);

    let x1 = from.x - left;
    let y1 = from.y - top;
    let x2 = to.x - left;
    let y2 = to.y - top;

    // let style = {transform: 'translate(' + (left + 20) + 'px, ' + (top + 15) + 'px)'};
    let style = {position: 'absolute', left: left + 20, top: top + 15};

    return <div style={style} className="edge">
      <svg viewport="0 0 {width} {height}">
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