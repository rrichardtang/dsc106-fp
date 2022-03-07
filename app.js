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

var question2=function(filePath){
    
}

var question3=function(filePath){
    
}

var question4=function(filePath){
    
}

var question5=function(filePath){
    
}

var question6=function(filePath){
    
}