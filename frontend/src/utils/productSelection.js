export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL'];

export const sizeStock = (product, size) => {
  const stock = Number(product?.countInStock?.[size]);
  return Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;
};

export const totalStock = product => PRODUCT_SIZES.reduce((sum, size) => sum + sizeStock(product, size), 0);

export const canAddSelection = (product, size, quantity) => (
  PRODUCT_SIZES.includes(size) && Number.isInteger(quantity) && quantity > 0 && quantity <= sizeStock(product, size)
);
