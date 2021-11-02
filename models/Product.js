class Product {
    constructor(id, name, quantity, price_in, price_out, Catagory, Payment, status, discount, date_add) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price_in = price_in;
        this.price_out = price_out;
        this.Catagory = Catagory;
        this.Payment = Payment;
        this.status = status;
        this.discount = discount;
        this.date_add = date_add;
    }
}
module.exports = Product;