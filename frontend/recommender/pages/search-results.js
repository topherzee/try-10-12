import * as React from 'react';
import { setURLSearchParams } from "../utils";
import { Typography } from "@mui/material";
import ReviewGrid from '../templates/components/ReviewGrid';

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;

export async function getServerSideProps(context) {
  let props = {};

  const term = context.query.q
  const url = setURLSearchParams(`${defaultBaseUrl}/.rest/delivery/recommendations/v1`, `q=${term}`)
  const response = await fetch(url);
  const json = await response.json();
  props.results = json.results;

  return {
    props,
  };
}

export default function BasicGrid({results}) {

    return (
        <>
            <Typography
                component="h1"
                variant="h2"
                align="left"
                color="text.primary"
                gutterBottom
            >
                Search Results
            </Typography>
            <ReviewGrid recommendations={results} />
        </>
    );
}