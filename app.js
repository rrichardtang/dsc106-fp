function finalproject(){
    var filePath="cleaning_data.csv";
    question1(filePath);
    question2(filePath);
    question3("statesdata.csv");
    question4(filePath);
    question5(filePath);
    question6(filePath);
}
var rowConverter = function(d){
		return {
            case_month: d.case_month,
			res_state: d.res_state,
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
	var file_data = d3.csv(filePath, function(d){
		if (d.symptom_status == "Symptomatic") {
            	return rowConverter(d);
        }
	});

	file_data.then(function(d) {
    	d.forEach(s => {s.case_month=d3.timeParse("%Y-%m")(s.case_month)});

		var grouped = Array.from(d3.rollup(d, v => v.length, d => d.case_month));
		var max_cases = d3.max(grouped, function(row) { return row[1]; });
    	
    	var flattened = [];

    	for (i = 0; i < grouped.length; i++) {
    		const curr_date = grouped[i][0];
    		const curr_cases = grouped[i][1];
    		var curr_year = d3.timeFormat("%Y-%m")(curr_date).substring(0, 4);

    		flattened.push({year: curr_year, date: curr_date, cases: curr_cases});
    	}

    	var width = 1000;
        var height = 800;
        var margin = 50;

        var svg_q1 = d3.select("#q1_plot").append("svg")
                        .attr("width", width)
                    	.attr("height", height)
                        .append("g")
                        .attr("transform", "translate(100, -20)");

        function plot(dataset, year) {
        	console.log(dataset)
        	var xScale = d3.scaleTime().domain(d3.extent(dataset, item => item.date)).range([margin, width-margin]);
	        // var xScale = d3.scaleBand().domain(dataset.map(function(item) {return item.date;})).range([margin, width-margin]);
        	var yScale = d3.scaleLinear().domain([0, max_cases])
                                     .range([height-margin, margin])

        	var xAxis = d3.axisBottom(xScale).ticks(dataset.length).tickFormat(d3.timeFormat("%m-%Y"))
        	var yAxis = d3.axisLeft(yScale)

        	var ToolTip = d3.select("#q1_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        	svg_q1.append("g").attr("class", "axis").attr("transform", "translate(50,0)").call(yAxis).append("text").attr("text-anchor", "end")
        	svg_q1.append("g").attr("class", "axis").attr("transform", "translate(0,750)").call(xAxis).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)")

	        svg_q1.append("path")
					.attr("class", "line").datum(dataset)
					.attr("fill", "none")
                    .attr("stroke", "green")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                    .x(function(item) {
                        return xScale(item.date);
                    })
                    .y(function(item) {
                        return yScale(item.cases);
                    }));

        	svg_q1.selectAll(".q1scatter").data(dataset)
                                    .enter()
                                    .append("circle")
                                    .attr("class", "q1scatter")
                                    .attr("cx", function(item) {
                                        		return xScale(item.date);
                                        	})
                                    .attr("cy", function(item) {
                                        		return yScale(item.cases);
                                        	})
                                    .attr("r", 5)
                                    .on("mouseover", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)
                                        ToolTip.html(d.cases).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mousemove", function(e, d) {
                                        ToolTip.transition().duration(100).style("opacity", 0.9)
                                        ToolTip.html(d.cases).style("left", e.pageX + "px").style("top", e.pageY + "px")
                                    }).on("mouseout", function(e, d) {
                                        ToolTip.style("opacity", 0)
                                    })

            svg_q1.append("text")             
            .attr("transform", "translate(" + ((width-margin)/2) + " ," + (height + 10) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        	svg_q1.append("text")             
            .attr("transform", "translate(-20," + ((height-margin)/2) + ")rotate(90)")
            .style("text-anchor", "middle")
            .text("# of COVID-19 Deaths");
	    }

        plot(flattened, "All")
        
        function changeYear() {

			d3.selectAll("g.axis").remove()
        	d3.selectAll("path.line").remove()
            d3.selectAll(".q1scatter").remove()

        	var radioValue = d3.select("input[name='year']:checked").node().value;

            if (radioValue != "All") {
            	var sub_flattened = flattened.filter(function (item) {
		        	return (item.year == radioValue)
		    	})
		        plot(sub_flattened, radioValue)
            } else {
            	plot(flattened, radioValue)
            }
        }

        d3.select("#q1_All").on("change", changeYear)
        d3.select("#q1_2020").on("change", changeYear)
        d3.select("#q1_2021").on("change", changeYear)
        d3.select("#q1_2022").on("change", changeYear)
    })
}

var question2=function(filePath){
    
}

var question3=function(filePath){
	var width = 960;
	var height = 500;
	var lowColor = '#f9f9f9'
	var highColor = '#bc2a66'
	const rowConverter = function(d){
		return {
			state : d.state,
			infections : parseInt(d.infections)
		};
	}
    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		console.log(data);
		var dataArray = [];
		for (var d = 0; d < data.length; d++) {
			dataArray.push(data[d].infections);
		}
		var minVal = d3.min(dataArray);
		var maxVal = d3.max(dataArray);

		console.log(dataArray);

		var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
		var projection = d3.geoAlbersUsa()
						  .translate([width / 2, height / 2]) // translate to center of screen
  						  .scale([1000]);
  		var path = d3.geoPath().projection(projection);
		var svg = d3.select("#q3_plot")
				    .append("svg")
				    .attr("width", width)
				    .attr("height", height);

		var geo = d3.json("us-states.json");
		geo.then(function(json) {
		 	for (var i = 0; i < data.length; i++) {
		 		var dataState = data[i].state; // state name
		 		var dataValue = data[i].infections; // state infections
		 		// console.log(dataState);
		 		// console.log(dataValue);
		 		// Find the corresponding state inside the GeoJSON
		 		for (var j = 0; j < json.features.length; j++) {
			        var jsonState = json.features[j].properties.name;
			        if (dataState == jsonState) {
			        	// console.log(dataState);
			        	// Copy the data value into the JSON
			        	json.features[j].properties.value = dataValue;
			          	// Stop looking through the JSON
			          	break;
        			}
		 		}
		 	}

		 	svg.selectAll("path")
		      .data(json.features)
		      .enter()
		      .append("path")
		      .attr("d", path)
		      // .style("stroke", "#fff")
		      .style("stroke","#000000")
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
		});
    });
}

var question4=function(filePath){
	var parseTime = d3.timeParse("%Y-%m");
    var rowConverter = function(d){
		return {
			case_month: parseTime(d.case_month),
			res_state: d.res_state,
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

    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		var groupby = d3.group(data, function(d){
            return d.death_yn == "Yes";
        })
        var valid_data = groupby.get(true);
		
        var years = ["2020", "2021", "2022"];
		var crrent_year = years[0];
		var gender = ["Male", "Female"];
		var final = {};

		for (let i = 0; i < years.length; i++) {
			var year_count = [];
			for (let j = 0; j < gender.length; j++) {
				var dic = {"Gender": gender[j], "Symptomatic": 0, "Asymptomatic": 0};
				for (let k = 0; k < valid_data.length; k++) {
					const curr = valid_data[k];
					if (curr.case_month.getFullYear() == years[i] && curr.sex == gender[j]) {
						dic[curr.symptom_status] += 1;
					}
				}
				year_count.push(dic);
			}
			final[years[i]] = year_count;
		}

		console.log(final);

        var colors = function(i){
			colorarray = ["#64469e", "#c3c3df"];
			return colorarray[i];
		}

		var stack = d3.stack().keys(["Symptomatic", "Asymptomatic"]);
		var current_data = stack(final[crrent_year]);
		console.log(current_data);

        var width = 600;
        var height = 600;
        var padding = 70;

		var tooltip = d3.select("#q4_plot").append("div")
                            .style("opacity", 0)
                            .style("background-color", "white")
                            .style("position", "absolute")
                            .style("border-width", "2px")
                            .style("border-radius", "5px")
                            .style("padding", "5px");

		var svg = d3.select("#q4_plot").append("svg")
				.attr("height", height)
				.attr("width", width);

		svg.append("text")
			.attr("x", width/2)
			.attr("y", padding/2)
			.text("Covid Deaths for Symptomatic and Asymptomatic")
			.style("font-size", "16px")
			.attr("text-anchor", "middle");

		var x = d3.scaleBand()
						.domain(gender)
						.range([padding, width-padding])
						.padding(0.5);

		var y = d3.scaleLinear()
						.domain([0, d3.max(final[crrent_year], function(d){ 
							return d.Symptomatic + d.Asymptomatic;
						})])
						.range([height-padding, padding]);
        
        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

		var groups = svg.selectAll(".gbars")
							.data(current_data).enter().append("g")
							.attr("class", "gbars")
							.attr("fill", function(d, i){
								return colors(i);
							});

		groups.selectAll(".gbars")
					.data(function(d){
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

		function change_plot(data) {
			var current_data = stack(data);
			d3.selectAll(".gbars").remove();
			d3.selectAll(".y_axis").remove();

			y.domain([0, d3.max(data, function(d){ 
									return d.Symptomatic + d.Asymptomatic;
							})]);
			svg.append("g").call(y_axis).attr("class", "y_axis")
					.attr("transform", "translate(" + padding + ",0)");

			var groups = svg.selectAll(".gbars")
							.data(current_data).enter().append("g")
							.attr("class", "gbars")
							.attr("fill", function(d, i){
								return colors(i);
							});

			groups.selectAll(".gbars")
					.data(function(d){
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
		}

		d3.select("#radio_4").attr("name", "year2")
                .on("change", function(d) {
                    change_plot(final[d.target.value]);
                })
        
		svg.append("circle").attr("cx",480).attr("cy",80).attr("r", 6).style("fill", "#64469e")
        svg.append("circle").attr("cx",480).attr("cy",100).attr("r", 6).style("fill", "#c3c3df")
        svg.append("text").attr("x", 500).attr("y", 80).text("Symptomatic").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#64469e")
        svg.append("text").attr("x", 500).attr("y", 100).text("Asymptomatic").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#c3c3df")
    })
}

var question5=function(filePath){
	var rowConverter = function(d){
		return {
            case_month: d.case_month,
			res_state: d.res_state,
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

	const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		var month = [];
		var deaths = [];
		var hosp = [];

        for (let i = 0; i < data.length; i++) {
            if (!month.includes(data[i].case_month)) {
                month.push(data[i].case_month);
            }
        }

        month.sort();

		for (let i = 0; i < month.length; i++) {
			var count_death = 0;
			var count_hosp = 0;
			for (let j = 0; j < data.length; j++) {
				const curr = data[j];
				if (curr.case_month == month[i]) {
					if (curr.death_yn == "Yes") {
						count_death += 1;
					}
					if (curr.hosp_yn == "Yes") {
						count_hosp += 1;
					}
				}
			}
			deaths.push(count_death);
			hosp.push(count_hosp);
		}

		function stats(data) {
			var q1 = d3.quantile(data.sort(d3.ascending),.25);
			var median = d3.quantile(data.sort(d3.ascending),.5);
			var q3 = d3.quantile(data.sort(d3.ascending),.75);
			var interQuantileRange = q3 - q1;
			var min = d3.min(data);
			var max = d3.max(data);
			return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
		}

		var final = [{"key": "Death", "val": stats(deaths)}, {"key": "Hospitalize", "val": stats(hosp)}];
		console.log(final);
		
		var width = 500;
        var height = 500;
		var boxwidth = 100;
        var padding = 50;

		var svg = d3.select("#q5_plot").append("svg")
				.attr("height", height)
				.attr("width", width);

		var x = d3.scaleBand()
						.domain(["Death", "Hospitalize"])
						.range([padding, width-padding])
						.paddingInner(1)
    					.paddingOuter(.5);

		var y = d3.scaleLinear()
						.domain([0, 15000])
						.range([height-padding, padding]);
        
        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

		svg.selectAll("vertLines")
			.data(final)
			.enter()
			.append("line")
			.transition()
			.duration(1000)
			.attr("x1", function(d){
				return x(d.key);
			})
			.attr("x2", function(d){
				return x(d.key);
			})
			.attr("y1", function(d){
				return y(d.val.min);
			})
			.attr("y2", function(d){
				return y(d.val.max)
			})
			.attr("stroke", "black")
			.style("width", 40)

		svg.selectAll("boxes")
			.data(final)
			.enter()
			.append("rect")
			.transition()
			.duration(1000)
			.attr("x", function(d){
				return x(d.key)-boxwidth/2;
			})
			.attr("y", function(d){
				return y(d.val.q3);
			})
			.attr("height", function(d){
				return y(d.val.q1)-y(d.val.q3);
			})
			.attr("width", boxwidth)
			.attr("stroke", "black")
			.style("fill", "#fca36e")
		
		svg.selectAll("medianLines")
			.data(final)
			.enter()
			.append("line")
			.transition()
			.duration(1000)
			.attr("x1", function(d){
				return x(d.key)-boxwidth/2;
			})
			.attr("x2", function(d){
				return x(d.key)+boxwidth/2;
			})
			.attr("y1", function(d){
				return y(d.val.median);
			})
			.attr("y2", function(d){
				return y(d.val.median);
			})
			.attr("stroke", "black")
			.style("width", 80)

		svg.append("g").call(x_axis).attr("class", "x_axis")
                .attr("transform", "translate(0," + (height - padding) + ")");
        
        svg.append("g").call(y_axis).attr("class", "y_axis")
				.attr("transform", "translate(" + padding + ",0)");		
	})
}

var question6=function(filePath){
    var rowConverter = function(d){
		return {
            case_month: d.case_month,
			res_state: d.res_state,
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

    const file_data = d3.csv(filePath, rowConverter);
    file_data.then(function(data){
		var groupby = d3.group(data, function(d){
            return d.hosp_yn == "Yes";
        })
        var valid_data = groupby.get(true);

		var month = [];
        var count = [];

        for (let i = 0; i < valid_data.length; i++) {
            if (!month.includes(valid_data[i].case_month) && valid_data[i].case_month > "2020-02") {
                month.push(valid_data[i].case_month);
            }
        }

        month.sort();

        for (let j = 0; j < month.length; j++) {
            var dic = {"Month": month[j], "Male": 0, "Female": 0};
            for (let k = 0; k < valid_data.length; k++) {
                const curr = valid_data[k];
                if (month[j] == curr.case_month) {
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

        var width = 1200;
        var height = 600;
        var padding = 50;

		var tooltip = d3.select("#q6_plot").append("div")
                            .style("opacity", 0)
                            .style("background-color", "white")
                            .style("position", "absolute")
                            .style("border-width", "2px")
                            .style("border-radius", "5px")
                            .style("padding", "5px");

		var svg = d3.select("#q6_plot").append("svg")
				.attr("height", height)
				.attr("width", width);
		
		svg.append("text")
			.attr("x", width/2)
			.attr("y", padding/2)
			.text("Number of Hospitalizations By Gender")
			.style("font-size", "16px")
			.attr("text-anchor", "middle")
			.style("fill", "black");

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

		svg.append("circle").attr("cx",1100).attr("cy",80).attr("r", 6).style("fill", "#827cb9")
        svg.append("circle").attr("cx",1100).attr("cy",100).attr("r", 6).style("fill", "pink")
        svg.append("text").attr("x", 1120).attr("y", 80).text("Male").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "#827cb9")
        svg.append("text").attr("x", 1120).attr("y", 100).text("Female").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "pink")
    })
}