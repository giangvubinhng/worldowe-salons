const db = require("../Models/database");

/**
 * Get All salon
 */
exports.getAllShops = () => {
  const getAllQuery = "SELECT * FROM location";
  return new Promise((resolve, reject) => {
    db.query(getAllQuery, (err, shops) => {
      if (err) reject(err);
      resolve(shops);
    });
  });
};

/**
 * Create a new salon
 */
exports.createNewShop = (user_id, shop) => {
  return new Promise((resolve, reject) => {
    // Declare variables here
    const phone = shop.phone;
    const shop_name = shop.shop_name;
    const shop_street = shop.street;
    const shop_city = shop.city;
    const shop_state = shop.state;
    const shop_country = shop.country;
    const shop_zip = shop.zip;
    //add location
    db.query(
      "INSERT IGNORE INTO location (user_id, shop_name, street, city, state, country, zip, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        shop_name,
        shop_street,
        shop_city,
        shop_state,
        shop_country,
        shop_zip,
        phone,
      ],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log("added to location successfully");
        }
      }
    );
    resolve(shop);
  });
};

/*
 * Add technicians for shop
 */
exports.addTechnicians = (techs) => {
  return new Promise((resolve, reject) => {
    // hard code
    const store_id = 1;
    techs.forEach((tech) => {
      db.query(
        "INSERT INTO technicians (store_id, technician_name) VALUES (?, ?)",
        [store_id, tech],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("added to technician successfully");
          }
        }
      );
    });
    resolve(techs);
  });
};
/*
 * Add services for shop
 */
exports.addServices = (services) => {
  return new Promise((resolve, reject) => {
    // hard code
    const shop_id = 1;
    services.forEach((service) => {
      db.query(
        "INSERT IGNORE INTO services (shop_id, service_name) VALUES (?, ?)",
        [shop_id, service],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("added to service successfully");
          }
        }
      );
    });
    resolve(services);
  });
};
