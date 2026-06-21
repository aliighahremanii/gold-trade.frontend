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

export function patchOpenApiDocument(document) {
  const serialized = JSON.stringify(document);

  if (!serialized.includes("ProblemResponse") && !serialized.includes("ProblemFieldError")) {
    return document;
  }

  const schemas = {
    ...(document.components?.schemas ?? {}),
  };

  if (!schemas.ProblemFieldError) {
    schemas.ProblemFieldError = SHARED_PROBLEM_FIELD_ERROR;
  }

  if (!schemas.ProblemResponse) {
    schemas.ProblemResponse = SHARED_PROBLEM_RESPONSE;
  }

  return {
    ...document,
    components: {
      ...document.components,
      schemas,
    },
  };
}
