/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...
    const dao = new Dao(db);

    const collection = new Collection({
      name: "countries",
      type: "base",
      schema: [
        {
          name: "name",
          type: "text",
          required: true,
          unique: true,
        },
        { name: "alpha2", type: "text", required: true, unique: true },
        { name: "alpha3", type: "text", required: true, unique: true },
        { name: "numeric", type: "text", required: true, unique: true },
        { name: "independent", type: "bool" },
        { name: "officialName", type: "text", required: true },
        { name: "altNames", type: "json" },
        { name: "ccTLD", type: "json" },
        { name: "fifa", type: "relation" },
        { name: "ioc", type: "relation" },
        { name: "capital", type: "text" },
        { name: "currencies", type: "relation" },
        { name: "languages", type: "relation" },
        { name: "callingCode", type: "text" },
        { name: "sovereignty", type: "text" },
        { name: "status", type: "text" },
      ],
    });
    dao.saveCollection(collection);
  },
  (db) => {
    // add down queries...
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("countries");
    dao.deleteCollection(collection);
  }
);
