"use strict";

const EXAMPLE_RESPONSE = `
{
      "maxSelectedItems": 4,
      "items": [
          {
              "id": 1,
              "name": "item-1",
              "validationsRules": [
                  {
                      "type": "REQUIRED"
                  },
                  {
                      "type": "EXCLUDES",
                      "items": [4]
                  }
              ]
          },
          {
                "id": 2,
                "name": "item-2",
                "validationsRules": [
                    {
                        "type": "REQUIRES",
                        "items": [1]
                    },
                    {
                        "type": "EXCLUDES",
                        "items": [3]
                    }
                ]
            },
            {
                "id": 3,
                "name": "item-3",
                "validationsRules": [
                    {
                        "type": "REQUIRES",
                        "items": [1]
                    },
                    {
                        "type": "EXCLUDES",
                        "items": [2]
                    }
                ]
            },
            {
                "id": 4,
                "name": "item-4",
                "validationsRules": [

                ]
            },
            {
                "id": 5,
                "name": "item-5",
                "validationsRules": [
                    {
                        "type": "REQUIRES",
                        "items": [3]
                    }
                ]
            },
            {
                "id": 6,
                "name": "item-6",
                "validationsRules": [
                    {
                        "type": "REQUIRES",
                        "items": [5]
                    }
                ]
            },
            {
                "id": 7,
                "name": "item-7",
                "validationsRules": [
                    {
                        "type": "REQUIRES",
                        "items": [6]
                    }
                ]
            }

      ]
 }
 `;