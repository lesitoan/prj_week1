$.getJSON("data/data.json", function (data) {
  let foods = data?.foods || [];
  data = foods;
  let dataCurrPage = null;

  let paginationTemplate = null;

  $.get("../componets/pagination.html", function (html) {
    paginationTemplate = Handlebars.compile(html);
    renderHomePage(1);
  });

  function renderHomePage(page) {
    dataCurrPage = getDataPerPage(page, foods);
    loadHtml(".main-content", "../componets/cardList.html", dataCurrPage.data);
    renderPagination();
  }

  function renderPagination() {
    if (!paginationTemplate) return;
    const rs = paginationTemplate({
      page: dataCurrPage.page,
      totalPage: dataCurrPage.totalPage,
    });
    $(".pagination-content").html(rs);

    $(".prev-page")
      .off("click")
      .on("click", () => {
        if (dataCurrPage.page > 1) {
          renderHomePage(dataCurrPage.page - 1);
        }
      });

    $(".next-page")
      .off("click")
      .on("click", () => {
        if (dataCurrPage.page < dataCurrPage.totalPage) {
          renderHomePage(dataCurrPage.page + 1);
        }
      });
  }
});

Handlebars.registerHelper("minTypePrice", function (types) {
  if (!Array.isArray(types) || types.length === 0) return "";
  return Math.min(...types.map((t) => t.value));
});

const getDataPerPage = (page, data) => {
  const pageSize = 8;
  if (!data || data.length === 0) return {};
  if (page < 1) return {};

  const totalPage = Math.ceil(data.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = Math.min(page * pageSize, data.length);

  return {
    page: page,
    totalPage: totalPage,
    data: data.slice(start, end),
  };
};

const loadHtml = (parent, filePath, data) => {
  $.get(filePath, function (html) {
    var tmpl = Handlebars.compile(html);
    var rs = tmpl(data);
    $(parent).html(rs);
  });
};
