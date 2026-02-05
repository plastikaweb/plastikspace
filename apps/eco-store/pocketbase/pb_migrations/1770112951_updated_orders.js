/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "listRule": "(user = @request.auth.id) || \n(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)",
    "viewRule": "(user = @request.auth.id) || \n(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "listRule": "(user = @request.auth.id) || (@request.auth.id != \"\" && @request.auth.role = \"admin\")",
    "viewRule": "(user = @request.auth.id) || (@request.auth.id != \"\" && @request.auth.role = \"admin\")"
  }, collection)

  return app.save(collection)
})
