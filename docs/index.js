const chart_ids = ['confirmed', 'death', 'recovered']

Promise.all([
    d3.text("time_series_19-covid-Confirmed.csv"),
    d3.text("time_series_19-covid-Deaths.csv"),
    d3.text("time_series_19-covid-Recovered.csv"),
]).then(function(file_contents) {
  const confirmed_text = file_contents[0]
  const confirmed_region_values = d3.csvParseRows(confirmed_text)
    .map(row => row.slice(0, 2))
    .slice(1)
    .map(pair => pair.reverse().filter(v => v != '')
      .join(' - '))

  populate_geo_options(confirmed_region_values, '#geo')
  const labels = ['x'].concat(confirmed_region_values)

  const charts_and_data = file_contents.map(function(text, i){
    var rows = d3.csvParseRows(text)
    var counts = rows.map(row => row.slice(4))
    counts[0] = counts[0].map(date_str => formate_date(date_str))

    var full_plot_data = counts.map((c, i) => [labels[i]].concat(c))
    var default_data = [
      full_plot_data[0],
      full_plot_data[labels.indexOf('Singapore')],
      full_plot_data[labels.indexOf('US - Massachusetts')]
    ]

    return [plot_time_series(chart_ids[i], default_data), full_plot_data]
  })

  const charts = charts_and_data.map(cd => cd[0])
  const data = charts_and_data.map(cd => cd[1])

  const select_els = document.querySelectorAll('input.geo-select')
  select_els.forEach(el => el.addEventListener('change', e => {
    var label_index = labels.indexOf(el.value)
    if (label_index >= 0) {
      charts_and_data.forEach(cd => {
        var chart = cd[0]
        var full_plot_data = cd[1]
        var plot_data = [full_plot_data[0], full_plot_data[label_index]]
        chart.load({
          unload: true,
          columns: plot_data
        })
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
  const parent_el = document.querySelector(el_selector)
  if (parent_el.innerHTML != '') return

  const options = values.map(v => '<option value="' + v + '">')
  parent_el.innerHTML = options.join('\n')
}

function plot_time_series(el_id, data) {
  var chart = c3.generate({
    bindto: '#' + el_id,
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
