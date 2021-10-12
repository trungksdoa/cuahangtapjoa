class Address {
    constructor(id, CusId, Fullname, PhoneNum, Stage,
        Address, used) {
        this.id = id;
        this.CusId = CusId;
        this.Fullname = Fullname;
        this.PhoneNum = PhoneNum;
        this.Stage = Stage;
        this.Address = Address;
        this.used = used;
    }
}
module.exports = Address;