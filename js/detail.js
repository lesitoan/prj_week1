import { loadHtml } from "./index.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
  window.location.href = "index.html";
}

$.getJSON("data/data.json", function (data) {
  let foods = [];
  const prevFoods = localStorage.getItem("foods");
  if (prevFoods && prevFoods.length > 0) {
    foods = JSON.parse(prevFoods);
  } else {
    foods = data?.foods;
    localStorage.setItem("foods", JSON.stringify(foods));
  }
  if (!foods || foods.length === 0) {
    window.location.href = "index.html";
  }

  const food = foods.find((food) => food.id === parseInt(id));
  if (!food) {
    window.location.href = "index.html";
  }

  loadHtml(".right-content", "../componets/foodDetail.html", food);

  // click btn modify
  $(".right-content").on("click", ".btn-modify", function () {
    if ($(".food-form").hasClass("active")) {
      $(".food-form").removeClass("active").hide();
      $(".btn-modify").text("Sửa");
    } else {
      loadHtml(".food-form", "../componets/foodForm.html", food);
      $(".food-form").addClass("active").show();
      $(".btn-modify").text("Ẩn");
    }
  });

  // click btn delete
  $(".right-content").on("click", ".btn-delete", function () {
    if (confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
      const index = foods.findIndex((food) => food.id === parseInt(id));
      if (index === -1) return;
      foods.splice(index, 1);
      localStorage.setItem("foods", JSON.stringify(foods));
      window.location.href = "index.html";
    }
  });
});

Handlebars.registerHelper("join", function (items) {
  return items.join(", ");
});

$(document).ready(function () {
  // Thêm thành phần
  $("#add-ingredient").on("click", function () {
    const inputGroup = $(`
        <div class="d-flex align-items-center my-2 ingredient-item">
          <input type="text" class="form-control me-2" placeholder="Nhập thành phần" />
          <button type="button" class="btn btn-danger btn-sm remove-ingredient">X</button>
        </div>
      `);
    $("#ingredient-container").append(inputGroup);
  });

  // Thêm giá
  $("#add-price").on("click", function () {
    const priceGroup = $(`
        <div class="price-item mb-3 row g-2 align-items-center">
          <div class="col-md-5">
            <input type="text" class="form-control" placeholder="Mô tả" />
          </div>
          <div class="col-md-5">
            <input type="number" class="form-control" placeholder="Giá" />
          </div>
          <div class="col-md-2">
            <button type="button" class="btn btn-danger btn-sm w-100 remove-price">X</button>
          </div>
        </div>
      `);

    $("#price-container").append(priceGroup);
  });

  // Xóa thành phần
  $("#ingredient-container").on("click", ".remove-ingredient", function () {
    $(this).closest(".ingredient-item").remove();
  });

  // Xóa giá
  $("#price-container").on("click", ".remove-price", function () {
    $(this).closest(".price-item").remove();
  });
});
