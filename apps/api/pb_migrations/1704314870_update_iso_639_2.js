/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("iso_639_2");
    const field = collection.schema.getFieldByName("639_2");
    collection.schema.removeField(field.id);

    return dao.saveCollection(collection);
  },
  (db) => {
    // add down queries...
  }
);
