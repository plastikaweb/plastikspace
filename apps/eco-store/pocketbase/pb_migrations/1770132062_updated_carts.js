/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "createRule": "user = @request.auth.id && tenant = @request.auth.tenant",
    "deleteRule": "user = @request.auth.id && tenant = @request.auth.tenant",
    "listRule": "(user = @request.auth.id && tenant = @request.auth.tenant) || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)",
    "updateRule": "(user = @request.auth.id && tenant = @request.auth.tenant) || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)",
    "viewRule": "(user = @request.auth.id && tenant = @request.auth.tenant) || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": "(user = @request.auth.id) || \n(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)",
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
