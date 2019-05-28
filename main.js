function x(theta) {
  return Math.sin(theta);
}

function y(theta) {
  return -Math.cos(theta);
}

function p_theta_0(energy_frac) {
  return Math.sqrt(2*9.8*(energy_frac + 1))
}

function energy(theta, p_theta) {
  return 0.5*Math.pow(p_theta, 2) - 9.8*Math.cos(theta)
}

function linspace(start, stop, n) {
  var arr = [];
  var step = (stop - start)/(n - 1)
  for (var i = 0; i < n; i++) {
    arr.push(start + step*i);
  }

  return arr
}

function generate_energy_surface(theta_max, p_theta_max, n, m) {
  var th = []
  var p_th = []
  var energ = []

  p_th_axis = linspace(-p_theta_max, p_theta_max, m)
  th_axis   = linspace(  -theta_max,   theta_max, n)

  for (var i = 0; i < n; i++) {
    energ.push(new Array(m).fill(0))
    for (var j = 0; j < m; j++) {
      energ[i][j] = energy(th_axis[i], p_th_axis[j])
    }
  }

  return [th_axis, p_th_axis, energ]
}

var energy_frac = -0.95; // energy = energy_frac*m*g*l = energy_frac*9.8 (m = l = 1.0)
var theta = 0.0;
var p_theta = p_theta_0(energy_frac);
var dt = 0.015;

var energy_surf = generate_energy_surface(Math.PI*1.5, p_theta_0(2.0)*1.5, 100, 100)


Plotly.plot('phasespace', [{
  x: energy_surf[1],
  y: energy_surf[0],
  z: energy_surf[2],
  type: 'surface',
  zsmooth: 'best',
  colorscale: 'Viridis'
}], {
  xaxis: {
    title: 'theta'
  },
  yaxis: {
    title: 'p_theta'
  },
  zaxis: {
    title: 'E'
  }
}, {
  showSendToCloud:true
})

Plotly.plot('pendulum', [{
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

  if (theta > Math.PI) {
    theta -= 2*Math.PI
  } else if (theta < -Math.PI) {
    theta += 2*Math.PI
  }
}

function update () {
  compute();

  Plotly.animate('pendulum', {
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
