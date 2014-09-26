var outer_width = 550,
    outer_height = 290,
	margin = {top: 40, right: 50, bottom: 40, left: 50},
	padding = {top: 30, right: 30, bottom: 30, left: 30},
	inner_width = outer_width - margin.left - margin.right,
	inner_height = outer_height - margin.top - margin.bottom,
	width = inner_width - padding.left - padding.right,
	height = inner_height - padding.top - padding.bottom;

var key = function(d) {
	return d.name;
}

var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], 0.05);
	
var color = d3.scale.category20c();
	
var attribute_list = ['msrp', 'engine_size', 'horsepower', 'cmpg'];//['cmpg', 'hmpg']];	
var svg = {};
attribute_list.forEach(function(entry) {
	svg[entry] = d3.select('.' + entry).append('svg')
		//.attr('viewBox', '0 0 ' + outer_width + ' ' + outer_height)
		.attr('width', outer_width)
		.attr('height', outer_height)
		.attr('preserveAspectRatio', 'xMinYMid')
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
});
	
d3.json('data/cars.json', function(error, data) {
console.log(data.filter(function(d) {return +d.sports === 1; }));
	data = data.filter(function(d) {return +d.sports === 1; });
	data = data.slice(6, 11);

	x.domain(data.map(key));
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')
	
	attribute_list.forEach(function(entry) {
		var g = svg[entry].append('g')
			.attr('transform', 'translate(0,5)')
			.append('g')
			.attr('class', 'x-axis axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);
			
		g.selectAll('.tick text')
			.call(wrap, x.rangeBand());
		
		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return +d[entry]; })])
			.range([height, 0]);	

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(5);
		
		svg[entry].append('g')
			.attr('class', 'y-axis axis')
			.call(yAxis);
			
		var bars = svg[entry].selectAll('rect')
			.data(data, key)
			.enter();

		bars.append('rect')
			.attr('class', 'bar')
			.attr('height', function(d) { return height-y(+d[entry]); })
			.attr('width', function(d) { return x.rangeBand(); })
			.attr('x', function(d, i) { return x(d.name); })
			.attr('y', function(d) { return y(+d[entry]); })
			.attr("fill", function(d){ return color(key(d)); });	
	});	
});

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

/*var aspect = outer_width/outer_height,
    chart = d3.selectAll(".vis");
d3.select(window).on("resize", chart.each(function() {
    var targetWidth = this.parentNode.offsetWidth;
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
}));*/

function get_sports_cars(d) {
	
}