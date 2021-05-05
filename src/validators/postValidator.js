"use-strict";
import * as yup from "yup";
/**
 * post MODEL Validation Rules
 */
const title = yup
  .string()
  .required("Title is required.")
  .min(1, "Title  should have at least 1 characters.")
  .max(20, "Title  should have at most 50 characters.");

const price = yup.string().required("Price is required.");

const description = yup
  .string()
  .required("description is required.")
  .min(1, "description should have at least 1 characters.")
  .max(500, "description should have at most 500 characters.");

export const NewPostRules = yup.object().shape({
  title,
  description,
  price,
});
