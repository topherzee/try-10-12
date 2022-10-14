import * as React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import {latestByType, mediaTypeById} from '../../src/api';
import ReviewGrid from './ReviewGrid';

export default function Latest(props) {

  const { title, type, limit } = props;
  console.log("Latest: type:"+ type)

  const [recommendations, setRecommendations] = useState([]);
  const [mediaType, setMediaType] = useState(null);

  const slice = (recommendations) => {
    setRecommendations(recommendations.slice(0, limit))
  }

  let url = ""
  useEffect(() => {
    mediaTypeById(type, setMediaType);
    latestByType(type, slice);
    //console.log("mediaType:" + JSON.stringify(mediaType,null,2))
  }, []);

  return (
    <Box sx={{flexGrow: 1, mt: 10 }}>
      <Typography variant="h3" component="h4">
        { title }
      </Typography>
      {recommendations && <ReviewGrid recommendations={recommendations} />}
      <Button size="small" href={(mediaType)?`/mediaType?type=${mediaType['name']}`:'/mediaType?type=all'}>
        See All
      </Button>
    </Box>
  );
}