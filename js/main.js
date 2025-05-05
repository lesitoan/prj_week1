
Handlebars.registerHelper("minTypePrice", function(types) {
    if (!Array.isArray(types) || types.length === 0) return "";
    return Math.min(...types.map(t => t.value));
  });


$.getJSON( "data/data.json", function( data ) {

    $.get("../componets/card.html", function (html) {
        var tmpl = Handlebars.compile(html);

        var rs = tmpl(data);
        $(".content").html(rs);
      });



  });