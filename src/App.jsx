import { useEffect, useMemo, useState } from 'react';

const seedProducts = [
  {
    id: 1,
    name: 'Aurora Smart Speaker',
    category: 'Electronics',
    price: 129.99,
    rating: 4.8,
    reviews: 248,
    description: 'Immersive audio and voice assistant features for your home.',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Veloura Leather Tote',
    category: 'Accessories',
    price: 89.5,
    rating: 4.7,
    reviews: 164,
    description: 'A polished everyday tote designed for work, travel, and weekends.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    badge: 'New'
  },
  {
    id: 3,
    name: 'Terra Ceramic Lamp',
    category: 'Home',
    price: 74.0,
    rating: 4.9,
    reviews: 113,
    description: 'Soft lighting and minimalist form inspired by modern interiors.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    badge: 'Trending'
  },
  {
    id: 4,
    name: 'Nova Running Watch',
    category: 'Fitness',
    price: 199.0,
    rating: 4.8,
    reviews: 311,
    description: 'Track workouts, sleep, and recovery with premium style.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    badge: 'Hot'
  },
  {
    id: 5,
    name: 'Solea Knit Set',
    category: 'Fashion',
    price: 68.0,
    rating: 4.6,
    reviews: 93,
    description: 'Soft texture and casual comfort for everyday layering.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    badge: 'Popular'
  },
  {
    id: 6,
    name: 'Horizon Bluetooth Headphones',
    category: 'Electronics',
    price: 159.99,
    rating: 4.9,
    reviews: 416,
    description: 'Noise cancelling comfort with all-day battery life and crisp sound.',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    badge: 'Top Rated'
  },
  {
    id: 7,
    name: 'Brooklyn Throw Pillow',
    category: 'Home',
    price: 29.0,
    rating: 4.7,
    reviews: 71,
    description: 'Add a cozy accent that instantly upgrades your seating area.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    badge: 'Cozy Pick'
  },
  {
    id: 8,
    name: 'Aster Daily Journal',
    category: 'Stationery',
    price: 21.5,
    rating: 4.8,
    reviews: 142,
    description: 'Thoughtful planning tools for ideas, goals, and routines.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988c2477d?auto=format&fit=crop&w=900&q=80',
    badge: 'Editor’s Pick'
  }
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

function App() {
  const [products, setProducts] = useState(() => readStorage('laziz-products', seedProducts));
  const [cart, setCart] = useState(() => readStorage('laziz-cart', []));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Home',
    price: '',
    description: '',
    image: '',
    badge: 'New'
  });

  useEffect(() => {
    writeStorage('laziz-products', products);
  }, [products]);

  useEffect(() => {
    writeStorage('laziz-cart', cart);
  }, [cart]);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length ? 12 : 0;
  const total = subtotal + shipping;

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleNewProductSubmit = (event) => {
    event.preventDefault();

    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      rating: 4.8,
      reviews: 0,
      description: newProduct.description,
      image:
        newProduct.image ||
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      badge: newProduct.badge || 'New'
    };

    setProducts((current) => [product, ...current]);
    setNewProduct({
      name: '',
      category: 'Home',
      price: '',
      description: '',
      image: '',
      badge: 'New'
    });
    setCategory('All');
    setShowAdmin(false);
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="logo-wrap">
          <div className="logo-mark">L</div>
          <div>
            <p className="logo-text">Laziz</p>
            <span className="logo-sub">Store</span>
          </div>
        </div>

        <nav className="nav">
          <a href="#shop">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#about">About</a>
        </nav>

        <div className="topbar-actions">
          <button className="ghost-btn" onClick={() => setShowAdmin((value) => !value)}>
            {showAdmin ? 'Hide Admin' : 'Admin'}
          </button>
          <button className="primary-btn" onClick={() => setShowCart(true)}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">New season arrivals</p>
            <h1>Modern essentials for everyday living.</h1>
            <p className="subtitle">
              Discover elevated home pieces, daily must-haves, and premium lifestyle finds curated for the way you live.
            </p>
            <div className="cta-row">
              <a href="#shop" className="primary-btn large-btn">
                Shop now
              </a>
              <button className="ghost-btn large-btn" onClick={() => setShowAdmin(true)}>
                Add product
              </button>
            </div>
            <div className="trust-row">
              <div>
                <strong>12k+</strong>
                <span>happy shoppers</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>average rating</span>
              </div>
              <div>
                <strong>48h</strong>
                <span>fast dispatch</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card large-card">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                alt="Featured lifestyle product"
              />
              <div className="floating-box">
                <span>Featured drop</span>
                <strong>Curated Living</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="collections" className="collection-grid">
          {['Electronics', 'Home', 'Fashion', 'Accessories'].map((item) => (
            <article key={item} className="collection-card">
              <span>{item}</span>
              <strong>Fresh picks</strong>
            </article>
          ))}
        </section>

        <section id="shop" className="shop-panel">
          <div className="shop-header">
            <div>
              <p className="eyebrow">Shop the collection</p>
              <h2>Featured products</h2>
            </div>

            <div className="shop-controls">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="filter-row">
            {categories.map((item) => (
              <button
                key={item}
                className={item === category ? 'filter-pill active' : 'filter-pill'}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-badge">{product.badge}</span>
                </div>

                <div className="product-body">
                  <div className="product-meta-row">
                    <span>{product.category}</span>
                    <span>{product.rating} ★</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>

                <div className="product-footer">
                  <div>
                    <strong>{formatCurrency(product.price)}</strong>
                    <small>({product.reviews} reviews)</small>
                  </div>
                  <button className="primary-btn" onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {showAdmin && (
          <section className="admin-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Store management</p>
                <h2>Add a new product</h2>
              </div>
            </div>

            <form className="product-form" onSubmit={handleNewProductSubmit}>
              <div className="field-grid">
                <label>
                  Product name
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(event) =>
                      setNewProduct((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Example: Mediterranean Candle"
                  />
                </label>

                <label>
                  Category
                  <select
                    value={newProduct.category}
                    onChange={(event) =>
                      setNewProduct((current) => ({ ...current, category: event.target.value }))
                    }
                  >
                    <option value="Home">Home</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(event) =>
                      setNewProduct((current) => ({ ...current, price: event.target.value }))
                    }
                    placeholder="49.99"
                  />
                </label>

                <label>
                  Badge
                  <input
                    type="text"
                    value={newProduct.badge}
                    onChange={(event) =>
                      setNewProduct((current) => ({ ...current, badge: event.target.value }))
                    }
                    placeholder="New"
                  />
                </label>
              </div>

              <label>
                Image URL
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(event) =>
                    setNewProduct((current) => ({ ...current, image: event.target.value }))
                  }
                  placeholder="https://example.com/product.jpg"
                />
              </label>

              <label>
                Description
                <textarea
                  rows="4"
                  value={newProduct.description}
                  onChange={(event) =>
                    setNewProduct((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Tell shoppers what makes this product special."
                />
              </label>

              <div className="form-actions">
                <button type="button" className="ghost-btn" onClick={() => setShowAdmin(false)}>
                  Close
                </button>
                <button type="submit" className="primary-btn">
                  Save product
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      <aside className={showCart ? 'cart-drawer open' : 'cart-drawer'}>
        <div className="cart-header">
          <h3>Your cart</h3>
          <button className="icon-btn" onClick={() => setShowCart(false)}>
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button className="primary-btn" onClick={() => setShowCart(false)}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-copy">
                    <strong>{item.name}</strong>
                    <span>{formatCurrency(item.price)}</span>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{formatCurrency(shipping)}</strong>
              </div>
              <div className="total-row">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              <button className="primary-btn checkout-btn">Proceed to checkout</button>
            </div>
          </>
        )}
      </aside>

      <footer id="about" className="footer">
        <div>
          <p className="logo-text">Laziz</p>
          <span className="logo-sub">Store</span>
        </div>
        <p>Designed for modern shopping and everyday essentials.</p>
      </footer>
    </div>
  );
}

export default App;
