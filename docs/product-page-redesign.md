# Product page redesign

The product route uses a large responsive gallery, keyboard-accessible thumbnail buttons, native modal dialogs for image enlargement and size charts, a desktop sticky gallery, stock-aware size radios, quantity controls, and a coral Add to bag action. CartContext's existing addToCart(product, size, quantity) contract and ViewContent analytics remain in use.

The product description remains the existing catalog's rich HTML. Delivery and exchange copy is drawn from CartContext shipping calculations and the existing ReturnsPolicyScreen. No new delivery promises or refund terms were added.

Related products come from the current collection and exclude the viewed product. The product-detail endpoint returns collectionRef as an ID, while the collection product list populates its name; the screen handles both forms and enriches its breadcrumb after recommendations load. Failed recommendations do not hide a valid product.

Validation: stock-selection tests cover missing/invalid stock, sold-out sizes, missing size, invalid quantities and quantities above stock; production build checked; live API checked for an in-stock product with a gallery and size chart, a sold-out product and same-collection recommendations. Browser interaction verification was unavailable.
