const dotenv = require('dotenv').config();
const { Client } = require('@notionhq/client');

// init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const database_id = process.env.NOTION_DATABASE_ID;
const today = new Date().toISOString().slice(0, 10);

module.exports = async function getPomo() {

  const { results } = await notion.databases.query({
    database_id: `${database_id}`,
    filter: {
      "and": [
        {
          "property": "截止日期",
          "date": {
            "is_not_empty": true,
            "before": today
          }
        },
        {
          "property": "完成",
          "checkbox": {
            "equals": true
          }
        },
      ]
    },
    sorts: [{
      "property": "截止日期",
      "direction": "ascending"
    }]
  });

  const rawPomos = results.map(page => {
    return {
      "date": page.properties['截止日期'].date.start,
      "completed": page.properties['完成'].checkbox
    };
  });

  return rawPomos;
};
