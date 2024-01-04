/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...

    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("iso_639_3");
    const field = collection.schema.getFieldByName("ios639_1T");
    collection.schema.removeField(field.id);
    collection.schema.addField({
      name: 'iso639_1T',
      type: "text",
    });
    dao.saveCollection(collection);
  },
  (db) => {
    // add down queries...
  }
);
