/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3870285815")

  // update collection data
  unmarshal({
    "createRule": "(@request.auth.id != \"\" && @request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.id != \"\" && @request.auth.role = \"TENANT_ADMIN\" && @request.body.tenant = @request.auth.tenant)",
    "deleteRule": "(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant && @request.body.tenant = @request.auth.tenant)\n",
    "listRule": "(status = \"open\" || status = \"processing\") || \n(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)",
    "updateRule": "(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant && @request.body.tenant = @request.auth.tenant)",
    "viewRule": "(status = \"open\" || status = \"processing\") || \n(@request.auth.role = \"GLOBAL_ADMIN\") || \n(@request.auth.role = \"TENANT_ADMIN\" && tenant = @request.auth.tenant)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3870285815")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
