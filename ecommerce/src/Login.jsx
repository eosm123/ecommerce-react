import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useLocation } from "wouter";
import { useFlashMessage } from "./FlashMessageStore";
import { useJwt } from "./UserStore";

export default function UserLogin() {
  const [location, setLocation] = useLocation();
  const {setJwt} = useJwt();

  const {showMessage} = useFlashMessage();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const handleSubmit = async (values, formikHelpers) => {
    // handleSubmit will receive values and formikHelpers
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/users/login",
        values
      );
      // Should see the JWT when console.log(response.data)
      //   console.log(response.data);
      setLocation("/");
      showMessage("You have logged in successfully!", "success");
      // Storing the JWT
      const token = response.data.token;
      setJwt(token);
    } catch (e) {
      showMessage("Error logging in");
      console.error(e);
    } finally {
      // form has finished submitting
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <div className="container mt-3 mb-3">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {function (formik) {
          return (
            <Form>
              <div className="mt-2 mb-3">
                <label>Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                />
                {/* Use error message from formik instead of the other type of expression in RegisterPage.jsx ->
                        helps to autodetect whether theres error message associated with form field and if it was touched before */}
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
                {/* name in ErrorMessage needs to match the Field name, use div to show error message and text-danger 
                        className to attach to the div */}
              </div>
              <div className="mt-2 mb-3">
                <label>Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-2"
                disabled={formik.isSubmitting}
              >
                Log In
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
