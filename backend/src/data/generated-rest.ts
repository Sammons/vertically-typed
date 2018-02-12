export const db = {
  "__schemas": {
    "public": {
      "__table": {
        "sample_users": {
          "__": {
            "table_schema": "public" as "public",
            "table_name": "sample_users" as "sample_users",
            "nullables": {
              "id": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "sample_users" as "sample_users",
                "column_name": "id" as "id",
                "column_default": "gen_random_uuid()" as "gen_random_uuid()",
                "type": "uuid" as "uuid",
                "nullable": true,
                "ordinal_position": 1,
                "kind": "r" as "r"
              },
              "name": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "sample_users" as "sample_users",
                "column_name": "name" as "name",
                "column_default": null as void,
                "type": "text" as "text",
                "nullable": true,
                "ordinal_position": 2,
                "kind": "r" as "r"
              },
              "email": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "sample_users" as "sample_users",
                "column_name": "email" as "email",
                "column_default": null as void,
                "type": "text" as "text",
                "nullable": true,
                "ordinal_position": 3,
                "kind": "r" as "r"
              }
            }
          },
          "id": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "sample_users" as "sample_users",
            "column_name": "id" as "id",
            "column_default": "gen_random_uuid()" as "gen_random_uuid()",
            "type": "uuid" as "uuid",
            "nullable": true,
            "ordinal_position": 1,
            "kind": "r" as "r"
          },
          "name": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "sample_users" as "sample_users",
            "column_name": "name" as "name",
            "column_default": null as void,
            "type": "text" as "text",
            "nullable": true,
            "ordinal_position": 2,
            "kind": "r" as "r"
          },
          "email": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "sample_users" as "sample_users",
            "column_name": "email" as "email",
            "column_default": null as void,
            "type": "text" as "text",
            "nullable": true,
            "ordinal_position": 3,
            "kind": "r" as "r"
          }
        },
        "knex_migrations_lock": {
          "__": {
            "table_schema": "public" as "public",
            "table_name": "knex_migrations_lock" as "knex_migrations_lock",
            "nullables": {
              "is_locked": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "knex_migrations_lock" as "knex_migrations_lock",
                "column_name": "is_locked" as "is_locked",
                "column_default": null as void,
                "type": "integer" as "integer",
                "nullable": true,
                "ordinal_position": 1,
                "kind": "r" as "r"
              }
            }
          },
          "is_locked": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "knex_migrations_lock" as "knex_migrations_lock",
            "column_name": "is_locked" as "is_locked",
            "column_default": null as void,
            "type": "integer" as "integer",
            "nullable": true,
            "ordinal_position": 1,
            "kind": "r" as "r"
          }
        },
        "knex_migrations": {
          "__": {
            "table_schema": "public" as "public",
            "table_name": "knex_migrations" as "knex_migrations",
            "nullables": {
              "id": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "knex_migrations" as "knex_migrations",
                "column_name": "id" as "id",
                "column_default": "nextval('knex_migrations_id_seq'::regclass)" as "nextval('knex_migrations_id_seq'::regclass)",
                "type": "integer" as "integer",
                "nullable": false,
                "ordinal_position": 1,
                "kind": "r" as "r"
              },
              "name": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "knex_migrations" as "knex_migrations",
                "column_name": "name" as "name",
                "column_default": null as void,
                "type": "character varying(255)" as "character varying(255)",
                "nullable": true,
                "ordinal_position": 2,
                "kind": "r" as "r"
              },
              "batch": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "knex_migrations" as "knex_migrations",
                "column_name": "batch" as "batch",
                "column_default": null as void,
                "type": "integer" as "integer",
                "nullable": true,
                "ordinal_position": 3,
                "kind": "r" as "r"
              },
              "migration_time": {
                "comment": "no comment" as "no comment",
                "table_schema": "public" as "public",
                "table_name": "knex_migrations" as "knex_migrations",
                "column_name": "migration_time" as "migration_time",
                "column_default": null as void,
                "type": "timestamp with time zone" as "timestamp with time zone",
                "nullable": true,
                "ordinal_position": 4,
                "kind": "r" as "r"
              }
            }
          },
          "id": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "knex_migrations" as "knex_migrations",
            "column_name": "id" as "id",
            "column_default": "nextval('knex_migrations_id_seq'::regclass)" as "nextval('knex_migrations_id_seq'::regclass)",
            "type": "integer" as "integer",
            "nullable": false,
            "ordinal_position": 1,
            "kind": "r" as "r"
          },
          "name": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "knex_migrations" as "knex_migrations",
            "column_name": "name" as "name",
            "column_default": null as void,
            "type": "character varying(255)" as "character varying(255)",
            "nullable": true,
            "ordinal_position": 2,
            "kind": "r" as "r"
          },
          "batch": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "knex_migrations" as "knex_migrations",
            "column_name": "batch" as "batch",
            "column_default": null as void,
            "type": "integer" as "integer",
            "nullable": true,
            "ordinal_position": 3,
            "kind": "r" as "r"
          },
          "migration_time": {
            "comment": "no comment" as "no comment",
            "table_schema": "public" as "public",
            "table_name": "knex_migrations" as "knex_migrations",
            "column_name": "migration_time" as "migration_time",
            "column_default": null as void,
            "type": "timestamp with time zone" as "timestamp with time zone",
            "nullable": true,
            "ordinal_position": 4,
            "kind": "r" as "r"
          }
        }
      },
      "sample_users": {
        "__": {
          "table_schema": "public" as "public",
          "table_name": "sample_users" as "sample_users",
          "nullables": {
            "id": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "sample_users" as "sample_users",
              "column_name": "id" as "id",
              "column_default": "gen_random_uuid()" as "gen_random_uuid()",
              "type": "uuid" as "uuid",
              "nullable": true,
              "ordinal_position": 1,
              "kind": "r" as "r"
            },
            "name": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "sample_users" as "sample_users",
              "column_name": "name" as "name",
              "column_default": null as void,
              "type": "text" as "text",
              "nullable": true,
              "ordinal_position": 2,
              "kind": "r" as "r"
            },
            "email": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "sample_users" as "sample_users",
              "column_name": "email" as "email",
              "column_default": null as void,
              "type": "text" as "text",
              "nullable": true,
              "ordinal_position": 3,
              "kind": "r" as "r"
            }
          }
        },
        "id": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "sample_users" as "sample_users",
          "column_name": "id" as "id",
          "column_default": "gen_random_uuid()" as "gen_random_uuid()",
          "type": "uuid" as "uuid",
          "nullable": true,
          "ordinal_position": 1,
          "kind": "r" as "r"
        },
        "name": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "sample_users" as "sample_users",
          "column_name": "name" as "name",
          "column_default": null as void,
          "type": "text" as "text",
          "nullable": true,
          "ordinal_position": 2,
          "kind": "r" as "r"
        },
        "email": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "sample_users" as "sample_users",
          "column_name": "email" as "email",
          "column_default": null as void,
          "type": "text" as "text",
          "nullable": true,
          "ordinal_position": 3,
          "kind": "r" as "r"
        }
      },
      "knex_migrations_lock": {
        "__": {
          "table_schema": "public" as "public",
          "table_name": "knex_migrations_lock" as "knex_migrations_lock",
          "nullables": {
            "is_locked": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "knex_migrations_lock" as "knex_migrations_lock",
              "column_name": "is_locked" as "is_locked",
              "column_default": null as void,
              "type": "integer" as "integer",
              "nullable": true,
              "ordinal_position": 1,
              "kind": "r" as "r"
            }
          }
        },
        "is_locked": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations_lock" as "knex_migrations_lock",
          "column_name": "is_locked" as "is_locked",
          "column_default": null as void,
          "type": "integer" as "integer",
          "nullable": true,
          "ordinal_position": 1,
          "kind": "r" as "r"
        }
      },
      "knex_migrations": {
        "__": {
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "nullables": {
            "id": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "knex_migrations" as "knex_migrations",
              "column_name": "id" as "id",
              "column_default": "nextval('knex_migrations_id_seq'::regclass)" as "nextval('knex_migrations_id_seq'::regclass)",
              "type": "integer" as "integer",
              "nullable": false,
              "ordinal_position": 1,
              "kind": "r" as "r"
            },
            "name": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "knex_migrations" as "knex_migrations",
              "column_name": "name" as "name",
              "column_default": null as void,
              "type": "character varying(255)" as "character varying(255)",
              "nullable": true,
              "ordinal_position": 2,
              "kind": "r" as "r"
            },
            "batch": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "knex_migrations" as "knex_migrations",
              "column_name": "batch" as "batch",
              "column_default": null as void,
              "type": "integer" as "integer",
              "nullable": true,
              "ordinal_position": 3,
              "kind": "r" as "r"
            },
            "migration_time": {
              "comment": "no comment" as "no comment",
              "table_schema": "public" as "public",
              "table_name": "knex_migrations" as "knex_migrations",
              "column_name": "migration_time" as "migration_time",
              "column_default": null as void,
              "type": "timestamp with time zone" as "timestamp with time zone",
              "nullable": true,
              "ordinal_position": 4,
              "kind": "r" as "r"
            }
          }
        },
        "id": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "id" as "id",
          "column_default": "nextval('knex_migrations_id_seq'::regclass)" as "nextval('knex_migrations_id_seq'::regclass)",
          "type": "integer" as "integer",
          "nullable": false,
          "ordinal_position": 1,
          "kind": "r" as "r"
        },
        "name": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "name" as "name",
          "column_default": null as void,
          "type": "character varying(255)" as "character varying(255)",
          "nullable": true,
          "ordinal_position": 2,
          "kind": "r" as "r"
        },
        "batch": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "batch" as "batch",
          "column_default": null as void,
          "type": "integer" as "integer",
          "nullable": true,
          "ordinal_position": 3,
          "kind": "r" as "r"
        },
        "migration_time": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "migration_time" as "migration_time",
          "column_default": null as void,
          "type": "timestamp with time zone" as "timestamp with time zone",
          "nullable": true,
          "ordinal_position": 4,
          "kind": "r" as "r"
        }
      }
    }
  },
  "public_sample_users": {
    "__": {
      "table_schema": "public" as "public",
      "table_name": "sample_users" as "sample_users",
      "nullables": {
        "id": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "sample_users" as "sample_users",
          "column_name": "id" as "id",
          "column_default": "gen_random_uuid()" as "gen_random_uuid()",
          "type": "uuid" as "uuid",
          "nullable": true,
          "ordinal_position": 1,
          "kind": "r" as "r"
        },
        "name": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "sample_users" as "sample_users",
          "column_name": "name" as "name",
          "column_default": null as void,
          "type": "text" as "text",
          "nullable": true,
          "ordinal_position": 2,
          "kind": "r" as "r"
        },
        "email": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "sample_users" as "sample_users",
          "column_name": "email" as "email",
          "column_default": null as void,
          "type": "text" as "text",
          "nullable": true,
          "ordinal_position": 3,
          "kind": "r" as "r"
        }
      }
    },
    "id": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "sample_users" as "sample_users",
      "column_name": "id" as "id",
      "column_default": "gen_random_uuid()" as "gen_random_uuid()",
      "type": "uuid" as "uuid",
      "nullable": true,
      "ordinal_position": 1,
      "kind": "r" as "r"
    },
    "name": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "sample_users" as "sample_users",
      "column_name": "name" as "name",
      "column_default": null as void,
      "type": "text" as "text",
      "nullable": true,
      "ordinal_position": 2,
      "kind": "r" as "r"
    },
    "email": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "sample_users" as "sample_users",
      "column_name": "email" as "email",
      "column_default": null as void,
      "type": "text" as "text",
      "nullable": true,
      "ordinal_position": 3,
      "kind": "r" as "r"
    }
  },
  "public_knex_migrations_lock": {
    "__": {
      "table_schema": "public" as "public",
      "table_name": "knex_migrations_lock" as "knex_migrations_lock",
      "nullables": {
        "is_locked": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations_lock" as "knex_migrations_lock",
          "column_name": "is_locked" as "is_locked",
          "column_default": null as void,
          "type": "integer" as "integer",
          "nullable": true,
          "ordinal_position": 1,
          "kind": "r" as "r"
        }
      }
    },
    "is_locked": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "knex_migrations_lock" as "knex_migrations_lock",
      "column_name": "is_locked" as "is_locked",
      "column_default": null as void,
      "type": "integer" as "integer",
      "nullable": true,
      "ordinal_position": 1,
      "kind": "r" as "r"
    }
  },
  "public_knex_migrations": {
    "__": {
      "table_schema": "public" as "public",
      "table_name": "knex_migrations" as "knex_migrations",
      "nullables": {
        "id": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "id" as "id",
          "column_default": "nextval('knex_migrations_id_seq'::regclass)" as "nextval('knex_migrations_id_seq'::regclass)",
          "type": "integer" as "integer",
          "nullable": false,
          "ordinal_position": 1,
          "kind": "r" as "r"
        },
        "name": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "name" as "name",
          "column_default": null as void,
          "type": "character varying(255)" as "character varying(255)",
          "nullable": true,
          "ordinal_position": 2,
          "kind": "r" as "r"
        },
        "batch": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "batch" as "batch",
          "column_default": null as void,
          "type": "integer" as "integer",
          "nullable": true,
          "ordinal_position": 3,
          "kind": "r" as "r"
        },
        "migration_time": {
          "comment": "no comment" as "no comment",
          "table_schema": "public" as "public",
          "table_name": "knex_migrations" as "knex_migrations",
          "column_name": "migration_time" as "migration_time",
          "column_default": null as void,
          "type": "timestamp with time zone" as "timestamp with time zone",
          "nullable": true,
          "ordinal_position": 4,
          "kind": "r" as "r"
        }
      }
    },
    "id": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "knex_migrations" as "knex_migrations",
      "column_name": "id" as "id",
      "column_default": "nextval('knex_migrations_id_seq'::regclass)" as "nextval('knex_migrations_id_seq'::regclass)",
      "type": "integer" as "integer",
      "nullable": false,
      "ordinal_position": 1,
      "kind": "r" as "r"
    },
    "name": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "knex_migrations" as "knex_migrations",
      "column_name": "name" as "name",
      "column_default": null as void,
      "type": "character varying(255)" as "character varying(255)",
      "nullable": true,
      "ordinal_position": 2,
      "kind": "r" as "r"
    },
    "batch": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "knex_migrations" as "knex_migrations",
      "column_name": "batch" as "batch",
      "column_default": null as void,
      "type": "integer" as "integer",
      "nullable": true,
      "ordinal_position": 3,
      "kind": "r" as "r"
    },
    "migration_time": {
      "comment": "no comment" as "no comment",
      "table_schema": "public" as "public",
      "table_name": "knex_migrations" as "knex_migrations",
      "column_name": "migration_time" as "migration_time",
      "column_default": null as void,
      "type": "timestamp with time zone" as "timestamp with time zone",
      "nullable": true,
      "ordinal_position": 4,
      "kind": "r" as "r"
    }
  },
  "__relations": [] as any[]
}