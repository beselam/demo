"use-strict";
import * as yup from "yup";

/**
 * USER MODEL Validation Rules
 */

const name = yup
  .string()
  .required("Username is required.")
  .min(4, "Username should have at least 5 characters.")
  .max(20, "Username should have at most 10 characters.")
  .matches(/^\w+$/, "Should be alphanumeric.");

const email = yup
  .string()
  .required("Email is required.")
  .email("This is invalid email.");

const password = yup
  .string()
  .required("Password is required.")
  .min(5, "Password should have at least 4 characters.")
  .max(10, "Password should have at most 10 characters.");

// User Registration Validation Schema
export const UserRegistrationRules = yup.object().shape({
  name,
  password,
  email,
});

// User Authentication Validation Schema
export const UserAuthenticationRules = yup.object().shape({
  email,
  password,
});
