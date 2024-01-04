/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collectionIso6392 = new Collection({
      name: "iso_639_2",
      type: "base",
    });
    collectionIso6392.schema.addField({
      name: "name",
      type: "text",
      required: true,
      unique: true,
    });
    collectionIso6392.schema.addField({
      name: "code",
      type: "text",
      required: true,
      unique: true,
    });

    const collectionIso6393 = new Collection({
      name: "iso_639_3",
      type: "base",
    });
    collectionIso6393.schema.addField({
      name: "name",
      type: "text",
      required: true,
      unique: true,
    });
    collectionIso6393.schema.addField({
      name: "code",
      type: "text",
      required: true,
      unique: true,
    });
    collectionIso6393.schema.addField({
      name: "scope",
      type: "text",
    });
    collectionIso6393.schema.addField({
      name: "type",
      type: "text",
    });
    collectionIso6393.schema.addField({
      name: "iso639_2B",
      type: "text",
    });
    collectionIso6393.schema.addField({
      name: "ios639_2T",
      type: "text",
    });
    collectionIso6393.schema.addField({
      name: "ios639_1T",
      type: "text",
    });

    dao.saveCollection(collectionIso6392);
    dao.saveCollection(collectionIso6393);
  },
  (db) => {
    // add down queries...
  }
);
