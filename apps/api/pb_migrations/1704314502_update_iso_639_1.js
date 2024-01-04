/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...

    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("iso_639_2");
    collection.schema.addField({
      name: "639_2",
      type: "text",
    });
    dao.saveCollection(collection);
  },
  (db) => {
    // add down queries...
  }
);
