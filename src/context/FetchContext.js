import { createContext, useContext } from "react";

const FetchContext = createContext();

export const useFetchAction = () => useContext(FetchContext);

export const fetchData = async ( url, options = {}) => {
  const openUrl = `${process.env.REACT_APP_BACKEND_URL}/${url}`
  const response = await fetch(openUrl, {
    method: options.method,
    headers: {
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  return response
}

export const options = {}

options.postOption = (data) => {
  const option = {
    method: "POST",
    body: data
  }

  return option
}

options.getOption = (data) => {
  const option = {
    method: "GET",
    body: data ? data : undefined
  }

  return option
}

options.putOption = (data) => {
  const option = {
    method: "PUT",
    body: data ? data : undefined
  }

  return option
}

options.deleteOption = (data) => {
  const option = {
    method: "DELETE",
    body: data ? data : undefined
  }

  return option
}