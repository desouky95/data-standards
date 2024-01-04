/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...
    const dao = new Dao(db);
    const collection = new Collection({
      name: "currencies",
      type: "base",
      schema: [
        { name: "name", type: "text", required: true },
        { name: "alpha3", type: "text", required: true },
        { name: "numeric", type: "text", required: true },
        { name: "units", type: "number" },
      ],
    });

    dao.saveCollection(collection);
  },
  (db) => {
    // add down queries...
  }
);
