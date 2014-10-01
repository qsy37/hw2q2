var margin = {left: 40, right: 40, top: 40, bottom: 40},
	width = 500,
	height = 500,
	axis_length = 400,
	radians = 2*Math.PI,
	num_attributes = 5,
	radius = Math.min(width/2, height/2);

var theta = 360/num_attributes;

var svg = d3.select('.vis').append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g');

var axis_labels = ['Price', 'Engine Size', 'Horsepower', 'City MPG', 'Highway MPG'];	

axis_labels.forEach(function(d, j) {
	svg.append('svg:line')
		.attr('x1', width/2)
		.attr('y1', height/2)
		.attr('x2', width/2*(1-Math.sin(radians*j/num_attributes)))
		.attr('y2', height/2*(1-Math.cos(radians*j/num_attributes)))
		.style("stroke", "black")
		.style("stroke-opacity", "0.75")
		.style("stroke-width", "1px");
});

var axis = svg.selectAll('.axis')
	.data(['Price', 'Engine Size', 'Horsepower', 'City MPG', 'Highway MPG'])
	.enter()
	.append('g')
	.attr('class', 'axis')
	.append('text')
	.attr('class', function(d, j) { return 'axis-text-item-'+j; })
	.attr('x', function(d, j) { return width/2*(1-Math.sin(radians*j/num_attributes)); })
	.attr('y', function(d, j) { 
		if (height/2*(1-Math.cos(radians*j/num_attributes)) < height/2) {
			return height/2*(1-Math.cos(radians*j/num_attributes)) - 15; }
		else {
			return height/2*(1-Math.cos(radians*j/num_attributes)) + 15;
		} })
	.attr('dy', '.35em')
	.style('text-anchor', 'middle')
	.text(function(d) { return d; });
	
var price_y = d3.scale.linear()
	.range([0, axis_length]);
var engine_y = d3.scale.linear()
	.range([0, axis_length]);
var horsepower_y = d3.scale.linear()
	.range([0, axis_length]);
var cmpg_y = d3.scale.linear()
	.range([0, axis_length]);
var hmpg_y = d3.scale.linear()
	.range([0, axis_length]);
var color = d3.scale.category10();

// Initialize tooltip
var tip = d3.tip()
	.attr("class", "d3-tip")
	.html(function(d) { 
		return "<table><tr><td><strong>Manufacturer:</strong></td> <td>"+
								d.manufacturer +"</td></tr> <tr><td><strong>Price:</strong</td> <td>"+
								d.msrp+"</td></tr> <tr><td><strong>Engine Size:</strong></td> <td>"+
								d.engine-size+"</td></tr></table>"; });

d3.json('manu.json', function(error, data) {
	
	price_y.domain([0, d3.max(data, function(d) { return +d.msrp; })]);
	engine_y.domain([0, d3.max(data, function(d) { return +d.engine_size; })]);
	horsepower_y.domain([0, d3.max(data, function(d) { return +d.horsepower; })]);
	cmpg_y.domain([0, d3.max(data, function(d) { return +d.cmpg; })]);
	hmpg_y.domain([0, d3.max(data, function(d) { return +d.hmpg; })]);
	data = [data[1], data[15], data[21], data[24], data[31]];//data.slice(18, 23);
	var dataset = [],
		manufacturers = [],
		attr_list = ['msrp', 'engine_size', 'horsepower', 'cmpg', 'hmpg'];
	data.forEach(function(d) {
		dataset.push([{name: 'msrp', value: price_y(+d.msrp)},
					  {name: 'engine_size', value: engine_y(+d.engine_size)},
					  {name: 'horsepower', value: horsepower_y(+d.horsepower)},
					  {name: 'cmpg', value: cmpg_y(+d.cmpg)},
					  {name: 'hmpg', value: hmpg_y(+d.hmpg)}]);
		manufacturers.push(d.manufacturer);		
	});
	
	var pts = {};
	for (var k = 0; k < dataset.length; k++) {
		pts[k] = [];
	}
	var manufacturer = svg.selectAll('.manu')
		.data(dataset)
		.enter()
		.append('g')
		.attr('class', 'manu')
		.datum(function(d, k) {
			d.forEach(function(i) { i.k = k; });
			return d;
		});
		
	var nodes = manufacturer.selectAll('.attrib').data(function(d) { 
			return d;
			})
		.enter()
		.append('svg:circle')
		.attr('class', 'node')
		.attr('cx', function(d, j) { 
			pts[d.k].push([width/2*(1 - d.value/height*Math.sin(radians*j/num_attributes)),
				 height/2 *(1 - d.value/height*Math.cos(radians*j/num_attributes))]);
			return width/2*(1 - d.value/height*Math.sin(radians*j/num_attributes)); })
		.attr('cy', function(d, j) { 
			return height/2 *(1 - d.value/height*Math.cos(radians*j/num_attributes)); })
		.attr('r', 5)
		.attr('fill', function(d) { return color(d.k); });

	var poly_pts = [];
	for (var k = 0; k < num_attributes; k++) {
		poly_pts.push(pts[k]);
	}
	
	var poly = manufacturer.selectAll('.poly')
		.data(poly_pts)
		.enter()
		.append('g')
		.attr('class', 'poly')
		.append('svg:polygon')
		.attr('class', function(d, k) {
			return 'radar-chart-item-'+k;
		})
		.attr('points', function(d, k) {
			pt_str = '';
			for(var j = 0; j < d.length; j++ ) {
				pt_str = pt_str + d[j][0] + ',' + d[j][1] + ' ';
			}
			return pt_str;
		})
		.style('stroke', function(d, k) { return color(k); })
		.style('stroke-width', '0.5px')
		.style('fill', function(d, k) { return color(k); })
		.style('fill-opacity', 0.03)
		.on('mouseover', function (d){
			z = "polygon."+d3.select(this).attr("class");
			manufacturer.selectAll("polygon")
			 .transition(200)
			 .style("fill-opacity", 0.03); 
			manufacturer.selectAll(z)
			 .transition(200)
			 .style("fill-opacity", .25);
		})
		.on('mouseout', function(){
			manufacturer.selectAll("polygon")
			 .transition(200)
			 .style("fill-opacity", 0.03);
		});
		
	var legend = svg.selectAll('.legend')
		.data(manufacturers)
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', 'translate(80, 0)');
		
	legend.append('rect')
		.attr('x', width - 18)
		.attr('y', function(d, i) { return i*22; })
		.attr('width', 20)
		.attr('height', 20)
		.style('fill', function(d, i) { return color(i); })
		.style('stroke', 'none');
		
	legend.append('text')
		.attr('x', width - 24)
		.attr('y', function(d, i) { return i*22 + 9; })
		.attr('dy', '.35em')
		.style('text-anchor', 'end')
		.text(function(d) { return d; });
	legend.on('mouseover', function(d, i) {
		z = 'polygon.radar-chart-item-' + i;
		manufacturer.selectAll('polygon')
			.transition(200)
			.style('fill-opacity', 0.03);
		manufacturer.selectAll(z)
			.transition(200)
			.style('fill-opacity', 0.25);
		})
		.on('mouseout', function() {
			manufacturer.selectAll('polygon')
				.transition(200)
				.style('fill-opacity', 0.03);
		});
		

});