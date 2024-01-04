/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "4k11h93hhw1yvjo",
    "created": "2024-01-03 20:40:31.799Z",
    "updated": "2024-01-03 20:45:39.821Z",
    "name": "iso_639_2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kioev5ju",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "lvnhnr8v",
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
      },
      {
        "system": false,
        "id": "cv9rvunb",
        "name": "639_2",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
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
  const collection = dao.findCollectionByNameOrId("4k11h93hhw1yvjo");

  return dao.deleteCollection(collection);
})
