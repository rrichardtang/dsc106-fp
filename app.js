import {nest} from 'd3-collection';

function finalproject(){
    var filePath="cleaned.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
    question6(filePath);
}
var rowConverter = function(d){
			return {
                case_month: d.case_month,
				res_state: d.state_name,
                state_fips_code: d.state_fips_code,
				res_county: d.res_county,
                county_fips_code: d.county_fips_code,
                age_group: d.age_group,
                sex: d.sex,
				race: d.race,
				symptom_status: d.symptom_status,
                hosp_yn: d.hosp_yn,
                death_yn: d.death_yn,
                underlying_conditions_yn: d.underlying_conditions_yn
			};
		}
var question1=function(filePath){
    
}

var question2=function(filePath){
    
}

var question3=function(filePath){
	var width = 960;
	var height = 500;
	var lowColor = '#f9f9f9'
	var highColor = '#bc2a66'

    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		gen_grouped = d3.rollup(data, v => v.length, d => d.res_state);
		console.log(gen_grouped);

		// hospitalized = data.filter(function(d){return d.hosp_yn == 'Yes';});
		// h_grouped = d3.rollup(hospitalized, v => v.length, d => d.res_state);
		// console.log(h_grouped);

		// deceased = data.filter(function(d){return d.death_yn == 'Yes';})
		// d_grouped = d3.rollup(deceased, v => v.length, d => d.res_state);
		// console.log(h_grouped);

		var minVal = d3.min(gen_grouped);
		var maxVal = d3.max(gen_grouped);
		var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])

		var projection = d3.geoAlbersUsa()
						  .translate([width / 2, height / 2]) // translate to center of screen
  						  .scale([1000]);
  		var path = d3.geoPath().projection(projection);

		var svg = d3.select("#q3_plot")
				    .append("svg")
				    .attr("width", width)
				    .attr("height", height);

		 d3.json("us-states.json", function(json) {
		 	for (var i = 0; i < data.length; i++) {
		 		var dataState = data[i].state;
		 		var dataValue = data[i].value;
		 		for (var j = 0; j < json.features.length; j++) {
			        var jsonState = json.features[j].properties.name;
			        if (dataState == jsonState) {
			          // Copy the data value into the JSON
			          json.features[j].properties.value = dataValue;
			          // Stop looking through the JSON
			          break;
        			}
		 		}
		 	}
		 })

		 svg.selectAll("path")
	      .data(json.features)
	      .enter()
	      .append("path")
	      .attr("d", path)
	      .style("stroke", "#fff")
	      .style("stroke-width", "1")
	      .style("fill", function(d) { return ramp(d.properties.value) });

	    var w = 140, h = 300;

		var key = d3.select("#q3_plot")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.attr("class", "legend");

		var legend = key.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", highColor)
			.attr("stop-opacity", 1);
			
		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", lowColor)
			.attr("stop-opacity", 1);

		key.append("rect")
			.attr("width", w - 100)
			.attr("height", h)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(0,10)");

		var y = d3.scaleLinear()
			.range([h, 0])
			.domain([minVal, maxVal]);

		var yAxis = d3.axisRight(y);

		key.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(41,10)")
			.call(yAxis)
    })
}

var question4=function(filePath){
    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
        console.log(data);

        var gender = ["Male", "Female"];
        var count = [];

        for (let j = 0; j < gender.length; j++) {
            var dic = {"Gender": gender[j], "Symptomatic": 0, "Asymptomatic": 0};
            for (let k = 0; k < data.length; k++) {
                const curr = data[k];
                if (gender[j] == curr.sex && curr.death_yn == "Yes") {
                    dic[curr.symptom_status] += 1;
                }
            }
            count.push(dic);
        }

        console.log(count);

        var colors = function(i){
			colorarray = ["#c3c3df", "#64469e"];
			return colorarray[i];
		}

        var stack = d3.stack().keys(["Symptomatic", "Asymptomatic"]);
		var series = stack(count);
		console.log(series);

        var width = 600;
        var height = 600;
        var padding = 70;

		var svg = d3.select("#q4_plot").append("svg")
				.attr("height", height)
				.attr("width", width)

		var tooltip = d3.select("#q4_plot").append("div")
                            .style("opacity", 0)
                            .attr("class", "tooltip")
                            .style("background-color", "white")
                            .style("position", "absolute")
                            .style("border-width", "2px")
                            .style("border-radius", "5px")
                            .style("padding", "5px");

		var x = d3.scaleBand()
						.domain(count.map(function(d){
                            return d.Gender;
                        }))
						.range([padding, width-padding])
						.padding(0.5);

		var y = d3.scaleLinear()
						.domain([0, d3.max(count, function(d){ 
							return d.Symptomatic + d.Asymptomatic;
						})])
						.range([height-padding, padding]);
        
        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

		var groups = svg.selectAll(".gbars")
						.data(series).enter().append("g")
						.attr("class", "gbars")
						.attr("fill", function(d, i){
							return colors(i);
						});
						
		groups.selectAll("rect")
					.data(function(d){
						console.log(d);
						return d;
					}).enter().append("rect")
					.attr("x", function(d){
					    return x(d.data.Gender);
					})
    				.attr("y", function (d) {
						return y(d[1]);
					})
					.attr("width", x.bandwidth())
					.attr("height", function(d){
						return y(d[0])-y(d[1]);
					})
					.on("mouseover", (e,d)=>{
                        tooltip.style("opacity", 1);
                    })
                    .on("mousemove", (e,d)=>{
                        tooltip.html((d[1] - d[0])).style("left", e.pageX + "px").style("top", e.pageY + "px");
                    })
                    .on("mouseout", (e,d)=>{
                        tooltip.style("opacity", 0);
                    });

        svg.append("g").call(x_axis).attr("class", "x_axis")
                .attr("transform", "translate(0," + (height - padding) + ")");
        
        svg.append("g").call(y_axis).attr("class", "y_axis")
				.attr("transform", "translate(" + padding + ",0)");

		svg.append("circle").attr("cx",460).attr("cy",80).attr("r", 6).style("fill", "#c3c3df")
        svg.append("circle").attr("cx",460).attr("cy",100).attr("r", 6).style("fill", "#64469e")
        svg.append("text").attr("x", 480).attr("y", 80).text("Symptomatic").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#c3c3df")
        svg.append("text").attr("x", 480).attr("y", 100).text("Asymptomatic").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#64469e")
    })
}

var question5=function(filePath){
    const file_data = d3.csv(filePath, rowConverter);
    var width = 600;
    var height = 600;
    var padding = 70;
    var svg = d3.select("#q5_plot")
  				.append("svg")
  				.attr("width", width)
    			.attr("height", height)
    file_data.then(function(data){
    	grouped = d3.rollup(data, v => v.length, d => d.case_month);
    	months = []
    	var minVal = d3.min(gen_grouped);
		var maxVal = d3.max(gen_grouped);

    	for (let i=0; i < grouped.length; i++) {
    		months.push(grouped[i][0]);
    	}

    	var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
		    .key(function(d) { return d[0];})
		    .rollup(function(d) {
		      q1 = d3.quantile(d.map(function(g) { return g[1];}).sort(d3.ascending),.25)
		      median = d3.quantile(d.map(function(g) { return g[1];}).sort(d3.ascending),.5)
		      q3 = d3.quantile(d.map(function(g) { return g[1];}).sort(d3.ascending),.75)
		      interQuantileRange = q3 - q1
		      min = q1 - 1.5 * interQuantileRange
		      max = q3 + 1.5 * interQuantileRange
		      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
		    })
		    .entries(data)


    	var x = d3.scaleBand()
    			.domain(months)
    			.range([ 0, width ]);
    	var y = d3.scaleLinear()
    			.domain([minval,maxVal])
    			.range([height,0])
    	svg.selectAll("vertLines")
	    .data(grouped)
	    .enter()
	    .append("line")
	      .attr("x1", function(d){return(x(d.key))})
	      .attr("x2", function(d){return(x(d.key))})
	      .attr("y1", function(d){return(y(d.value.min))})
	      .attr("y2", function(d){return(y(d.value.max))})
	      .attr("stroke", "black")
	      .style("width", 40)

	    var boxWidth = 100
	    svg.selectAll("boxes")
		    .data(grouped)
		    .enter()
		    .append("rect")
		      .attr("x", function(d){return(x(d.key)-boxWidth/2)})
	          .attr("y", function(d){return(y(d.value.q3))})
	          .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
	          .attr("width", boxWidth )
	          .attr("stroke", "black")
	          .style("fill", "#69b3a2")

	    svg.selectAll("medianLines")
		   .data(grouped)
		   .enter()
		   .append("line")
		      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
		      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
		      .attr("y1", function(d){return(y(d.value.median))})
		      .attr("y2", function(d){return(y(d.value.median))})
		      .attr("stroke", "black")
		      .style("width", 80)
    })
}

var question6=function(filePath){
    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
        console.log(data);

        var month = [];
        var count = [];

        for (let i = 0; i < data.length; i++) {
            if (!month.includes(data[i].case_month)) {
                month.push(data[i].case_month);
            }
        }

        month.sort();

        for (let j = 0; j < month.length; j++) {
            var dic = {"Month": month[j], "Male": 0, "Female": 0};
            for (let k = 0; k < data.length; k++) {
                const curr = data[k];
                if (month[j] == curr.case_month && curr.hosp_yn == "Yes") {
                    dic[curr.sex] += 1;
                }
            }
            count.push(dic);
        }

        console.log(count);

        var colors = function(i){
			colorarray = ["#827cb9", "pink"];
			return colorarray[i];
		}

        var stack = d3.stack().keys(["Male", "Female"]);
		var series = stack(count);
		console.log(series);

        var width = 800;
        var height = 600;
        var padding = 100;

		var svg = d3.select("#q6_plot").append("svg")
				.attr("height", height)
				.attr("width", width)

		var x = d3.scaleBand()
						.domain(count.map(function(d){
                            return d.Month;
                        }))
						.range([padding, width-padding])
						.padding(0.1);

		var y = d3.scaleLinear()
						.domain([0, d3.max(count, function(d){ 
							return d.Male + d.Female;
						})])
						.range([height-padding, padding]);
        
        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

		var groups = svg.selectAll(".gbars")
						.data(series).enter().append("g")
						.attr("class", "gbars")
						.attr("fill", function(d, i){
							return colors(i);
						});
						
		groups.selectAll("rect")
					.data(function(d){
						console.log(d)
						return d;
					}).enter().append("rect")
					.attr("x", function(d){
					    return x(d.data.Month);
					})
    				.attr("y", function (d) {
						return y(d[1]);
					})
					.attr("width", x.bandwidth())
					.attr("height", function(d){
						return y(d[0])-y(d[1]);
					});

		groups.selectAll("text")
						.data(function(d){
							return d;
						}).enter().append("text")
						.attr("x", function(d, i){
							return x(d.data.Month);
						})
						.attr("y", function (d) {
							return y(d[0]);
						})
						.text(function(d){
							return d[1]-d[0];
						})
						.attr("fill", "black");

        svg.append("g").call(x_axis).attr("class", "x_axis")
                .attr("transform", "translate(0," + (height - padding) + ")");
        
        svg.append("g").call(y_axis).attr("class", "y_axis")
				.attr("transform", "translate(" + padding + ",0)");

		svg.append("circle").attr("cx",700).attr("cy",80).attr("r", 6).style("fill", "#827cb9")
        svg.append("circle").attr("cx",700).attr("cy",100).attr("r", 6).style("fill", "pink")
        svg.append("text").attr("x", 720).attr("y", 80).text("Male").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#827cb9")
        svg.append("text").attr("x", 720).attr("y", 100).text("Female").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "pink")
    })
}
