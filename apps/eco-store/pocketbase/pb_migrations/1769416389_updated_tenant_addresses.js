/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // update collection data
  unmarshal({
    "listRule": "tenant.users_via_tenant.id = @request.auth.tenant"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // update collection data
  unmarshal({
    "listRule": null
  }, collection)

  return app.save(collection)
})
