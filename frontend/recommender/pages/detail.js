import * as React from 'react';
import { Typography, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import {createMarkup} from "../utils";

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID
const H = {headers:{"X-subid-token": SUB_ID}};


const fetchRec = async (name) => {
    console.log("fetchRec path:" + name)
    const url = `${defaultBaseUrl}/delivery/recommendations/v1/${name}`;
    //const url = `${defaultBaseUrl}/delivery/genres/v1/Science-Fiction`;
    console.log("rec: " + url)
    const response = await fetch(url, H);
    const json = await response.json();
    return json;
}

export async function getServerSideProps(context) {
  const resolvedUrl = context.resolvedUrl;

//   const REC_URL = process.env.NEXT_PUBLIC_MGNL_HOST + '/delivery/recommendations/v1';

//   const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID
//   const H = {headers:{"X-subid-token": SUB_ID}};


  const id = context.query.id
  //console.log("id:" + id)

  let props = {};

    const name = context.query.name;
    const decodedName = decodeURI(name)
    const decodedName2 = decodedName.replace(',','/')
    props = await fetchRec(decodedName2);
    //props.results = await fetchRecommendations(props.genre);


  //const url = REC_URL + '?@jcr:uuid=' +  id;
//   const url = REC_URL + '?cb=fds&@jcr:uuid=' +  id + "";
  
  //console.log('url:' + url)

//   const pagesRes = await fetch(url,H);
//   const res = await pagesRes.json();
//   props = res.results[0];

  console.log("props:" + JSON.stringify(props,null,2))

  return {
    props,
  };
}

export default function Detail({ id, name, description, image, user, type = {name: 'default'}, genres, link = 'default' }) {
    return (
        <Card>
            <CardMedia
                component="img"
                image={image['@link']}
                alt={image['@name']}
            />

            {/* <img src={image['@link']}
                alt={image['@name']}
                style={{maxHeight: "100px"}}
                /> */}


            <CardContent>
                <Typography gutterBottom variant="h3" component="div">
                    {name}
                </Typography>

                <Button size="large"  href={"mediaType?type=" + type.name}>
                    {type.name}
                </Button>

                <Typography></Typography>

                {genres.map((genre, index) => {
                        return (
                          <Button size="large" href={"genres" + genre['@path']} key={index}>
                              {genre.name}
                          </Button>
                        )}
                )}

                

                <Typography variant="body2" color="text.secondary" component="div" dangerouslySetInnerHTML={{__html:description}}>
              
                </Typography>

                <Typography>
                    -
                </Typography>

                <Typography>
                    Recommended by {user}
                </Typography>

            </CardContent>

            <CardActions>
                <Button size="large" variant="contained" href={link} target="_blank">
                    Check it out
                </Button>
            </CardActions>
        </Card>
    );
}
