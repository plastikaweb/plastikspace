/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX idx_orders_user_created ON orders (user, created DESC)",
      "CREATE INDEX idx_orders_store_status_created ON orders (tenant, status, created DESC)",
      "CREATE INDEX `idx_orders_store_delivery` ON `tenants` (\n  `tenant`,\n  `deliveryMethod`\n)"
    ]
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1428098945",
    "max": 0,
    "min": 0,
    "name": "orderNumber",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select1580793482",
    "maxSelect": 1,
    "name": "paymentStatus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "unpaid",
      "paid",
      "refunded",
      "failed"
    ]
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1078510574",
    "maxSelect": 1,
    "name": "deliveryMethod",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pickup",
      "delivery"
    ]
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "json2106779901",
    "maxSize": 0,
    "name": "deliverySlot",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json3943065925",
    "maxSize": 0,
    "name": "shippingAddress",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2308571902",
    "max": null,
    "min": 0,
    "name": "shippingCost",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number1178261342",
    "max": null,
    "min": null,
    "name": "subtotalPrice",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number163230955",
    "max": null,
    "min": null,
    "name": "totalPrice",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX idx_orders_user_created ON orders (user, created DESC)",
      "CREATE INDEX idx_orders_store_status_created ON orders (tenant, status, created DESC)",
      "CREATE INDEX idx_orders_store_delivery ON tenants (tenant, delivery_method)"
    ]
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1428098945",
    "max": 0,
    "min": 0,
    "name": "order_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select1580793482",
    "maxSelect": 1,
    "name": "payment_status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "unpaid",
      "paid",
      "refunded",
      "failed"
    ]
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1078510574",
    "maxSelect": 1,
    "name": "delivery_method",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pickup",
      "delivery"
    ]
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "json2106779901",
    "maxSize": 0,
    "name": "delivery_slot",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json3943065925",
    "maxSize": 0,
    "name": "shipping_address",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2308571902",
    "max": null,
    "min": 0,
    "name": "shipping_cost",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number1178261342",
    "max": null,
    "min": null,
    "name": "subtotal_price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number163230955",
    "max": null,
    "min": null,
    "name": "total_price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
