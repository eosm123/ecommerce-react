import { useJwt } from "./UserStore";
// need to import axios whenever using restful api
import axios from "axios";
// need to get initial profile for user -> user expect to see their profile
// upon clicking onto the profile link -> need useEffect;
// need somewhere to store the profile and tell the components that visuals have changed -> need useState
import { useEffect, useState } from "react";
import { useFlashMessage } from "./FlashMessageStore";
import { useLocation } from "wouter";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Profile() {
  // getting a hook for jwt
  const { getJwt, setJwt } = useJwt();
  // useState empty object -> user profile represented as a json
  // when initialValues change -> re-render
  const [initialValues, setInitialValues] = useState({});
  const { showMessage } = useFlashMessage();
  const [, setLocation] = useLocation();
  const token = getJwt();
  console.log(token);

  // useEffect for getting the user's data when the component mounts
  useEffect(() => {
    // after component mounts (render for 1st time), use axios to get the current login profile

    if (!token) {
      // if token doesnt exist -> tell user only login user can see profile
      showMessage("You must be logged in", "danger");
      setLocation("/login");
    } else {
      const fetchData = async () => {
        // to provide the jwt, 2nd argument in axios.get is a configuration object.
        // there must be a `headers` key with an `Authorization` key annd then `Bearer <token>`
        const response = await axios
          .get(import.meta.env.VITE_API_URL + "/api/users/me", {
            headers: {
              // make sure theres a space btwn bearer and token
              Authorization: "Bearer " + token,
            },
          })
          .catch(function (e) {
            showMessage("Please login again", "danger");
            setLocation("/");
          });
        // console.log(response.data); -> returns an object with a key of 'user' and the value is the user data
        setInitialValues({
            ...response.data.user, 
            // because in the db it's not stored as marketingPreferences, so
            // we need to clone the user preferences (and its string value in preference key)
            // into marketingPreferences
            marketingPreferences: response.data.user.preferences.map(p => p.preference)
        });
      };
      fetchData();
    }
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    salutation: Yup.string().required(),
    country: Yup.string().required()
  })

  const handleSubmit = async (values) => {
    if (!token) {
        showMessage("You need to be logged in to make the change", "danger");
        setLocation("/login");
    } else {
        // 2nd argument is values that u wanna submit to the api
        // 3rd argument is configuration
        await axios.put(import.meta.env.VITE_API_URL + "/api/users/me", values, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .catch((e) => {
            showMessage(("Error updating your user profile"));
        })

        showMessage("Your profile has been updated!", "success");
    }
  }

  const handleDeleteAccount = async () => {
    // delete doesnt have payload
    // can use react bootstrap or sweetalert2 -> "are u sure u want to delete"
    const confirmDelete = confirm("Are you sure you want to delete?")
    if (confirmDelete) {
        axios.delete(import.meta.env.VITE_API_URL + "/api/users/me" , {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        showMessage("Your account has been deleted", "success");
        setJwt(null);
        setLocation("/register");
    }
  }

  return (
    <div className="container">
      <h1>User Profile</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize // Allows form to reinitialize with fetched profile data ->
        // when initialValues change due to axios.get, form will redraw itself
      >
        {function (formik) {
          return (
            <Form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="salutation" className="form-label">
                  Salutation
                </label>
                <Field
                  as="select"
                  id="salutation"
                  name="salutation"
                  className="form-control"
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Dr">Dr.</option>
                </Field>
                <ErrorMessage
                  name="salutation"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="marketingPreferences" className="form-label">
                  Marketing Preferences
                </label>
                <Field
                  as="select"
                  id="marketingPreferences"
                  name="marketingPreferences"
                  multiple
                  className="form-control"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </Field>
                <ErrorMessage
                  name="marketingPreferences"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <Field
                  as="select"
                  className="form-select"
                  id="country"
                  name="country"
                >
                  <option value="">Select Country</option>
                  <option value="sg">Singapore</option>
                  <option value="my">Malaysia</option>
                  <option value="in">Indonesia</option>
                  <option value="th">Thailand</option>
                </Field>
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-danger"
                />
              </div>

              {formik.errors.submit && (
                <div className="alert alert-danger">{formik.errors.submit}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary mb-2 mt-2"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Updating..." : "Update Profile"}
              </button>
              <a className="btn btn-danger me-2 ms-2 mb-2 mt-2" onClick={handleDeleteAccount}>Delete</a>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
