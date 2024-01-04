/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...

    const dao = new Dao(db);

    const fifa = new Collection({
      name: "fifa_codes",
      type: "base",
      schema: [
        { name: "federationName", type: "text", required: true },
        { name: "code", type: "text", required: true, unique: true },
      ],
    });
    const ioc = new Collection({
      name: "ioc_codes",
      type: "base",
      schema: [{ name: "code", type: "text", required: true, unique: true }],
    });

    dao.saveCollection(fifa)
    dao.saveCollection(ioc)
  },
  (db) => {
    // add down queries...
  }
);
