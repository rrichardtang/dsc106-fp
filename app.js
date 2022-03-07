function finalproject(){
    var filePath="2021data.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
    question6(filePath);
}

var question1=function(filePath){
    
}

var question2=function(filePath){
    
}

var question3=function(filePath){
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
        console.log(data);
    })
}

var question4=function(filePath){
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

        var width = 500;
        var height = 600;
        var padding = 50;

		var svg = d3.select("#q4_plot").append("svg")
				.attr("height", height)
				.attr("width", width)

		var x = d3.scaleBand()
						.domain(count.map(function(d){
                            return d.Gender;
                        }))
						.range([padding, width-padding])
						.paddingInner(0.1);

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
					});

        groups.selectAll("text")
						.data(function(d){
							return d;
						}).enter().append("text")
						.attr("x", function(d, i){
							return x(d.data.Gender);
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
    })
}

var question5=function(filePath){
    
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
        var padding = 50;

		var svg = d3.select("#q6_plot").append("svg")
				.attr("height", height)
				.attr("width", width)

		var x = d3.scaleBand()
						.domain(count.map(function(d){
                            return d.Month;
                        }))
						.range([padding, width-padding])
						.paddingInner(0.1);

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
						console.log(d);
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
    })
}
