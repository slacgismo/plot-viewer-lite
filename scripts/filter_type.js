//used for the filter type to be determined once x_axis and y_axis are selected

$(document).ready(function() {

  $("#y_axis_search, #x_axis_search").change(function () {
    $("#filter_type").empty().append('<option disabled selected value> -Filter- </option>')

    var y_axis = $("#y_axis_search");
    var x_axis = $("#x_axis_search");
    var locContent = "<option disabled selection value> - Location - </option><option> Atlanta_GA </option><option> Baltimore_MD </option><option> Boston_MA </option><option> Calgary_AB </option><option> Chicago_IL </option><option> Dallas_TX </option><option> Houston_TX </option><option> Miami_FL </option><option> Minneapolis_MN </option><option> Nashville_TN </option><option> NewYorkCity_NY </option><option> QuebecCity_QC </option><option> SanAntonio_TX </option><option> Toronto_ON </option>"
    var seasContent = "<option disabled selection value> - Season - </option><option>Winter</option><option>Spring</option><option>Summer</option>";
    var mtContent = "<option disabled selection value> - Mix Type - </option><option>URBAN</option><option>MIXED</option><option>SUBURBAN</option><option>RURAL</option>";


    $("#filter_type").empty().append('<option disabled selected value> -Filter- </option>')

    if (x_axis.val() == "location") {
      if (y_axis.val() == "season"){
        $("#filter_type").html(mtContent);
        }
      if (y_axis.val() == "mix_type"){
        $("#filter_type").html(seasContent)
      }
    }
    else if (x_axis.val() == "season") {
      if (y_axis.val() == "location"){
        $("#filter_type").html(mtContent);      }
      if (y_axis.val() == "mix_type"){
        $("#filter_type").html(locContent);
      }
    }
    else if (x_axis.val() == "mix_type") {
      if (y_axis.val() == "location"){
        $("#filter_type").html(seasContent)
      }
      if (y_axis.val() == "season"){
        $("#filter_type").html(locContent)
      }
    }
  });
});
