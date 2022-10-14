import * as React from 'react';
import { Typography } from '@mui/material';
import ReviewGrid from '../../templates/components/ReviewGrid';

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;

const fetchGenre = async (name) => {
    console.log("fetchGenre path:" + name)
    const url = `${defaultBaseUrl}/.rest/delivery/genres/v1/${name}`;
    //const url = `${defaultBaseUrl}/.rest/delivery/genres/v1/Science-Fiction`;
    console.log("genre: " + url)
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

const fetchRecommendations = async (genre) => {
    const url = `${defaultBaseUrl}/.rest/delivery/recommendations/v1/?genres=${genre['@id']}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.results;
}

export async function getServerSideProps(context) {
    let props = {};

    const name = context.query.name;
    const decodedName = decodeURI(name)
    const decodedName2 = decodedName.replace(',','/')
    props.genre = await fetchGenre(decodedName2);
    props.results = await fetchRecommendations(props.genre);

    return {
        props,
    };
}

export default function Genre({genre, results}) {
    return (
        <>
            <Typography
                component="h1"
                variant="h2"
                align="left"
                color="text.primary"
                gutterBottom
            >
                {genre && genre.name}
            </Typography>
            {results && results.length > 0 ? (
                <ReviewGrid recommendations={results} />
            ) : (
                'There are no recommendations in this genre.'
            )}
        </>
    );
}
