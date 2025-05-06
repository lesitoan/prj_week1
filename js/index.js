$(".logo").on("click", function () {
  window.location.href = "index.html";
});

$.getJSON("data/data.json", function (data) {
  let foods = [];
  const prevFoods = localStorage.getItem("foods");
  if (prevFoods && prevFoods.length > 0) {
    foods = JSON.parse(prevFoods);
  } else {
    foods = data?.foods;
    localStorage.setItem("foods", JSON.stringify(foods));
  }

  let dataCurrPage = null;

  let paginationTemplate = null;

  $.get("../componets/pagination.html", function (html) {
    paginationTemplate = Handlebars.compile(html);
    renderHomePage(1);
  });

  function renderHomePage(page, data = []) {
    //init load
    if (!data || data.length === 0) {
      data = foods;
    }
    dataCurrPage = getDataPerPage(page, data);
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

  //search
  $(".btn-search").on("click", function (e) {
    e.preventDefault();
    const searchValue = $(".search-input").val();

    if (!searchValue) {
      renderHomePage(1);
      return;
    }

    const filteredData = foods.filter((food) => {
      return matchStrings(searchValue, food.name);
    });
    if (filteredData.length === 0) {
      $(".main").html("<h1>Không tìm thấy món ăn nào</h1>");
      return;
    }
    dataCurrPage = filteredData;
    renderHomePage(1, filteredData);
  });
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

export const loadHtml = (parent, filePath, data) => {
  $.get(filePath, function (html) {
    var tmpl = Handlebars.compile(html);
    var rs = tmpl(data);
    $(parent).html(rs);
  });
};

function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchStrings(input, target) {
  const normalizedInput = normalizeString(input);
  const normalizedTarget = normalizeString(target);
  return normalizedTarget.includes(normalizedInput);
}
