import React, { useState, useEffect } from "react";
import * as ReactDOMServer from "react-dom/server";

import { EditablePage } from "@magnolia/react-editor";
import Basic from "../templates/pages/Basic";
import ReviewGrid from "../templates/components/ReviewGrid";
import MediaTypeData from "../templates/components/mediaType/MediaTypeData";
import MediaTypeList from "../templates/components/mediaType/MediaTypeList";
import RecommendationData from "../templates/components/recommendation/RecommendationData";
import Latest from "../templates/components/Latest";
import Hero from "../templates/components/Hero";
import { render } from "react-dom";

const nodeName = "/recommend";
const config = {
  componentMappings: {
    "recommend-lm:pages/basic": Basic,
    "recommend-lm:components/reviewgrid": ReviewGrid,
    "recommend-lm:components/mediaType/data": MediaTypeData,
    "recommend-lm:components/mediaType/list": MediaTypeList,
    "recommend-lm:components/recommendation/data": RecommendationData,
    "recommend-lm:components/hero": Hero,
    "recommend-lm:components/latest": Latest,
  },
};

// Use different defaultBaseUrl to point to public instances
const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const pagesApi = defaultBaseUrl + "/delivery/pages/v1";
const templateAnnotationsApi =
  defaultBaseUrl + "/environments/main" + "/template-annotations/v1";

const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

const fetchAllPages = async () => {
  const url = `${defaultBaseUrl}/delivery/pagenav/v1/recommend@nodes`;
  const response = await fetch(url, H);
  const json = await response.json();
  //console.log("****** json:" + JSON.stringify(json, null, 2));
  //var results = json.results;
  // json.push({ "@name": "recommend", "@path": "/recommend" });
  // json.push({ "@name": "", "@path": "/recommend" });

  return json;
};

export async function getStaticPaths() {
  console.log("Main page.getStaticPaths() Start. ");
  const posts = await fetchAllPages();
  console.log("****** json2:" + JSON.stringify(posts, null, 2));
  const paths = posts.map((post) => ({
    params: { pathname: ["recommend", post["@name"]] },
  }));
  paths.push({ params: { pathname: ["recommend"] } });
  paths.push({ params: { pathname: [""] } });

  //params: { pathname: [post["@name"]] },
  //p
  // const paths = [
  //   {params: {pathname: ["recommend", "dev2"],},},
  // ];

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

// export async function getServerSideProps(context) {
export async function getStaticProps(context) {
  var params = context.params;
  console.log("Main page. getStaticProps Start. ");
  //console.log("params: " + JSON.stringify(params, null, 2));

  console.log("pathname:" + JSON.stringify(params.pathname, null, 2));

  const name = params.pathname;
  const decodedName = decodeURI(name);
  var decodedName2 = decodedName.replace(",", "/");
  if (decodedName2 === "undefined") {
    decodedName2 = "";
  }
  console.log("decodedName2 yo: " + decodedName2);
  decodedName2 = "/" + decodedName2;
  decodedName2 = decodedName2.replace(new RegExp(".*" + nodeName), "");

  console.log("decodedName2 B: " + decodedName2);

  // const pagePath = "/" + decodedName2;
  const pagePath = nodeName + "/" + decodedName2;
  console.log("pagePath: " + pagePath);

  const isPagesApp = true; //context.query?.mgnlPreview || null;
  let props = {
    isPagesApp,
    isPagesAppEdit: isPagesApp === "false",
    pagePath: pagePath,
  };

  global.mgnlInPageEditor = props.isPagesAppEdit;

  // Fetching page content
  const url = pagesApi + props.pagePath;
  console.log("page: " + url);
  const pagesRes = await fetch(url, H);
  props.page = await pagesRes.json();

  console.log("Main page. gSSP End." + new Date().getSeconds());

  return {
    props,
  };
}

export default function Pathname(props) {
  const [templateAnnotations, setTemplateAnnotations] = useState();
  const { isPagesApp, isPagesAppEdit, page, pagePath } = props;

  // Fetch template annotations only inside Magnolia WYSIWYG
  useEffect(() => {
    async function fetchTemplateAnnotations() {
      //const url = templateAnnotationsApi + pagePath + "&subid_token=" + SUB_ID
      //const url = "https://delivery-preview.saas.magnolia-cloud.com/environments/main/template-annotations/v1/recommend2/dev1" //&subid_token=td8tdv78a6qyzt6p"

      // FAILS const url = "https://delivery-preview.saas.magnolia-cloud.com/environments/main/template-annotations/v1/recommend2/dev1?subid_token=td8tdv78a6qyzt6p"

      // FAILS const url = "https://delivery-preview.saas.magnolia-cloud.com/environments/main/template-annotations/v1/recommend2/dev1" //&subid_token=td8tdv78a6qyzt6p"

      // WORKS const url = "https://author-" + SUB_ID + ".saas.magnolia-cloud.com/.rest/environments/main/template-annotations/v1/recommend2"
      //const url = "https://author-" + SUB_ID + ".saas.magnolia-cloud.com/.rest/environments/main/template-annotations/v1/recommend2/dev1" //+ pagePath
      //WORKS https://author-td8tdv78a6qyzt6p.saas.magnolia-cloud.com/.rest/environments/main/template-annotations/v1/recommend2/dev1?mgnlPreview=false&mgnlChannel=desktop
      //WORKS https://author-td8tdv78a6qyzt6p.saas.magnolia-cloud.com/.rest/environments/main/template-annotations/v1/recommend2/dev1?STUFFF

      var url =
        "https://author-" +
        SUB_ID +
        ".saas.magnolia-cloud.com/.rest/environments/main/template-annotations/v1" +
        pagePath;
      url = url.split("?")[0] + "?STUFFF";

      console.log("templataes URL: " + url);
      const templateAnnotationsRes = await fetch(url, H);
      // const templateAnnotationsRes = await fetch(url);
      const templateAnnotationsJson = await templateAnnotationsRes.json();

      setTemplateAnnotations(templateAnnotationsJson);
    }

    if (isPagesApp) fetchTemplateAnnotations();
  }, [isPagesApp, pagePath]);

  const shouldRenderEditablePage =
    page && (isPagesApp ? templateAnnotations : true);

  // In Pages app wait for template annotations before rendering EditablePage
  return (
    <>
      {/* {props.element} */}

      {shouldRenderEditablePage && (
        <EditablePage
          content={page}
          config={config}
          templateAnnotations={templateAnnotations}
        />
      )}
    </>
  );
}
