// TODO: think about usefully add function to manipulate with data?
function plot(container, data) {

    if (data.length == 0)
	return;


    // Extract only one component (x,y,z), for data series
    var extract_data = function(data, component) {
	var result = [];

	data.forEach(function(el) {
	    result.push([ el.timestamp, el.data[component] ]);
	});

	return result;
    };

    // Compute euclidian distnce from zero point
    var compute_distance = function(data) {
	var result = [];

	data.forEach(function(el) {
	    var distance;
	    var x = el.data.x;
	    var y = el.data.y;
	    var z = el.data.z;

	    distance = Math.sqrt(x*x + y*y + z*z);

	    console.log(distance);

	    result.push([ el.timestamp, distance ]);
	});

	return result;
    };

    // XXX: above functions evaluated inline in chart

    new Highcharts.StockChart({
	chart: {
	    renderTo: container,
	    alignTicks: false
	},

	rangeSelector: {
	    selected: 1
	},

	title: {
	    text: 'Accelerometer data'
	},

	yAxis: [{
	    title: {
		text: 'X'
	    },
	    height: 100,
	    offset: 0,
	    lineWidth: 2
	}, {
	    title: {
		text: 'Y'
	    },
	    top: 180,
	    height: 100,
	    offset: 0,
	    lineWidth: 2
	}, {
	    title: {
		text: 'Z'
	    },
	    top: 300,
	    height: 100,
	    offset: 0,
	    lineWidth: 2
	},{
	    title: {
		text: 'Distance'
	    },
	    top: 410,
	    height: 100,
	    offset: 0,
	    lineWidth: 2
	}],

	series: [{
	    name: 'Accl X',
	    data: extract_data(data, "x"),
	    yAxis: 0,

	}, {
	    name: 'Accl Y',
	    data: extract_data(data, "y"),
	    yAxis: 1,

	}, {
	    name: 'Accl Z',
	    data: extract_data(data, "z"),
	    yAxis: 2,

	}, {
	    name: 'Distance',
	    data: compute_distance(data),
	    yAxis: 3,
	}]
    });
}