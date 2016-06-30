function hsv2rgb(h, s, v) {
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){
        return ("0" + Math.round(x*255).toString(16)).slice(-2);
      }).join('');
}

function rainbowColor(length, maxLength)
{
  var i = (length * 255 / maxLength);
  var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
  var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
  var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);
  return '#' + [r, g, b].map(function(x){
        return ("0" + Math.round(x*255).toString(16)).slice(-2);
      }).join('');

  //return 'rgb(' + r + ',' + g + ',' + b + ')';
}

export default function val2col(val) {
  return rainbowColor(val, 150);
}

function val2colOLD(val) {
  if (val > 100) {
    val = 100;
  }
  else if (val < 0) {
    val = 0;
  }
  var h= Math.floor((100 - val) * 120 / 100);
  var s = Math.abs(val - 50)/50;
  var v = 1;
  return hsv2rgb(h, s, v);
}

