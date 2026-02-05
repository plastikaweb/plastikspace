/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "(user = @request.auth.id) || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)",
    "updateRule": "@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
})
