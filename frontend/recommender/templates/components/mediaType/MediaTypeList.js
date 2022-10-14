import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { recommendationsByTypeData } from "../../../src/api";
import ReviewGrid from "../ReviewGrid";

export default function MediaTypeList() {
  const [recommendations, setRecommendations] = useState([]);
  const { query } = useRouter();
  useEffect(() => {
    recommendationsByTypeData(query.type, setRecommendations);
  }, []);

  return (
    <ReviewGrid recommendations={recommendations} />
  );

}
