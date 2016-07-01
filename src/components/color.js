function rainbowColor(length, maxLength) {
  var i = (length * 255 / maxLength);
  var r = Math.round(Math.sin(0.024 * i) * 127 + 128);
  var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
  var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);
  return '#' + [r, g, b].map(function(x){
        return ("0" + Math.round(x*255).toString(16)).slice(-2);
      }).join('');
}

export default function val2col(val) {
  return rainbowColor(val, 150);
}
