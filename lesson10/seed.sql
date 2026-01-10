-- =========================================================
-- seed.sql  |  SQL Practice Dataset (E-commerce)
-- PostgreSQL
-- Creates tables + inserts sample data
-- =========================================================

-- Clean slate (safe rerun)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- -----------------------
-- 1) Customers
-- -----------------------
CREATE TABLE customers (
                           id            SERIAL PRIMARY KEY,
                           first_name    VARCHAR(50) NOT NULL,
                           last_name     VARCHAR(50) NOT NULL,
                           email         VARCHAR(120) UNIQUE NOT NULL,
                           city          VARCHAR(80) NOT NULL,
                           country       VARCHAR(80) NOT NULL,
                           created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
                           vip_level     INT NULL, -- NULL means not VIP
                           marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO customers (first_name, last_name, email, city, country, created_at, vip_level, marketing_opt_in) VALUES
                                                                                                                 ('Noa','Cohen','noa.cohen@example.com','Tel Aviv','Israel','2025-01-10 10:12:00',2,true),
                                                                                                                 ('Maya','Levi','maya.levi@example.com','Ramat Gan','Israel','2025-02-03 14:05:00',NULL,true),
                                                                                                                 ('Yael','Peretz','yael.peretz@example.com','Jerusalem','Israel','2024-12-20 09:00:00',1,false),
                                                                                                                 ('Dana','Biton','dana.biton@example.com','Haifa','Israel','2025-03-11 18:22:00',NULL,false),
                                                                                                                 ('Lior','Mizrahi','lior.mizrahi@example.com','Kfar Saba','Israel','2025-04-02 11:45:00',3,true),
                                                                                                                 ('Tamar','Friedman','tamar.friedman@example.com','Herzliya','Israel','2025-02-22 08:10:00',NULL,true),
                                                                                                                 ('Shira','Aharoni','shira.aharoni@example.com','Beer Sheva','Israel','2025-05-09 12:30:00',NULL,false),
                                                                                                                 ('Hila','Ben David','hila.bendavid@example.com','Netanya','Israel','2025-06-01 16:10:00',1,true),
                                                                                                                 ('Neta','Amir','neta.amir@example.com','Holon','Israel','2025-06-15 09:55:00',NULL,true),
                                                                                                                 ('Roni','Katz','roni.katz@example.com','Petah Tikva','Israel','2025-07-07 13:20:00',NULL,false),
                                                                                                                 ('Anna','Smirnova','anna.smirnova@example.com','Tel Aviv','Israel','2025-01-28 20:05:00',NULL,true),
                                                                                                                 ('Sofia','Novak','sofia.novak@example.com','Berlin','Germany','2025-02-18 07:40:00',2,false),
                                                                                                                 ('Emma','Johnson','emma.johnson@example.com','London','UK','2025-03-03 15:15:00',NULL,true),
                                                                                                                 ('Olivia','Brown','olivia.brown@example.com','New York','USA','2025-03-28 17:50:00',3,true),
                                                                                                                 ('Mila','Garcia','mila.garcia@example.com','Barcelona','Spain','2025-04-18 10:00:00',NULL,false),
                                                                                                                 ('Chloe','Martin','chloe.martin@example.com','Paris','France','2025-05-21 19:12:00',1,true),
                                                                                                                 ('Aya','Sato','aya.sato@example.com','Tokyo','Japan','2025-06-28 08:30:00',NULL,false),
                                                                                                                 ('Lea','Schmidt','lea.schmidt@example.com','Munich','Germany','2025-07-30 09:10:00',NULL,true),
                                                                                                                 ('Sarah','Wilson','sarah.wilson@example.com','Toronto','Canada','2025-08-08 12:00:00',2,true),
                                                                                                                 ('Nina','Rossi','nina.rossi@example.com','Milan','Italy','2025-08-22 11:05:00',NULL,false);

-- -----------------------
-- 2) Products
-- -----------------------
CREATE TABLE products (
                          id            SERIAL PRIMARY KEY,
                          sku           VARCHAR(30) UNIQUE NOT NULL,
                          name          VARCHAR(120) NOT NULL,
                          category      VARCHAR(40) NOT NULL,
                          price_cents   INT NOT NULL CHECK (price_cents >= 0),
                          in_stock      INT NOT NULL DEFAULT 0 CHECK (in_stock >= 0),
                          is_active     BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO products (sku, name, category, price_cents, in_stock, is_active, created_at) VALUES
                                                                                             ('TSH-001','Classic T-Shirt - Black','apparel',7900,120,true,'2025-01-05 09:00:00'),
                                                                                             ('TSH-002','Classic T-Shirt - White','apparel',7900,85,true,'2025-01-05 09:00:00'),
                                                                                             ('HOD-001','Hoodie - Grey','apparel',14900,42,true,'2025-02-01 10:00:00'),
                                                                                             ('HOD-002','Hoodie - Navy','apparel',14900,0,true,'2025-02-01 10:00:00'),
                                                                                             ('JNS-001','Jeans - Straight Fit','apparel',21900,31,true,'2025-02-10 12:00:00'),
                                                                                             ('SCK-001','Socks - 3 Pack','apparel',2500,200,true,'2025-01-18 08:20:00'),
                                                                                             ('CAP-001','Cap - Minimal Logo','accessories',6900,60,true,'2025-03-02 11:30:00'),
                                                                                             ('BAG-001','Canvas Tote Bag','accessories',5900,75,true,'2025-03-02 11:35:00'),
                                                                                             ('BAG-002','Backpack - Urban','accessories',19900,18,true,'2025-03-15 14:10:00'),
                                                                                             ('MUG-001','Coffee Mug - 350ml','home',3900,140,true,'2025-01-12 07:00:00'),
                                                                                             ('BOT-001','Water Bottle - 1L','home',9900,95,true,'2025-01-20 09:45:00'),
                                                                                             ('NTB-001','Notebook - Dotted','stationery',2400,300,true,'2025-02-05 16:00:00'),
                                                                                             ('PN-001','Pen Set - 5 Colors','stationery',3200,210,true,'2025-02-05 16:05:00'),
                                                                                             ('HOM-001','Scented Candle - Vanilla','home',8900,55,true,'2025-04-01 18:00:00'),
                                                                                             ('HOM-002','Scented Candle - Citrus','home',8900,0,true,'2025-04-01 18:00:00'),
                                                                                             ('TEC-001','Wireless Earbuds','tech',24900,25,true,'2025-05-12 13:00:00'),
                                                                                             ('TEC-002','USB-C Cable - 2m','tech',3900,180,true,'2025-05-12 13:05:00'),
                                                                                             ('TEC-003','Power Bank - 10,000mAh','tech',15900,40,true,'2025-05-12 13:10:00'),
                                                                                             ('KID-001','Kids Sticker Pack','kids',1800,500,true,'2025-06-10 10:10:00'),
                                                                                             ('KID-002','Kids Coloring Book','kids',4500,260,true,'2025-06-10 10:15:00'),
                                                                                             ('FIT-001','Yoga Mat','fitness',12900,22,true,'2025-06-20 09:20:00'),
                                                                                             ('FIT-002','Resistance Bands Set','fitness',7900,65,true,'2025-06-20 09:25:00'),
                                                                                             ('GFT-001','Gift Card - 100','gift',10000,9999,true,'2025-01-01 00:00:00'),
                                                                                             ('GFT-002','Gift Card - 250','gift',25000,9999,true,'2025-01-01 00:00:00'),
                                                                                             ('GFT-003','Gift Card - 500','gift',50000,9999,true,'2025-01-01 00:00:00'),
                                                                                             ('APP-OLD','Legacy T-Shirt - Green','apparel',6900,0,false,'2024-10-10 10:10:00');

-- -----------------------
-- 3) Orders
-- -----------------------
CREATE TABLE orders (
                        id            SERIAL PRIMARY KEY,
                        customer_id   INT NOT NULL REFERENCES customers(id),
                        status        VARCHAR(20) NOT NULL CHECK (status IN ('cart','paid','shipped','delivered','canceled','refunded')),
                        order_date    TIMESTAMP NOT NULL DEFAULT NOW(),
                        shipped_at    TIMESTAMP NULL,
                        notes         TEXT NULL
);

INSERT INTO orders (customer_id, status, order_date, shipped_at, notes) VALUES
                                                                            (1,'paid','2025-08-01 10:00:00',NULL,'first order'),
                                                                            (2,'delivered','2025-08-02 09:10:00','2025-08-03 12:00:00',NULL),
                                                                            (3,'shipped','2025-08-03 17:20:00','2025-08-04 09:00:00','leave at door'),
                                                                            (4,'canceled','2025-08-04 11:05:00',NULL,'payment failed'),
                                                                            (5,'delivered','2025-08-04 20:30:00','2025-08-05 08:15:00',NULL),
                                                                            (6,'paid','2025-08-06 08:45:00',NULL,NULL),
                                                                            (7,'refunded','2025-08-06 19:10:00','2025-08-07 10:00:00','returned'),
                                                                            (8,'delivered','2025-08-07 12:00:00','2025-08-08 09:30:00',NULL),
                                                                            (9,'shipped','2025-08-08 14:20:00','2025-08-09 11:00:00',NULL),
                                                                            (10,'paid','2025-08-09 16:05:00',NULL,'rush'),
                                                                            (11,'delivered','2025-08-10 10:40:00','2025-08-11 08:00:00',NULL),
                                                                            (12,'delivered','2025-08-11 09:30:00','2025-08-12 10:30:00',NULL),
                                                                            (13,'canceled','2025-08-12 18:15:00',NULL,NULL),
                                                                            (14,'shipped','2025-08-13 07:50:00','2025-08-13 16:00:00','gift wrap'),
                                                                            (15,'paid','2025-08-14 13:00:00',NULL,NULL),
                                                                            (16,'delivered','2025-08-15 21:10:00','2025-08-16 10:10:00',NULL),
                                                                            (17,'paid','2025-08-16 10:10:00',NULL,NULL),
                                                                            (18,'delivered','2025-08-17 09:05:00','2025-08-18 12:20:00',NULL),
                                                                            (19,'shipped','2025-08-18 15:40:00','2025-08-19 08:10:00',NULL),
                                                                            (20,'cart','2025-08-19 22:00:00',NULL,'not checked out');

-- -----------------------
-- 4) Order Items (line items)
-- -----------------------
CREATE TABLE order_items (
                             id            SERIAL PRIMARY KEY,
                             order_id      INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                             product_id    INT NOT NULL REFERENCES products(id),
                             quantity      INT NOT NULL CHECK (quantity > 0),
                             unit_price_cents INT NOT NULL CHECK (unit_price_cents >= 0),
                             discount_pct  INT NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 90)
);

-- helper note: unit_price_cents copies product price at purchase time (common real-world pattern)

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents, discount_pct) VALUES
                                                                                             (1, 1, 1, 7900, 0),
                                                                                             (1,10, 1, 3900, 0),
                                                                                             (1,12, 2, 2400, 10),

                                                                                             (2, 3, 1,14900, 0),
                                                                                             (2, 6, 2, 2500, 0),
                                                                                             (2,11, 1, 9900, 5),

                                                                                             (3, 2, 2, 7900, 0),
                                                                                             (3, 7, 1, 6900, 0),

                                                                                             (4,16, 1,24900, 0),

                                                                                             (5, 9, 1,19900, 10),
                                                                                             (5, 8, 1, 5900, 0),

                                                                                             (6,21, 1,12900, 0),
                                                                                             (6,22, 1, 7900, 0),

                                                                                             (7,14, 2, 8900, 15),

                                                                                             (8, 4, 1,14900, 0),
                                                                                             (8, 6, 3, 2500, 0),
                                                                                             (8,13, 1, 3200, 0),

                                                                                             (9, 5, 1,21900, 0),
                                                                                             (9,10, 2, 3900, 0),

                                                                                             (10, 1, 2, 7900, 0),
                                                                                             (10, 7, 1, 6900, 0),
                                                                                             (10,11, 1, 9900, 0),

                                                                                             (11,18, 1,15900, 0),
                                                                                             (11,17, 2, 3900, 0),

                                                                                             (12,20, 1, 4500, 0),
                                                                                             (12,19, 2, 1800, 0),
                                                                                             (12,12, 1, 2400, 0),

                                                                                             (13,24, 1,25000, 0),

                                                                                             (14,23, 1,10000, 0),
                                                                                             (14, 8, 1, 5900, 0),

                                                                                             (15, 2, 1, 7900, 0),
                                                                                             (15, 6, 1, 2500, 0),

                                                                                             (16,16, 1,24900, 0),
                                                                                             (16, 2, 1, 7900, 20),

                                                                                             (17,10, 4, 3900, 0),
                                                                                             (17,12, 2, 2400, 0),

                                                                                             (18,21, 1,12900, 0),
                                                                                             (18, 6, 2, 2500, 0),

                                                                                             (19, 3, 1,14900, 0),
                                                                                             (19, 9, 1,19900, 0),

                                                                                             (20, 1, 1, 7900, 0);

-- -----------------------
-- Useful views for later lessons (optional, can be removed)
-- -----------------------

-- Total per line item:
-- (quantity * unit_price) minus discount
-- Create a view for easy querying in lesson 11
CREATE OR REPLACE VIEW v_order_item_totals AS
SELECT
    oi.id AS order_item_id,
    oi.order_id,
    oi.product_id,
    oi.quantity,
    oi.unit_price_cents,
    oi.discount_pct,
    (oi.quantity * oi.unit_price_cents) AS line_gross_cents,
    ROUND((oi.quantity * oi.unit_price_cents) * (oi.discount_pct / 100.0))::INT AS line_discount_cents,
    (oi.quantity * oi.unit_price_cents) - ROUND((oi.quantity * oi.unit_price_cents) * (oi.discount_pct / 100.0))::INT AS line_net_cents
FROM order_items oi;

-- Sanity checks
-- SELECT COUNT(*) FROM customers;
-- SELECT COUNT(*) FROM products;
-- SELECT COUNT(*) FROM orders;
-- SELECT COUNT(*) FROM order_items;
