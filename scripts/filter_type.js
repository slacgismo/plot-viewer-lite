//used for the filter type to be determined once x_axis and y_axis are selected

var filters;
$(document).ready(function() {
    var plots = [];

    $("#y-axis-search, #x-axis-search").change(function() {
        $("#filter-type").empty().append('<option disabled selected value> -Filter- </option>');
        $.getJSON(json_url, function(plots) {

            var y_axis = $("#y-axis-search").val();
            var x_axis = $("#x-axis-search").val();

            var sort_opt = [];
            sort_opt = sort_opt.concat(sort_options);
            var dist_options = [];

            if (sort_options.includes(x_axis) && sort_options.includes(y_axis) && (x_axis != y_axis)){
                sort_opt.splice(sort_opt.indexOf(x_axis), 1);
                sort_opt.splice(sort_opt.indexOf(y_axis), 1);
                var filters_str = "";
                var lookup = {};
                var result = [];

                for (var l = 0; l < sort_opt.length; l++){
                    filters_str += "<label>Filter" + (l+1) + "</label>";
                    filters_str += "<select id='filter" + (l+1) + "'>";
                    filters_str += "<option disabled selected value> - " + sort_opt[l] + " - </option>";
                    lookup = {};
                    result = [];
                    for (var item, i = 0; item = plots[i++];) {
                        var name = item[sort_opt[l]];
                        if (!(name in lookup)) {
                            lookup[name] = 1;
                            result.sort();
                            result.push(name);
                        }
                    }
                    for (var k = 0; k < result.length; k++){
                        filters_str += "<option>" + result[k]+ "</option>";
                    }
                    filters_str += "</select>";
                }
                filters = sort_opt;
                $("#sort-form").empty().append(filters_str);
            }
        });
    });
});
