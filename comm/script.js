/* File: script.js */
const products = [
  { id: 1, name: "T-shirt", price: 499, image: "tshirt.jpg" },
  { id: 2, name: "Shoes", price: 1299, image: "shoes.jpg" },
  { id: 3, name: "Watch", price: 899, image: "watch.jpg" },
  { id: 4, name: "Backpack", price: 799, image: "backpack.jpg" },
  { id: 5, name: "Sunglasses", price: 599, image: "sunglasses.jpg" },
  { id: 6, name: "Cap", price: 299, image: "cap.jpg" }
];

const cart = [];

function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = products
    .map(
      (p) => `
    <div class="product">
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>`
    )
    .join("");
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  cart.push(product);
  document.getElementById("cart-count").innerText = cart.length;

  // ✅ Save to Firebase Realtime Database
  db.ref("cart/").push(product);
}

function viewCart() {
  const section = document.getElementById("cart");
  const clearBtn = document.getElementById("clear-cart-btn");

  // ✅ Read cart data from Firebase
  db.ref("cart/").once("value", (snapshot) => {
    const data = snapshot.val();
    let html = "";
    let total = 0;

    if (data) {
      for (let key in data) {
        const item = data[key];
        html += `<p>${item.name} - ₹${item.price}</p>`;
        total += item.price;
      }
    } else {
      html = "<p>Your cart is empty.</p>";
    }

    section.innerHTML = `<h2>Your Cart</h2>${html}<p>Total: ₹${total}</p>`;
    section.style.display = "block";
    clearBtn.style.display = "inline-block";
  });
}

function clearCart() {
  db.ref("cart/").remove()
    .then(() => {
      alert("Cart cleared!");
      document.getElementById("cart").style.display = "none";
      document.getElementById("cart-count").innerText = 0;
      document.getElementById("clear-cart-btn").style.display = "none";
      cart.length = 0;
    })
    .catch((error) => {
      console.error("Error clearing cart:", error);
    });
}

renderProducts();
