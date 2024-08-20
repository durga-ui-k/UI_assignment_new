const API_URL = 'https://fakestoreapi.com/products';
let products = [];
let displayedProducts = [];
let currentIndex = 0;
const ITEMS_PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');
    const searchBar = document.getElementById('search-bar');
    const sortOptions = document.getElementById('sort-options');
    const categoryFilters = document.querySelectorAll('.sidebar input[type="checkbox"]');

    try {
        const response = await fetch(API_URL);
        products = await response.json();
        displayedProducts = products.slice(0, ITEMS_PER_PAGE);
        currentIndex = ITEMS_PER_PAGE;

        renderProducts(displayedProducts, productList);

        loadMoreButton.addEventListener('click', () => {
            loadMoreProducts(productList);
        });

        searchBar.addEventListener('input', () => {
            filterAndSortProducts(productList);
        });

        sortOptions.addEventListener('change', () => {
            filterAndSortProducts(productList);
        });

        categoryFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                filterAndSortProducts(productList);
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});

function renderProducts(products, container) {
    container.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>$${product.price.toFixed(2)}</p>
        `;
        container.appendChild(productItem);
    });
}

function loadMoreProducts(container) {
    const nextProducts = products.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
    
    if (nextProducts.length === 0) {
        alert('No more products to load.');
        return; // Exit the function if there are no more products
    }
    
    displayedProducts = displayedProducts.concat(nextProducts);
    renderProducts(displayedProducts, container);
    currentIndex += ITEMS_PER_PAGE;
}


function filterAndSortProducts(container) {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const sortOption = document.getElementById('sort-options').value;
    const categoryFilters = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked'))
        .map(filter => filter.value);

    let filteredProducts = products.filter(product => {
        return (
            product.title.toLowerCase().includes(searchQuery) &&
            (categoryFilters.length === 0 || categoryFilters.includes(product.category))
        );
    });

    if (sortOption === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayedProducts = filteredProducts.slice(0, currentIndex);
    renderProducts(displayedProducts, container);
}
