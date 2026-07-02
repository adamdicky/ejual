export function getAvailableInventoryQuantity(stockQuantity: number, reservedQuantity: number) {
  return Math.max(stockQuantity - reservedQuantity, 0)
}

export function calculateCartSubtotal(items: Array<{ quantity: number; unitPrice: number }>) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
}

export function calculateCartTotals(items: Array<{ quantity: number; unitPrice: number }>) {
  const subtotal = calculateCartSubtotal(items)
  const shippingFee = subtotal > 0 ? 10 : 0

  return {
    shippingFee,
    subtotal,
    total: subtotal + shippingFee,
  }
}
