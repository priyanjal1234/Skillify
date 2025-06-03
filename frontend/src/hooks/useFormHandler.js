import { useState, useEffect } from "react";
import { z } from "zod";

function useFormHandler(initials, validationSchema) {
  const [values, setvalues] = useState(initials);
  const [errors, seterrors] = useState({});

  function handleChange(e) {
    let { name, value } = e.target;
    setvalues((prev) => ({ ...prev, [name]: value }));

    try {
      validationSchema?.pick({ [name]: true }).parse({ [name]: value });
      seterrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        seterrors(fieldErrors);
      }
    }
  }

  return {
    values,
    setvalues,
    handleChange,
    errors,
  };
}

export default useFormHandler;
