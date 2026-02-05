/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "listRule": "(user = @request.auth.id) || \n(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "listRule": null
  }, collection)

  return app.save(collection)
})
