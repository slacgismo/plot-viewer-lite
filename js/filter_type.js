//used for the filter type to be determined once xAxis and yAxis are selected

var filters;
$(document).ready(function(){

    $("#y-axis-search, #x-axis-search").change(function(){
        $("#filter-type").html('<option disabled selected value> -Filter- </option>');
        $.ajax({
            url: jsonUrl,
            type: "GET",
            success: function(plot){
                plots.splice(0,1);
                var yAxis = $("#y-axis-search").val();
                var xAxis = $("#x-axis-search").val();

                var sortOpt = [];
                sortOpt = sortOpt.concat(sortOptions);
                var dist_options = [];

                if (sortOptions.includes(xAxis) && sortOptions.includes(yAxis) && (xAxis !== yAxis)){
                    sortOpt.splice(sortOpt.indexOf(xAxis), 1);
                    sortOpt.splice(sortOpt.indexOf(yAxis), 1);
                    var filtersStr = "";
                    var lookup = {};
                    var result = [];

                    for (var l = 0; l < sortOpt.length; l++){
                        filtersStr += "<label>Filter" + (l + 1) + "</label>";
                        filtersStr += "<select id='filter" + (l + 1) + "'>";
                        filtersStr += "<option disabled selected value> - " + sortOpt[l] + " - </option>";
                        lookup = {};
                        result = [];
                        for (var item, i = 0; item = plots[i++];) {
                            var name = item[sortOpt[l]];
                            if (!(name in lookup)) {
                                lookup[name] = 1;
                                result.sort();
                                result.push(name);
                            }
                        }
                        for (var k = 0; k < result.length; k++){
                            filtersStr += "<option>" + result[k]+ "</option>";
                        }
                        filtersStr += "</select>";
                    }
                    filters = sortOpt;
                    $("#sort-form").html(filtersStr);
                }
            },
            error:function(error){
                console.log('Error ${error}');
            }
        });
    });
});
