d3.text('time_series_19-covid-Confirmed.csv').then(function(text) {
  const rows = d3.csvParseRows(text)
  var counts = rows.map(row => row.slice(4))
  counts[0] = counts[0].map(date_str => formate_date(date_str))

  const regions = rows.map(row => row.slice(0, 2))
  const region_values = regions.slice(1)
    .map(pair => pair.reverse().filter(v => v != '')
      .join(' - '))
  populate_geo_options(region_values, '#geo')

  const labels = ['x'].concat(region_values)
  const full_plot_data = counts.map((c, i) => [labels[i]].concat(c))
  const default_data = [
    full_plot_data[0],
    full_plot_data[labels.indexOf('Singapore')],
    full_plot_data[labels.indexOf('US - Massachusetts')]
  ]
  const chart = plot_time_series(default_data)

  const select_els = document.querySelectorAll('input.geo-select')
  select_els.forEach(el => el.addEventListener('change', e => {
    var label_index = labels.indexOf(el.value)
    if (label_index >= 0) {
      console.log(label_index, el.value)
      var plot_data = [full_plot_data[0], full_plot_data[label_index]]
      chart.load({
        unload: true,
        columns: plot_data
      })
    }
  }))
})


// date in raw data comes in format m/d/y e.g. 2/12/20
function formate_date(date_str) {
  var nums = date_str.split('/')
  nums = nums.map(n => {
    if (n.length == 1) {
      return '0' + n // pad day and month with zero
    }
    return n
  })
  return nums.join('/')
}

function populate_geo_options(values, el_selector) {
  const options = values.map(v => '<option value="' + v + '">')
  const parent_el = document.querySelector(el_selector)
  parent_el.innerHTML = options.join('\n')
}

function plot_time_series(data) {
  var chart = c3.generate({
    bindto: '#raw',
    data: {
      x: 'x',
      xFormat: '%m/%d/%y',
      columns: data
    },
    transition: {
        duration: 100
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {format: '%m/%d'}
      }
    }
  })
  return chart
}
