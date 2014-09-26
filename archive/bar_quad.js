var outer_width = 530,
    outer_height = 300,
	margin = {top: 10, right: 10, bottom: 10, left: 10},
	padding = {top: 20, right: 20, bottom: 20, left: 20},
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
	
var list = ['msrp', 'engine_size'];//['msrp', 'engine_size', 'horsepower', 'cmpg'];	
var svg = {};
list.forEach(function(attri) {
	svg[attri] = d3.select('.' + attri).append('svg')
    .attr('width', outer_width)
    .attr('height', outer_height)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
});
	
d3.json('data/cars.json', function(error, data) {
	data = data.slice(0,5);
	console.log(data);
	
	x.domain(data.map(key));
	xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')
		.ticks(data.length);
	
	list.forEach(function(attri) {
		var g = svg[attri].append('g')
			.attr('transform', 'translate(0,' + margin.bottom + ')')
			.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);
			
		console.log(g.selectAll('line'));
		
		var y = d3.scale.linear()
			.domain([d3.min(data, function(d) { return +d[attri]; }),
				  d3.max(data, function(d) { return +d[attri]; })])
			.range([height*0.2, height*0.8]);	

		var bars = svg[attri].selectAll('rect')
			.data(data, key)
			.enter();

		bars.append('rect')
			.attr('class', 'bar')
			.attr('height', function(d) { return y(+d[attri]); })
			.attr('width', function(d) { return x.rangeBand(); })
			.attr('x', function(d, i) { return x(i); })
			.attr('y', function(d) { return height-y(+d[attri]); })
			.attr("fill", function(d){ return color(key(d)); });	
	});	
});