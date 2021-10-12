class Order {
    constructor(id, CusId, ShipPhone, ShipAddress, ShipDate, ShipNote, OrderDate, OrderState, PaymentMethod, ProcessStatus) {
        this.id = id;
        this.CusId = CusId;
        this.ShipPhone = ShipPhone;
        this.ShipAddress = ShipAddress;
        this.ShipDate = ShipDate;
        this.ShipNote = ShipNote;
        this.OrderDate = OrderDate;
        this.OrderState = OrderState;
        this.PaymentMethod = PaymentMethod;
        this.ProcessStatus = ProcessStatus;
    }
}
module.exports = Order;