/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...

    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("iso_639_3");

    const col = collection.schema.getFieldByName("ios639_2T");
    collection.schema.removeField(col.id);
    collection.schema.addField({
      name: "iso639_2T",
      type: "text",
    });
    dao.saveCollection(collection);
  },
  (db) => {
    // add down queries...
  }
);
