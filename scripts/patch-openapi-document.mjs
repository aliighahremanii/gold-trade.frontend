const SHARED_PROBLEM_FIELD_ERROR = {
  type: "object",
  required: ["code", "message"],
  properties: {
    code: { type: "string" },
    message: { type: "string" },
  },
};

const SHARED_PROBLEM_RESPONSE = {
  type: "object",
  required: ["code", "message"],
  properties: {
    code: { type: "string" },
    message: { type: "string" },
    errors: {
      type: "array",
      items: {
        $ref: "#/components/schemas/ProblemFieldError",
      },
    },
  },
};

const PROBLEM_SCHEMA_FIXTURES = {
  ProblemFieldError: SHARED_PROBLEM_FIELD_ERROR,
  ProblemResponse: SHARED_PROBLEM_RESPONSE,
};

const PROBLEM_SCHEMA_NAMES = ["ProblemFieldError", "ProblemResponse"];

function sortSchemaNames(schemaNames) {
  return [...schemaNames].sort((left, right) => left.localeCompare(right));
}

export function patchOpenApiDocument({ moduleName, document, allowedMissingSchemas = [] }) {
  const serialized = JSON.stringify(document);
  const referencedSchemas = PROBLEM_SCHEMA_NAMES.filter((schemaName) =>
    serialized.includes(schemaName),
  );

  if (referencedSchemas.length === 0) {
    return { document };
  }

  const schemas = {
    ...(document.components?.schemas ?? {}),
  };
  const missingSchemas = referencedSchemas.filter((schemaName) => !schemas[schemaName]);

  if (missingSchemas.includes("ProblemResponse") && !schemas.ProblemFieldError) {
    missingSchemas.push("ProblemFieldError");
  }

  if (missingSchemas.length === 0) {
    return { document };
  }

  const sortedMissingSchemas = sortSchemaNames(missingSchemas);
  const sortedAllowedMissingSchemas = sortSchemaNames(allowedMissingSchemas);

  if (
    sortedMissingSchemas.length !== sortedAllowedMissingSchemas.length ||
    sortedMissingSchemas.some((schemaName, index) => schemaName !== sortedAllowedMissingSchemas[index])
  ) {
    throw new Error(
      [
        `OpenAPI contract ${moduleName} is missing ${sortedMissingSchemas.join(", ")}.`,
        "Update contracts/openapi/problem-schema-compatibility.json only for known backend export gaps.",
      ].join(" "),
    );
  }

  for (const schemaName of sortedMissingSchemas) {
    schemas[schemaName] = PROBLEM_SCHEMA_FIXTURES[schemaName];
  }

  return {
    document: {
      ...document,
      components: {
        ...document.components,
        schemas,
      },
    },
    compatibilityPatch: {
      module: moduleName,
      missingSchemas: sortedMissingSchemas,
    },
  };
}
