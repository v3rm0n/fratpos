(function (Mongo, print) {
    "use strict";
    var conn = new Mongo(),
        db = conn.getDB("postest"),
        addProduct = function (product) {
            print("Inserting product " + product.name);
            db.products.insert(product);
        },
        addUser = function (user) {
            print("Inserting user " + user.firstname + " " + user.lastname);
            db.users.insert(user);
        },
        addStatus = function (status) {
            print("Inserting status " + status);
            db.statuses.insert({ "name": status});
        },
        addPaytype = function (paytype) {
            print("Inserting paytype " + paytype.name);
            db.paytypes.insert(paytype);
        },
        addFeedback = function (feedback) {
            print("Inserting feedback " + feedback);
            db.feedbacks.insert({time: new Date(), content: feedback});
        };

    //Clear all
    print("Dropping database postest");
    db.dropDatabase();
    print("Database dropped");

    print("Adding users");
    addUser({"balance" : 0, "beername" : "Sass", "firstname" : "Eesnimi", "lastname" : "Perenimi", "status" : "vil!" });
    addUser({"balance" : -10, "beername" : "Test", "firstname" : "Kasutaja", "lastname" : "Perenimi", "status" : "ksv!" });
    addUser({"balance" : 0, "beername" : "Test", "firstname" : "Rebane", "lastname" : "Rebane", "status" : "reb!" });
    print("Users added");

    print("Adding statuses");
    addStatus("reb!");
    addStatus("ksv!");
    addStatus("vil!");
    print("Statuses added");

    print("Adding paytypes");
    addPaytype({ "name" : "Rebaseõlu", "affectsQuantity" : true, "allowedForStatus" : [ "reb!" ], "__v" : 0 });
    addPaytype({ "name" : "Sulas", "affectsQuantity" : true, "allowedForStatus" : [ "reb!", "ksv!", "vil!", "kül!" ], "__v" : 0 });
    addPaytype({ "name" : "Ettemaks/Võlg", "affectsBalance" : true, "affectsQuantity" : true, "allowedForStatus" : [ "ksv!", "vil!" ], "__v" : 0 });
    print("Paytypes added");

    print("Adding products");
    addProduct({"name" : "König Ludwig Weissbier", "price" : 1.5, "quantity" : 5 });
    addProduct({"name" : "König Ludwig Dunkel", "price" : 1.5, "quantity" : 35 });
    addProduct({"name" : "A Le Coq Premium", "price" : 1, "quantity" : 84 });
    addProduct({"name" : "Limonaad/Kelluke", "price" : 0.5, "quantity" : 27 });
    addProduct({"name" : "Tõmmu Hiid", "price" : 1, "quantity" : 31 });
    addProduct({"name" : "A.Le.Coq Pilsner", "price" : 1, "quantity" : 55 });
    addProduct({"name" : "A.Le.Coq Special", "price" : 1, "quantity" : 28 });
    print("Products added");

    print("Adding feedback");
    addFeedback("first");
    addFeedback("second and longer");
    print("Feedback added");

    print("Database setup finished!");
}(this.Mongo, this.print));