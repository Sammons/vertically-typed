export const definition = {
  "get": {
    "_users_$id": {
      "uri": "/users/:id",
      "shape": {
        "params": {
          "id": ""
        },
        "payload": {
          "id": "",
          "name": "",
          "email": ""
        }
      },
      "definition": {
        "params": {
          "id": {
            "type": "string"
          }
        },
        "payload": {
          "type": "object",
          "id": {
            "type": "string",
            "required": true
          },
          "name": {
            "type": "string",
            "required": true
          },
          "email": {
            "type": "string",
            "required": true
          }
        }
      }
    }
  },
  "post": {
    "_users": {
      "uri": "/users",
      "shape": {
        "params": {},
        "payload": {
          "id": "",
          "name": "",
          "email": ""
        },
        "body": {
          "name": "",
          "email": ""
        }
      },
      "definition": {
        "params": {},
        "payload": {
          "type": "object",
          "id": {
            "type": "string",
            "required": true
          },
          "name": {
            "type": "string",
            "required": true
          },
          "email": {
            "type": "string",
            "required": true
          }
        },
        "body": {
          "type": "object",
          "name": {
            "type": "string",
            "required": true
          },
          "email": {
            "type": "string",
            "required": true
          }
        }
      }
    }
  },
  "put": {},
  "patch": {},
  "delete": {
    "_users_$id": {
      "uri": "/users/:id",
      "shape": {
        "params": {
          "id": ""
        },
        "payload": {}
      },
      "definition": {
        "params": {
          "id": {
            "type": "string"
          }
        },
        "payload": {
          "type": "object"
        }
      }
    }
  }
}