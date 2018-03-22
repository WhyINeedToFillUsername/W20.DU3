exports.storage = {

    requestId: 0,

    requests: [],

    createDeleteRequest: function (customerId) {
        this.requests.push({id: this.requestId, customerId: customerId, deleted: false});
        return this.requestId++;
    },

    // getRequestIndex: function (customerId) {
    //     for (let i = 0; i < this.requests.length; i++)
    //         if (this.requests[i].customerId === customerId) return i;
    //     return null;
    // },

    closeRequestByCustomerId: function (customerId) {
        for (let i = 0; i < this.requests.length; i++)
            if (this.requests[i].customerId === customerId)
                this.requests[i].deleted = true;
        return null;
    },

    customers: [
        {id: 1, name: "Harry Potter"},
        {id: 2, name: "J. K. Rowling"},
        {id: 3, name: "Petr Olšák"},
        {id: 4, name: "Borec Vráťa"},
        {id: 5, name: "Tonda Karola"}
    ],

    getCustomerIndex: function (id) {
        for (let i = 0; i < this.customers.length; i++)
            if (this.customers[i].id === id) return i;
        return null;
    },

    deleteCustomerByIndex: function (i) {
        this.customers.splice(i, 1);
    },

    deleteCustomerById: function (id) {
        let i = this.getCustomerIndex(id);
        if (i !== null) {
            this.deleteCustomerByIndex(i);
            return true;
        }
        return false;
    }
};