/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    // add up queries...

    const dbo = new Dao(db);

    const collection = new Collection({
      name: "iso_3166_1",
      type: "base",
      schema: [
        {
          type: "text",
          name: "code",
          required: true,
        },
        {
          type: "text",
          name: "status",
        },
      ],
    });
    dbo.saveCollection(collection);
  },
  (db) => {
    // add down queries...
  }
);
