/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "qv6paubifkm4s5e",
    "created": "2024-01-03 21:51:24.238Z",
    "updated": "2024-01-03 22:09:11.612Z",
    "name": "fifa_codes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hqvuvpey",
        "name": "federationName",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bza3q3nd",
        "name": "code",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qv6paubifkm4s5e");

  return dao.deleteCollection(collection);
})
