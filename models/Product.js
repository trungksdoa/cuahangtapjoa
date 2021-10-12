class Product {
    constructor(id, name, quantity, price_in, price_out,
        Payment, status) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price_in = price_in;
        this.price_out = price_out;
        this.Payment = Payment;
        this.status = status;
    }
}
module.exports = Product;