let allProducts = [];
let currentProducts = [];
let currentSortType = null;
let currentSortOrder = null;

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch("db.json");

    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu");
    }

    allProducts = await response.json();
    currentProducts = [...allProducts];

    document.getElementById("loading").style.display = "none";

    displayProducts(currentProducts);

    document.getElementById("totalProducts").textContent = allProducts.length;
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById("loading").innerHTML = `
            <div class="alert alert-danger text-center">
              <h5>❌ Lỗi: ${error.message}</h5>
              <p>Vui lòng chạy file qua HTTP server (không mở trực tiếp file HTML)</p>
            </div>
        `;
  }
}

function displayProducts(products) {
  const productList = document.getElementById("productList");
  const noResults = document.getElementById("noResults");

  if (products.length === 0) {
    productList.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  const productsHTML = products
    .map(
      (product, index) => `
        <tr>
          <td class="text-center align-middle">
            <span class="badge bg-secondary">${product.id}</span>
          </td>
          <td class="text-center align-middle">
            <img 
              src="${product.images[0]}" 
              alt="${escapeHtml(product.title)}" 
              class="img-thumbnail" 
              style="width: 80px; height: 80px; object-fit: cover;"
              onerror="this.src='https://via.placeholder.com/80x80/667eea/ffffff?text=No+Image'"
            >
          </td>
          <td class="align-middle">
            <strong>${escapeHtml(product.title)}</strong>
          </td>
          <td class="align-middle text-muted small">
            ${escapeHtml(product.description.substring(0, 100))}${product.description.length > 100 ? "..." : ""}
          </td>
          <td class="text-center align-middle">
            <span class="badge bg-primary">${escapeHtml(product.category.name)}</span>
          </td>
          <td class="text-center align-middle">
            <span class="fw-bold text-success fs-5">$${product.price}</span>
          </td>
          <td class="text-center align-middle">
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-outline-info" title="Xem chi tiết" onclick="viewProduct(${product.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
    `,
    )
    .join("");

  productList.innerHTML = productsHTML;
}

function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    currentProducts = [...allProducts];
  } else {
    currentProducts = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm),
    );
  }

  // Reapply current sorting if any
  if (currentSortType) {
    applySorting(currentProducts, currentSortType, currentSortOrder);
  }

  displayProducts(currentProducts);
}

function sortByName(order) {
  currentSortType = "name";
  currentSortOrder = order;
  const sorted = [...currentProducts].sort((a, b) => {
    const nameA = a.title.toLowerCase();
    const nameB = b.title.toLowerCase();
    if (order === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
  currentProducts = sorted;
  displayProducts(currentProducts);
}

function sortByPrice(order) {
  currentSortType = "price";
  currentSortOrder = order;
  const sorted = [...currentProducts].sort((a, b) => {
    if (order === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });
  currentProducts = sorted;
  displayProducts(currentProducts);
}

function applySorting(products, sortType, sortOrder) {
  if (sortType === "name") {
    products.sort((a, b) => {
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  } else if (sortType === "price") {
    products.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }
}

function resetSort() {
  currentSortType = null;
  currentSortOrder = null;
  currentProducts = [...allProducts];
  displayProducts(currentProducts);
}

function viewProduct(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (product) {
    alert(
      `Chi tiết sản phẩm:\n\nID: ${product.id}\nTên: ${product.title}\nGiá: $${product.price}\nDanh mục: ${product.category.name}\nMô tả: ${product.description}`,
    );
  }
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
