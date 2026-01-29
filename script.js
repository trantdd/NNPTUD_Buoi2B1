document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch("db.json");

    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu");
    }

    const products = await response.json();

    document.getElementById("loading").style.display = "none";

    displayProducts(products);

    document.getElementById("totalProducts").textContent = products.length;
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById("loading").innerHTML = `
            <p style="color: red; font-size: 1.2em;">❌ Lỗi: ${error.message}</p>
            <p style="color: #666; margin-top: 10px;">Vui lòng chạy file qua HTTP server (không mở trực tiếp file HTML)</p>
        `;
  }
}
function displayProducts(products) {
  const productList = document.getElementById("productList");

  const productsHTML = products
    .map(
      (product) => `
        <div class="product-item">            <img src="${product.images[0]}" alt="${escapeHtml(product.title)}" class="product-image" onerror="this.src='https://placehold.co/120x120?text=No+Image'">            <div class="product-info">
                <div class="product-title">${escapeHtml(product.title)}</div>
                <div class="product-description">${escapeHtml(product.description)}</div>
                <div class="product-meta">
                    <span class="product-category">${product.category.name}</span>
                    <span class="product-id">ID: ${product.id}</span>
                </div>
            </div>
            <div class="product-price">$${product.price}</div>
        </div>
    `,
    )
    .join("");

  productList.innerHTML = productsHTML;
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
