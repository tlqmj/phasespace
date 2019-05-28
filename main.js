function x(theta) {
  return Math.sin(theta);
}

function y(theta) {
  return -Math.cos(theta);
}

function p_theta_0(energy_frac) {
  return Math.sqrt(2*9.8*(energy_frac + 1))
}

var energy_frac = -0.95; // energy = energy_frac*m*g*l = energy_frac*9.8 (m = l = 1.0)
var theta = 0.0;
var p_theta = p_theta_0(energy_frac);
var dt = 0.015;


Plotly.plot('graph', [{
  x: [0.0, x(theta)],
  y: [0.0, y(theta)],
  mode: 'lines+markers'
}], {
  xaxis: {
    title: 'x',
    range: [-1.1, 1.1]
  },
  yaxis: {
    title: 'y',
    range: [-1.1, 1.1],
    scaleanchor:'x'
}}, {
  showSendToCloud:true
})

function compute () {
  p_theta += -9.8*Math.sin(theta)*dt  // m = l = 1.0
  theta   += p_theta*dt
}

function update () {
  compute();

  Plotly.animate('graph', {
    data: [{x: [0.0, x(theta)], y: [0.0, y(theta)]}]
  }, {
    transition: {
      duration: 0,
    },
    frame: {
      duration: 0,
      redraw: false,
    }
  });

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
