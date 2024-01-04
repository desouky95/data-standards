/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...
    const dao = new Dao(db);

    const callingCodes = new Collection({
      name: "calling_codes",
      type: "base",
      schema: [
        { name: "countryOrService", type: "text", required: true },
        { name: "code", type: "text", required: true, unique: true },
      ],
    });
    dao.saveCollection(callingCodes);
  },
  (db) => {
    // add down queries...
  }
);
