import * as React from 'react';
import { Typography, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import {createMarkup} from "../utils";

export async function getServerSideProps(context) {
  const resolvedUrl = context.resolvedUrl;

  // const HOST = "https://author-onehob4efwibvpms.saas.magnolia-cloud.com"
  const REC_URL = process.env.NEXT_PUBLIC_MGNL_HOST + '/.rest/delivery/recommendations/v1';

  const id = context.query.id
  //console.log("id:" + id)

  let props = {};

  const url = REC_URL + '?@jcr:uuid=' +  id;
  console.log('url:' + url)

  const pagesRes = await fetch(url);
  const res = await pagesRes.json();
  props = res.results[0];

  //console.log("props:" + JSON.stringify(props,null,2))

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
